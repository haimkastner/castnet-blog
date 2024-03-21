---
name: 'perfect-api-server-part-a'
title: 'Perfect API Server - Node.JS API Spec Boilerplate'
year: 17 July 2022
color: '#8e7964'
# trans: 'perfect-api-server-part-a'
id: 'perfect-api-server-part-a'
description: Build API server fast and get API spec, documentation and consumer facade for free - Part I - Setting Up Server
---

----
> *Perfect API Server - Node.JS API Spec Boilerplate*
>
> <ins>[Part I](/en/perfect-api-server-part-a) – Setting Up Server</ins>
>
> [Part II](/en/blog/perfect-api-server-part-b) – Setting Up Front Facade
>
> [Part III](/en/blog/perfect-api-server-part-c-jobs) – Long processing via Rest API 
>
> [Part IV](/en/blog/perfect-api-server-part-d-sdk) – SDK Setup
>
----

<br>
<br>

Consider you are about to implement a new API server, you need to... 
- Implement the API server, including the data schemas going to be used.
- Implement schemas validation to make sure a payload arrived as expected.
- Write some documentation, and describe all available APIs and objects.
- Write all data schemas again, as duplication, in the client application that going to consume this API.
- Now, what if you'd like to, say, add an API? or perhaps extend the payload of an existing one? Well, now you have to change the documentation, validation, schema and the client application, again, and again 😱😱😱

What if... you can write API once, then, get for free, API schema validation on the API server, full OpenAPI spec that also allows publishing API, generating client facade and import schemas, and much more, it will be a perfect API server, isn't it?

This article will teach how to do it easily on the Node.JS platform.

This step-by-step manual is for starting a project from scratch, but the setting can be made on an already existing project and will not require many changes to adjust to being a perfect API Server 😎

## Set Up Node.JS + TypeScript Project

