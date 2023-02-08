---
name: 'perfect-api-server-part-c-jobs'
title: 'Perfect API Server - Long processing via Rest API'
year: February 8, 2023
color: '#8e7964'
# trans: 'perfect-api-server-part-c-jobs'
id: 'perfect-api-server-part-c-jobs'
description: The right & easy way for asynchronous request processing via Rest API - Part III - Long processing via Rest API
---

----
> *Setting Up React Application With Generated API Facade*
>
> [Part I](/en/blog/perfect-api-server-part-a) – Setting Continues Integration (CI)
>
> [Part II](/en/blog/perfect-api-server-part-b) – Setting Up Front Facade
>
> <ins>[Part III](/en/blog/perfect-api-server-part-c-jobs) – Long processing via Rest API <ins>
>
----

<br>
<br>
<br>
<br>

In this article, we will discuss the reasons and the architecture behind implementing a system for managing long-processing tasks through a REST API.

# The Motivation

In real-world applications, some API requests may take longer to complete than the typical duration of TCP/HTTP requests.

This may occur while handling extensive data processing or conducting ongoing procedures, where it becomes necessary to trigger the process through the API and retrieve the outcome via another API call at a later time.

# The Naïve Solution

At first glance, it seems simple enough to solve the issue of long-running API requests - just create an API call to initiate the task, and another to check on its status.

However, this approach quickly becomes complicated as more processes are added and run in parallel. 

Keeping track of each process's unique identifier and managing their statuses becomes a task in and of itself. 

Additionally, adding new processes operations that follow this "trigger and check" pattern only exacerbates the issue, leading to an unwieldy and difficult to maintain codebase. 

This is where this article comes in, proposing a more effective solution for implementing a job mechanism within an API service.

# Solution Objectives

* Offer a straightforward and generic method for making any request a "job"
* Ensure consistency in implementation, regardless of the operation's synchrony
* Facilitate easy delivery of status updates to consumers (progress, message, etc.)
* Offer comprehensive and user-friendly configurations for asynchronous operations (timeout, retry, etc.)
* Ensure ease of use for consumers with a simple and intuitive interface.


# Basic Solution Infrastructure

The suggested solution is to include an HTTP header that indicates if the operation is a job or not.

A middleware would be added to check this header before the operation starts. 

If the header is not present, the original behavior continues. However, if the header indicates that the operation is a job, the operation will be sent to a job service for background execution instead of running immediately. 

The newly created job identifier is then returned to the consumer and the HTTP connection is closed.

On the consumer side, a middleware would also be added to the "fetch" operation to read the headers from the backend. 

If the operation is marked as a job, instead of returning the payload to the caller, the job API will be queried with the returned job ID until the final result payload is obtained and returned to the caller.

# Full Solution

The proposed solution can be further improved by utilizing the TSOA library. 

TSOA is a tool for Node.js and Express that enables developers to declare API controllers once, and generate Express routes, schema validation, and OpenAPI schema from it.

Similar tools are available for other programming languages such as Spring for Java, in this article, TSOA will be used as an example, but the principles can be applied to other technologies as well. 

By using TSOA, a new header for jobs can be added and validated, and the route generation template can be extended to include the new middleware.

> The example is based on the first part of the article. see [Setting Up Server](/en/blog/perfect-api-server-part-a)
>
> Run `yarn add promise-timeout sleep-promise unitsnet-js uuid`, Those libraries will be used in the following code examples.


First, let's create a new job service. This service should include a collection of jobs, as well as functions for adding new jobs, retrieving their status, and removing them.


```typescript
/**
 * The job flag, mark whenever the operation should be executed as a job or not
 */
export enum JobFlag {
    ON = 'ON',
    OFF = 'OFF',
}

/**
 * The header name for the job flag, for the header context @see JobFlag
 */
export const JobFlagHeader = 'x-job-flag'

/** Job status */
export enum JobStatus {
    DONE = 'DONE',
    STARTED = 'STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    FAILED = 'FAILED',
}

/** The job execution options */
export interface JobOptions {
    timeoutInMs?: number;
}

/** The job progress status */
export interface JobProgress {
    /** The job progress in % */
    percentage: number;
    message?: string;
}

/** The job state */
export interface JobState {
    jobId: string;
    /** Job starting timestamp in EPOCH */
    startedOn: number;
    /** Job finished timestamp in EPOCH, undefined if not finished yet */
    finishedOn?: number;
    /** The job status */
    status: JobStatus,
    /** The job results payload, undefined if not yet finished */
    results?: any;
    /** The job progress */
    progress: JobProgress;
}

/**
 * Add & execute a new job
 * @param operation The operation to execute
 * @param options The job options
 * @returns The newly created job id
 */
export function runNewJob(operation: () => any, options?: JobOptions): string {
    // Logic implementation
    return newJobId;
}

/**
 * Publish a new update on a job progress
 * @param jobId The job id
 * @param jobProgress The progress
 */
export function publishProgress(jobId: string | undefined, jobProgress: JobProgress) {
    // Logic implementation
}

/**
 * Get job state by id
 * @param jobId The job id
 * @returns The @see JobState or undefined if not exists
 */
export function getJob(jobId: string): JobState | undefined {
    return jobs[jobId]?.jobState;
}

/**
 * Remove the job from the jobs collection
 * @param jobId The job id to remove
 */
export function removeJob(jobId: string) {
    delete jobs[jobId];
}
```