First, make sure [Node.Js](https://nodejs.org/en/about/) as well as [NPM](https://docs.npmjs.com/about-npm) installed on the machine, if not [install both](https://nodejs.org/en/download/).

Once NPM is ready, is recommended to install [yarn](https://yarnpkg.com/) as this is the dependency manager in this article, by `npm -i -g yarn` command.

Also, install [TypeScript](https://www.typescriptlang.org/) globally in order to use it in the project by the `npm -i -g typescript` command.

Create an empty folder and open the command-line/terminal in the new created folder directory.

Run `npm init` to create an empty JS project.

Run `tsc --init` to create an empty TS project, and run `yarn add -D typescript` to add TS to the project.

Install the following dependencies:
* `yarn add express` for using [Express]() router
* `yarn add body-parser` for parsing HTTP requests payloads
* `yarn add cors` for opening server for cross-origin requests
* `yarn add dotenv` for loading environment variables from an `.env` file
* `yarn add -D @types/express @types/cors` for getting TS interfaces for used dependencies.

And now let's prepare the server.

Open the folder directory in your favorite IDE, such as [VS Code](https://code.visualstudio.com/)

Create `src` directory on the root of the project, where the code will be stored.

Within `src` directory create a new file named `app.ts` and fill it with the most simple express app:

```typescript

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';

// Load variables from .env file
dotenv.config();

export const app = express();

// Open cross--origin access
app.use(cors());

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Use passed PORT or as default 8080
const port = process.env.PORT || 8080;

// Start listening to requests
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
```

Back to the root of the project open the `ts.config` file, and modify the following properties:

* `target` - The typescript build JS target, set to be "ES2020"
* `rootDir` - The source-code directory, uncomment and set to be "./src"
* `outDir` - The compiled JS output directory, uncomment and set to be "./dist"
* `experimentalDecorators` - Allow TS decorators need for the controllers, uncomment and set to be "true"
* `resolveJsonModule` - Allow native import to JSON files, uncomment and set to be "true"

Go to the `package.json` file, in the scripts section add the following scripts:

* `"build": "tsc",` - to complice TS to JS.
* `"start": "node dist/app.js",` - to run the server once it's ready.

Now the server is ready, run the `yarn build` & `yarn start` and the server is up and running!
```
Example app listening at http://localhost:8080
```

As default it's on port 8080, to modify it, set `PORT` environment variable, or create a `.env` file with the following content:

```
PORT="8080"
```

Stop and rebuild and start again, you the server runs on the new port 8080
 
## Set Up TSOA

To the fun part, adding the API controllers!

The [TSOA](https://github.com/lukeautry/tsoa) is an awesome library used to write API controllers once and from it to generate in build-time OpenAPI spec and routes validation, it really worth to take look at their documentation [here](https://tsoa-community.github.io/docs/).

Add TSOA dependencies by `yarn add tsoa`

Create a new configuration file for tsoa called `tsoa.json` in the project's root.

Within it configure the project entry point, the controllers directory, routes and spec output directory, for more see [TSOA docs](https://tsoa-community.github.io/docs/getting-started.html#configuring-tsoa-and-typescript).

```json
{
    "entryFile": "src/app.ts",
    "noImplicitAdditionalProperties": "throw-on-extras",
    "controllerPathGlobs": [
      "src/**/*controller.ts"
    ],
    "spec": {
      "outputDirectory": "src/generated",
      "specVersion": 3
    },
    "routes": {
      "routesDir": "src/generated"
    }
}
```

In case don't yet exists a `.gitignore` file, create it on the project's root, with the following file & directories to exclude:
```

generated/
.env
node_modules/
```

In the `package.json` scripts modify the build command to:
```
"build": "tsoa spec-and-routes && tsc",
```
to generate TSOA routes and OpenAPI spec during the build.

In the `src/app.ts` add the TSOA generated routes in the server by importing the generated routes `import { RegisterRoutes } from "./generated/routes";`, and applying it to the express application `RegisterRoutes(app);` after payload parsing middleware.

The app.ts should look like:
```typescript

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import { RegisterRoutes } from "./generated/routes";

// Load variables from .env file
dotenv.config();

export const app = express();

// Open cross--origin access
app.use(cors());

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Register TSOA generated API routes - *AFTER* payload parsed
RegisterRoutes(app);

// Use passed PROT or as default 8080
const port = process.env.PORT || 8080;

// Start listening to requests
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
```

Now it's time to finally create the API controller.

Within the src directory create `controllers` folder, within it,  all the controllers will be.

In it create a new controller file, for example, it will be a simple ping controller named `ping.controller.ts`.

Create a controller class inherited from the TSOA controller and declare the operation within it, see [TSOA docs](https://tsoa-community.github.io/docs/getting-started.html#defining-a-simple-controller) how to, in this example it will be like this:

```typescript

import { Body, Controller, Post, Query, Route, Tags, } from "tsoa";

interface Ping {
    /** Who is the request caller (free text) */
    whois: string;
}

interface Pong {
    /** The greeting message arrived from the API caller */
    greeting: string;
    /** The tome when the ping request arrived */
    time: number;
}

@Tags('Status')
@Route("Status")
export class PingController extends Controller {

    /**
     * Send Ping request to API server.
     * @param greeting The greeting to send :)
     * @param ping The ping payload
     * @returns A Pong object
     */
    @Post()
    public async ping(@Query() greeting: string, @Body() ping?: Ping): Promise<Pong> {

        console.log(`New ping arrived from "${ping?.whois}" who greet us with "${greeting}" :)`);
        return {
            greeting,
            time: new Date().getTime(),
        };
    }
}
```

Build the project again and with the `src/generated` directory new 2 files will appear.
* `routes.ts` The generated express routes with validation as declared in the controller.
* `swagger.json` The OpenAPI (swagger) spec generated from the API controllers.

To make it easy to explorer the generated spec and trigger calls, let's add an route to serve the spec using [swagger-ui](https://swagger.io/tools/swagger-ui/)

Add the swagger-ui dependency by `yarn add swagger-ui-express && yarn add -D @types/swagger-ui-express`.

And in the `src/app.ts` add the spec route serve by:
```typescript

import * as swaggerUi from 'swagger-ui-express';

...

app.use('/', swaggerUi.serve, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.send(swaggerUi.generateHTML(await import('./generated/swagger.json')));
});
```

The final `src/app.ts` should look like this:

```typescript

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import * as swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from "./generated/routes";

// Load variables from .env file
dotenv.config();

export const app = express();

// Open cross--origin access
app.use(cors());

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Register TSOA generated API routes
RegisterRoutes(app);

// Server Swagger UI
app.use('/', swaggerUi.serve, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.send(swaggerUi.generateHTML(await import('./generated/swagger.json')));
});

// Use passed PROT or as default 8080
const port = process.env.PORT || 8080;

// Start listening to requests
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
```

Build server and start it again, open any browser and navigate to [`http://localhost:8080`](http://localhost:8080) or the port set to be listed to, and explore the API spec.

<image-responsive class="center" imageURL="blog/perfect-api-server-part-a/local-spec.jpg"  alt="local spec"/>


## Build & Host Server on Heroku

The app can be deployed to any hosting service that supports Node.JS apps.

As an example to deploy it to Heroku needs only to add the Heroku's engine deceleration file `Procfile` in the project's root directory.

with the content:
```
web: node ./dist/app.js
```

Now all needs are to upload the source code to Heroku, the simplest way is to create an app and connect it to the GitHub repository.

[Apps](https://dashboard.heroku.com/apps)->Select/Create Application->Deploy->Deployment Method.

<image-responsive class="center" imageURL="blog/perfect-api-server-part-a/heroku.jpg"  alt="heroku set up"/>


## Publish Spec

Finally, after all is set and ready need to... publish API!

API can be explored by serving the UI directly from the API Server, in this example app, it will be `http://[server-domain]/` URL.

But it's also possible to upload the API Spec to Swagger Hub where all other APIs exist and it includes many fancy tools for exploring calling and sharing the API.

Open an account or login to [swaggerhub.com](https://app.swaggerhub.com/home) than in the top right corner click on the username and select `API Key` in the new view, and click on `Copy API Key`, will need it later to upload the spec.

> *PAY ATTENTION* - This API Key is highly sensitive, please make sure you giving it only to who you're fully trust.

Back to the code, let's use GitHub Actions for the build and publish.

Create the directory `.github/workflows` in the project's root, and within it create a new file named `actions.yml`.

In this file add the build & the spec publish, see an example for it: (read the comments 👀)
```yml

name: node-api-spec-boilerplate # The deployment/action name

on: [push] # Run jobs on each code push to remote Git

jobs:
  build: # The only job in this example 
    runs-on: ubuntu-latest # Run the job on a Linux ubuntu latest
    strategy:
      matrix:
        node-version: [16.x] # The collection of Node version to run job on it (v16 only)
    steps:
    - name: Checkout repository # First of all, checkout the Git repo using official actions/checkout@v2 package
      uses: actions/checkout@v2 
    - name: Install node
      uses: actions/setup-node@v1 # Install Node.JS with the predefined selected versions, using official actions/setup-node@v1 package
      with:
        node-version: ${{ matrix.node-version }}
    - name: Update version - patch # Update API Server version on main branch update - SwaggerHub is not allows to override published API spec, we have to increase version before publishing a new API spec
      if: github.ref == 'refs/heads/main'
      id: update_version
      run: | # Use NPM to patch version, then keep the new version in the step's context 
          version=$(npm --no-git-tag-version version patch)
          echo $version
          echo ::set-output name=version::$version
    - name: Commit and push changes # After updating version, commit version, again, only in main branch
      if: github.ref == 'refs/heads/main'
      uses: devops-infra/action-commit-push@master
      with: # In the comment add suffix "[skip ci]" to avoid triggering endless recurs call to a new action job due to a commit push
        github_token: ${{ secrets.GITHUB_TOKEN }}
        commit_message: Update to version ${{ steps.update_version.outputs.version }} [skip ci]
    - name: Build # Build project, relevant to all branches :) 
      run: | # Use yarn package manager to fetch dependencies in CI mode, then build project
        yarn --frozen-lockfile
        npm run build
    - name: Upload Spec To Artifactory # Once build finished, upload the new Spec to the GitHub's artifactory
      uses: actions/upload-artifact@v2
      with:
        name: swagger-spec
        path: dist/generated/swagger.json
    - name: Upload Spec To Hub # And finally all ready to upload new spec version to swagger hub, for main branch only 😊
      env:
        SWAGGERHUB_API_KEY: '${{ secrets.SWAGGERHUB_API_KEY }}' # Export the SWAGGERHUB_API_KEY secret as environment variable, use to auth publish request
        API_SERVER_URL: '${{ secrets.API_SERVER_URL }}' # Export the API_SERVER_URL secret as environment variable, used to set the API Server URL to the published spec.
      if: github.ref == 'refs/heads/main'
      run: | # Update the spec with the API Server URL, then publish the new ready to publish spec ***PAY ATTENTION*** this will publish the API spec to the entire world!!! if you don't want it, change the published and visibility param.
        node ./scripts/set-spec-server.js dist/generated/swagger.json $API_SERVER_URL
        npx swaggerhub-cli api:create haimkastner/node-api-spec-boilerplate --file dist/generated/swagger.json --published=publish --visibility=public --setdefault
```

Just before pushing code to GitHub, set up the required secret to add it, navigate to:

`Repo->Settings->Secrets->Actions->New repository secret`

Add the `SWAGGERHUB_API_KEY` secret and as value paste the copied swagger bug API Key, and add the `API_SERVER_URL` optional secret if there is API Server URL spec need to point to.

Push project to GitHub, await to the Actions to be done, and the API spec should be appear on the [swaggerhub](https://app.swaggerhub.com/apis/haimkastner/node-api-spec-boilerplate).

<image-responsive class="center" imageURL="blog/perfect-api-server-part-a/published-spec.jpg"  alt="published spec"/>


## Conclusion

This article is only a start of what can be done once API generated into an OpenAPI spec including E2E testing, API mocks and much more, in the next article, part II will be of how to auto-generate front facade from the published spec.

Feel free to explorer the full example source-code [node-api-spec-boilerplate](https://github.com/haimkastner/node-api-spec-boilerplate).

~~This repo integrated to Heroku served on [api-spec-boilerplate.herokuapp.com](https://api-spec-boilerplate.herokuapp.com/)~~
**Due to heroku's end-of-free plan, the example application moved to [node-api-spec-boilerplate.castnet.club](https://node-api-spec-boilerplate.castnet.club/)**

Spec also published on [swaggerhub](https://app.swaggerhub.com/apis/haimkastner/node-api-spec-boilerplate)

> The [next article](/en/blog/perfect-api-server-part-b) wil be of how to setting up front facade using the API Server generated spec.

> The [SDK article](/en/blog/perfect-api-server-part-d-sdk) wil be of how to generate and publish SDK based on the generated OpenApi specification.