Go to the to [jobs.service.ts](https://github.com/haimkastner/node-api-spec-boilerplate/blob/main/src/services/jobs.service.ts) to see the full implementation

The TSOA library has a controller class that all controllers should inherited from. 

We will inherits this class with a class contained a new context specifically for jobs. 

This will allow developers to access the job context and update the progress status from anywhere in the code. 

The new extended controller base will look like this:
```typescript
import { Controller } from "tsoa";

/**
 * The context with some meta about request.
 */
export interface ControllerContext {
    /** The job id, or undefined if it's not a job request */
    jobId?: string;
}

export class BaseController extends Controller {
    /** The request context */
    public context: ControllerContext;
    constructor () {
        super();
        // Init as empty, later it will be injected in the middleware
        this.context = {};
    }
}
```

The next step is to implement a "jobify" function. 

This function takes the request meta and operation, and runs it as a job if required. 

This function, for a request marked as a job, retrieves the original operation and runs it as a job and returning the job id to the consumer. 

Additionally, a new "JobOption" function will be added, serving as a function annotation to hold job options defined for the operation.

When a request arrives, the options will be retrieved from the cache if the operation matches.

```typescript
import { JobFlag, JobFlagHeader, runNewJob , JobOptions as JobOptionsObject } from "../services/jobs.service";
import { BaseController } from "./base.controller";

export interface JobInfo {
    jobId: string;
}

/** Hold job option per operation name */
const predefinedJobOptions : { [operation in string]: JobOptionsObject } = {};

/**
 * Set predefined job option annotation.
 * @param options The job options to defined.
 */
export const JobOptions = (options: JobOptionsObject) : Function => ((target: any, operationName: string) => {
    // The operation name is a unique name given to every API call. 
    predefinedJobOptions[operationName] = options;
})

/**
 * "Jobify" operation by getting the request, controller and the operation method, and executing it as a job if required.
 * This function will be called by the generated TSOA routes before and operation execution.
 * @param request The HTTP request called by consumer
 * @param controller The controller instance created for this operation 
 * @param method The method in the controller to execute to run the operation
 * @param args The method args to execute with.
 * @param operationName The operation name key.
 * @returns The original payload to return or jobId JobInfo in case of running as a job
 */
export async function jobify(request: any, controller: BaseController, method: () => any, args: any, operationName: string) : Promise<any | JobInfo> {
    // Read the job flag header
    const jobFlag = request?.headers?.[JobFlagHeader] as JobFlag;
    if (jobFlag !== JobFlag.ON) {
        // If it's not marked as a job, just run it with any additional logic.
        return method.apply(controller, args);
    }
    // Add the operation execution as a new job. 
    const jobId = runNewJob(() => method.apply(controller, args), predefinedJobOptions[operationName]);
    // Inject the new created jod id to the controller context
    controller.context = { jobId };
    // Set job flag as ON to be send back to the consumer. 
    controller.setHeader(JobFlagHeader, JobFlag.ON)
    // Return to express the @see JobInfo instead the original operation return payload. 
    return {
        jobId
    } as JobInfo;
}
```

Go to the to [jobify.middleware.ts](https://github.com/haimkastner/node-api-spec-boilerplate/blob/main/src/infrastructure/jobify.middleware.ts) to see the full implementation

Don't forget to add the job header as an exposed header in CORS to allow the consumer to read the header, even under browser header protection.

To do this, modify the CORS declaration in the `src/app.ts` file to include the `JobFlagHeader` imported from the `jobs.service`:

```typescript
import { JobFlagHeader } from "./services/jobs.service";
// ....
// Open cross--origin access and allow JS in browser to read job flag header
app.use(cors({ origin: true, exposedHeaders: JobFlagHeader }));
```
You can find the full file at [app.ts](https://github.com/haimkastner/node-api-spec-boilerplate/blob/main/src/app.ts)


The solution involves modifying the TSOA Express template to use a jobify function for each generated route. 

The TSOA Express template can be found in [express.hbs](https://github.com/lukeautry/tsoa/blob/master/packages/cli/src/routeGeneration/templates/express.hbs).

The TSOA configuration file `tsoa.json` should be updated to specify a new property named `middlewareTemplate`, with the path to the template as its value.
A full example of the file can be found at [tsoa.json](https://github.com/haimkastner/node-api-spec-boilerplate/blob/main/tsoa.json).

In the template, the jobify function will be imported, and in the section where the operation is executed, the execution will be replaced with the jobify function. 

The jobify section of the template should look something like this.

```typescript
// TEMPLATE EDIT: instead of calling method directly, give it to jobify to run it as a job if need
const promise = jobify(request, controller as any, controller.{{name}} as any, validatedArgs as any, '{{name}}');
```

The full TSOA Express template with the jobify function added can be viewed at [routes.template.hbs](https://github.com/haimkastner/node-api-spec-boilerplate/blob/main/src/infrastructure/routes.template.hbs)



The final step in the backend infrastructure is to add an API for jobs to retrieve their status. 

This simple API will allow consumers to check the progress of a job they've submitted, and to determine if the job has completed or encountered an error.

```typescript
import { Delete, Get, Header, Route, Tags, SuccessResponse, Response } from "tsoa";
import { JobFlag, JobFlagHeader, getJob, JobState, removeJob } from "../services/jobs.service";
import { BaseController } from "../infrastructure/base.controller";

@Tags('Jobs')
@Route("jobs")
export class JobsController extends BaseController {
    @Response(404, 'Job not found')
    @Get('{jobId}')
    public async getJob(jobId: string): Promise<JobState> {
        const job = getJob(jobId);
        // If job exists set 404 as status and abort.
        if (!job) {
            this.setStatus(404);
            return {} as any;
        }
        return job;
    }
}
```
The complete implementation of this can be found at [jobs.controller.ts](https://github.com/haimkastner/node-api-spec-boilerplate/blob/main/src/controllers/jobs.controller.ts)

Once all set, we can now easily declare a new API which can be run as job.

To create a new API that can be run as a job, 
all you need to do is create a new controller with an operation that contains a header for the job. That's it.

```typescript
@Tags('Status')
@Route("status")
export class LongPingController extends BaseController {
    @Post('/long')
    public async longPing(@Header(JobFlagHeader) jobFlag: JobFlag): Promise<LongPong> {
        const startedOn = new Date().getTime();
        await sleep(Duration.FromSeconds(2).Milliseconds);
        const endedOn = new Date().getTime();
        return {
            timeTook: endedOn - startedOn
        };
    }
}
```

Let's also demonstrate how to add a job option with a timeout, and how to use the job id from the context to publish the progress of the job.

First, we will set the timeout option in the job option, so the job will be terminated after the specified time if it's not completed.

Next, we will use the job context mechanism to publish the progress of the job. 

This will allow the consumer to receive updates on the status of the job as it is being executed.

```typescript
@Tags('Status')
@Route("status")
export class LongPingController extends BaseController {

    /**
     * Send long ping that can take some time to finished, this operation can be invoked as a job.
     * @param jobFlag The flag whenever run this operation as a job.
     * @returns The operation response payload
     */
    @JobOptions({ timeoutInMs: 1000 * 60 })
    @Post('/long')
    public async longPing(@Header(JobFlagHeader) jobFlag: JobFlag): Promise<LongPong> {

        // Sample the time once the operation starts
        const startedOn = new Date().getTime();
        console.log(`New long ping operation request arrived`);
        // Publish operation status using the job got in context
        publishProgress(this.context.jobId, { percentage: 10, message: 'Starting the process right now' });
        await sleep(Duration.FromSeconds(5).Milliseconds);
        publishProgress(this.context.jobId, { percentage: 50, message: 'We are on the middle of the work' });
        await sleep(Duration.FromSeconds(5).Milliseconds);
        publishProgress(this.context.jobId, { percentage: 95, message: 'We almost done' });
        await sleep(Duration.FromSeconds(2).Milliseconds);
        publishProgress(this.context.jobId, { percentage: 100, message: 'Processing finished' });
        const endedOn = new Date().getTime();

        return {
            timeTook: endedOn - startedOn
        };
    }
}
```

The full implementation can be seen at [long.point.controller.ts](https://github.com/haimkastner/node-api-spec-boilerplate/blob/main/src/controllers/long.point.controller.ts)


See how this infrastructure makes it simple and straightforward to set any operation to run as a job without any additional requirements.

### The consumer part

The consumer can easily support the job functionality by using an external fetch (instead of the browser's built-in) that inspects the headers returned from the API.

If the header is marked as a job, the new fetch would query the get job API instead of returning the payload immediately, and only return the payload once the job is completed. 

In our example project, with the API being generated into OpenAPI spec and an SDK generated from it, utilizing job functionality is made even easier.

> The example is based on the second part of the article. see [Setting Up Front Facade](/en/blog/perfect-api-server-part-b)

To implement the use of jobs on the consumer side, the first step is to modify the generating SDK template `api.mustache` file to use an external fetch.

This involves adding a new type for RequestOptions, which includes a callback to be invoked during job progress updates, and a new type for the get job method.

This new type includes the get-job operation itself, the context of the operation, and the RequestOptions defined by the caller.

```typescript
// {{! TEMPLATE EDIT: Pass get jobs ability to the fetch middleware for job infrastructure }}
/** The request options */
export interface RequestOptions {
    /** A callback to be called on each job update come from server */
    progressCallback?: (jobProgress: JobProgress) => void;
}

// {{! TEMPLATE EDIT: The job function to be called in order to get job status by pull from server. }}
export interface JobFunction {
    method: (xJobFlag: "OFF", jobId: string) => Promise<JobState>;
    theThis: any;
    requestOptions?: RequestOptions;
}

export interface FetchAPI {
    // {{! TEMPLATE EDIT: Pass get jobs ability to the fetch middleware for job infrastructure }}
    (url: string, jobFunction: JobFunction, init?: any): Promise<Response>;
}
```

Modify the template to expose the RequestOptions option to the API caller
```typescript
 // {{! TEMPLATE EDIT: Do not allow pass options, add requestOptions for job infrastructure }}
    public {{nickname}}({{#allParams}}{{paramName}}{{^required}}?{{/required}}: {{{dataType}}}, {{/allParams}} requestOptions?: RequestOptions) {
        return {{classname}}Fp(this.configuration).{{nickname}}({{#allParams}}{{paramName}}, {{/allParams}} undefined, requestOptions)(this.fetch, this.basePath);
    }
```

Pass all of it to the external fetch.
```typescript
 // {{! TEMPLATE EDIT: Add requestOptions for job infrastructure }}
        {{nickname}}({{#allParams}}{{paramName}}{{^required}}?{{/required}}: {{{dataType}}}, {{/allParams}}options?: any, requestOptions?: RequestOptions): (fetch?: FetchAPI, basePath?: string) => Promise<{{#returnType}}{{{returnType}}}{{/returnType}}{{^returnType}}Response{{/returnType}}> {
            const localVarFetchArgs = {{classname}}FetchParamCreator(configuration).{{nickname}}({{#allParams}}{{paramName}}, {{/allParams}}options);
            return (fetch: FetchAPI = portableFetch, basePath: string = BASE_PATH) => {
                // {{!  TEMPLATE EDIT: Pass get jobs and 'this' to the fetch middleware and requestOptions for job infrastructure }}
                return fetch(basePath + localVarFetchArgs.url, { method: ApiFacade.JobsApi.getJob, theThis: this, requestOptions }, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response{{#returnType}}.json(){{/returnType}};
                    } else {
                        throw response;
                    }
                });
            };
        },
```

Next step is to implement the fetch middleware and integrate it with the generated APIs. 

This "fetchMiddleware" will receive the original URL and HTTP options, as well as the get job method.

Upon receiving a response from the API server, if it's a job, it will start querying the job API. 

See the full implementation

> Run `yarn add sleep-promise`, This library allows you to wait for the next query job tick.

```typescript
import { JobFlag, JobFunction, JobStatus } from "../generated/swagger/api";
import sleep from 'sleep-promise';

/**
 * Await to get to be finished, get status by pulling
 * @param jobId The job id to query
 * @param jobFunction The pulling function
 * @returns The job result on finished
 */
async function awaitForAJob(jobId: string, jobFunction: JobFunction) : Promise<any> {
    // Start the pulling loop
    while (true) {
        // Run the pulling function *NOT AS A JOB*
        // Thh requirement for this injection instead of calling get job API is due to circular import. 
        const jobState = await jobFunction.method.apply(jobFunction.theThis, [JobFlag.Off, jobId]);

        console.log(`New update for job "${jobId}" arrived status "${jobState.status}" with progress ${jobState.progress.percentage}% msg:"${jobState.progress.message || ''}" `);
        // If consumer provided a callback to be called on update, execute it with the new state arrived from server.
        jobFunction.requestOptions?.progressCallback?.(jobState.progress);
        switch (jobState.status) {
            case JobStatus.Done: // If process finished return the 
                return jobState.results;
            case JobStatus.Failed: // IF pulling failed, throw an exception
                throw new Error(`Job ${jobId} failed`);
            default:
                break;
        }
        // Sleep for a while till the next pulling
        await sleep(1000 * 5);
        // TODO: implement some kind of timeout.
    }
}

/**
 * A middleware for browser's fetch, to handle job processing. 
 * @param url The request URL
 * @param jobFunction The job status fetch by pulling function with the params for it
 * @param options The fetch HTTP options
 * @returns The object contained the HTTP Response
 */
export async function fetchMiddleware(url: string, jobFunction: JobFunction, options?: any): Promise<Response> {

    // Start by calling the original fetch 
    const response = await fetch(url, options);

    // Look after the job flag in the responded headers
    const isJob = response.headers.get('x-job-flag') === JobFlag.On;

    // If it's not a job, just return the original object and basically do nothing.
    if (!isJob) {
        return response;
    }

    // If it's do a job, ready payload to get the job id
    const jobInfo = await response.json();
    // Await to the job to be done
    const jobResults = await awaitForAJob(jobInfo.jobId, jobFunction);
    // Replace the "get json payload" of the original request with a function that will return the payload arrived from the job
    // This is what the consumer is want, not the job id in the original request :) 
    response.json = () => jobResults;
    // Return it back to the consumer
    return response;
}
```

The final step is to modify the SDK template to use the "fetchMiddleware" instead of the built-in fetch.

```typescript
import { fetchMiddleware } from "../../infrastructure/fetch.middleware";
const portableFetch = fetchMiddleware;
```

The final `api.mustache` template file can be viewed at [api.mustache]( https://github.com/haimkastner/react-typescript-spec-facade/blob/main/resources/openapi/templates/typescript-axios/api.mustache)

And the final `fetchMiddleware` at [fetch.middleware.ts](https://github.com/haimkastner/react-typescript-spec-facade/blob/main/src/infrastructure/fetch.middleware.ts)


The modifications for handling jobs are now ready to be used in the front end. 

To apply the changes, the front end needs to be rebuilt by using `yarn prebuild`.

Once the rebuild is done, all generated SDK will contain the necessary changes. 

In any app component, the operation can be called just like any other API call.

```typescript
const pong = await ApiFacade.StatusApi.longPing(JobFlag.On);
```
And if you choose to, you can pass a progress callback as well.
```typescript
const pong = await ApiFacade.StatusApi.longPing(JobFlag.On, {
        progressCallback: (jobProgress: JobProgress) => { // This is optional, pass the set progress set state to be updated
          console.log(jobProgress.percentage, jobProgress.message);
        }
      });
```
The full implementation example can be seen at [LongProcess.tsx](https://github.com/haimkastner/react-typescript-spec-facade/blob/main/src/LongProcess.tsx)


Adding a new operation in the API and consuming it in the frontend has never been easier, as demonstrated in above's example. 
 
 1. Add a new operation in backend
 1. Mark it as job in backend
 1. Build backend
 1. Build frontend
 1. Consume the new operation in your component

The process is straightforward, simple, and quick.


This infrastructure has a lot of potential and only the beginning has been demonstrated. Consider the possibility of:

    
- Aborting Jobs
- Real-time updates through web-socket to get job updates immediately by push.
- Job options that can be set from the front-end and enforced by the server.
- An execution queue to allow running jobs synchronously.
- Integrating with notification and task history systems.
- External caching/persistence for scaling services (such as Redis or Dynamo).


# Conclusion

Having a unified infrastructure opens up many possibilities as demonstrated above, and it makes easier to add new abilities and consume them in the frontend. 

As for the job mechanism, you can achieve powerful features by extending the simple infrastructure.

For more information and to explorer the source-code as well as the live example of the jobs mechanism in action, check out the available resources:

- A live example app is available at [https://react-typescript-spec-facade.castnet.club](https://react-typescript-spec-facade.castnet.club/)
- A specification with the jobs API is available on [SwaggerHub](https://app.swaggerhub.com/apis/haimkastner/node-api-spec-boilerplate)
- The backend implementation is available at [node-api-spec-boilerplate](https://github.com/haimkastner/node-api-spec-boilerplate) GitHub Repository.
- The frontend implementation is available at [react-typescript-spec-facade](https://github.com/haimkastner/react-typescript-spec-facade) GitHub Repository.

----

Photo by <a href="https://burst.shopify.com/@matthew_henry?utm_campaign=photo_credit&amp;utm_content=High+Res+Colorful+Toy+Gears+Picture+%E2%80%94+Free+Images&amp;utm_medium=referral&amp;utm_source=credit">Matthew Henry</a> from <a href="https://burst.shopify.com/api-kids-babies?utm_campaign=photo_credit&amp;utm_content=High+Res+Colorful+Toy+Gears+Picture+%E2%80%94+Free+Images&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>
