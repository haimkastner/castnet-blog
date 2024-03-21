---
name: 'perfect-api-server-part-b'
title: 'Perfect API Server - Generating Consumer API Facade'
year: 22 July 2022
color: '#8e7964'
# trans: 'perfect-api-server-part-b'
id: 'perfect-api-server-part-b'
description: Build API server fast and get API spec, documentation and consumer facade for free - Part II - Setting Up Front Facade
---

----
> *Setting Up React Application With Generated API Facade*
>
> [Part I](/en/blog/perfect-api-server-part-a) – Setting Up Server
>
> <ins>[Part II](/en/blog/perfect-api-server-part-b) – Setting Up Front Facade <ins>
>
> [Part III](/en/blog/perfect-api-server-part-c-jobs) – Long processing via Rest API 
>
> [Part IV](/en/blog/perfect-api-server-part-d-sdk) – Setting Up SDK (_COMMING SOON_)
>
----

<br>
<br>

Once our API server has OpenAPI spec, there is plenty of tools available to do cool things with it, one of them is to generate code to call the API sec.

This article will teach how to build a system to fetch OpenAPI spec and generate a fully typed TypeScript API facade, as an example, this will be with a react app.

## Set Up React + TypeScript Project

Create an empty folder and open the command-line/terminal in the newly created folder directory.

Run `yarn create react-app my-app --template typescript` to create a TypeScript React simple app template.

Open the new folder create named `my-app` and open command-line/terminal in the new react app just created.

Run `yarn start` and you will see the app available on `http://localhost:3000/`.


## Fetch OpenAPI Spec

First, need to obtain the OpenAPI spec, usually, it will be the latest generated spec.

There are several options for how to fetch spec, depending on the needs and the CI/CD infrastructure, I will suggest 2 ways:

- `Fetch from Swagger Hub` - once a spec is published to SwaggerHub there is an easy-to-use API to fetch it, but this way will limit the fetch process to only the latest published spec.


- `Fetch from GitHub Actions Artifact` - once a commit is pushed to GitHub a new actions job to upload spec to GitHab's artifactory triggered, and a few seconds later available to be fetched by branch, but this option is a bit more complicated and required more maintenance.

Whenever decided to go with one of the options, open the project directory in your favorite IDE, and create a folder named `scripts` in the project's root.

In the command-line/terminal add the dependencies `yarn add -D dotenv fs-extra node-fetch`.

Within the `scripts` folder create a file named `package.json` and fill it with this content:
```json
{
    "type": "module"
}
```
This configuration is required in order to use the `import ... from "..."` syntax in JS scripts on this directory.

Create a new file `fetch-spec.js` in this file needs to be the JS script code that fetches spec and places it at the `src/generated` directory.

Let's start with SwaggerHub's example, copy & paste the following code, just replace the `API_SPEC_OWNER` owner name and the `API_SPEC_NAME` name with your own values, feel free to read the comments to understand the simple flow 🤥

```typescript

import fse from 'fs-extra';
import path from 'path';
import nodeFetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// The API owner
const API_SPEC_OWNER = 'haimkastner';
// The API name
const API_SPEC_NAME = 'node-api-spec-boilerplate';

// The spec file name
const SPEC_FILE_NAME = 'swagger.json';

// The directory to save the fetched spec
const SPEC_FILE_DEST_DIR = path.join('./src/generated');

async function downloadSpec() {

    console.log(`[fetch-api] Fetching API versions form SwaggerHub...`);

    // Fetch all available versions from SwaggerHub API
    const allSpecsRes = await nodeFetch(`https://api.swaggerhub.com/apis/${API_SPEC_OWNER}/${API_SPEC_NAME}`);
    // Get info as JSON
    const allSpecs = await allSpecsRes.json();

    // Get the latest API available
    const latestVersionInfo = allSpecs.apis[allSpecs.apis.length - 1];

    // Find the SWagger property, where there is the URL to the spec 
    const latestVersionUrl = latestVersionInfo.properties.find(prop => prop.type === 'Swagger')?.url;

    console.log(`[fetch-api] Fetching API Spec form SwaggerHub URL "${latestVersionUrl}"`);

    // Fetch the spec
    const latestSpecRes = await nodeFetch(latestVersionUrl);
    // Get spec as JSON
    const latestSpec = await latestSpecRes.json();

    // Build the s file full path
    const fileDist = path.join(SPEC_FILE_DEST_DIR, SPEC_FILE_NAME);

    console.log(`[fetch-api] Saving API Spec to "${fileDist}"`);

    // Create generated dir if not yet exists
    await fse.promises.mkdir(path.dirname(fileDist), { recursive: true });
    // Save the fetched spec into it
    fse.outputJSONSync(fileDist, latestSpec);
}

(async () => {
    console.log(`[fetch-api] About to download spec form SwaggerHub API`);
    await downloadSpec();
    console.log(`[fetch-api] API Spec fetched successfully`);
})();
```

Prefer to fetch directly from GitHub Actions artifactory? 
It seems reasonable, to fetch directly from the job build and skip the 3rd party CDN such as swaggerHub, and of course, it should give the ability to run on a side-branch and build API on the latest build of each branch, so all sounds great... but GitHub doesn't have yet such public API to get latest artifactory by branch name 😒  

Lucky us, superiorly there is a solution for it 😊

This programmer Oleh Prypin implement a small application to just give this API, go to his project page [nightly.link](https://nightly.link/) and register the repo (can register only a specific repo) so once calling the `nightly.link` API, it will take the latest artifact of the given branch name. easy.

The GitHub's artifactory files are stored as zip, so need to run `yarn add -D jszip` on command-line\terminal for the zip handling dependency.

This will be the code in the `fetch-spec.js` for GitHab's fetch option:

```typescript

import fse from 'fs-extra';
import path from 'path';
import jsZip from 'jszip';
import nodeFetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// The API owner
const API_SPEC_OWNER = 'haimkastner';
// The API name
const API_SPEC_NAME = 'node-api-spec-boilerplate';

//  The branch to take spec from, as default use main branch
const API_SERVER_SPEC_BRANCH = process.env.API_SERVER_SPEC_BRANCH || 'main';

// The Local spec file path, if set the spec will be taken from machine's FS and not be fetched by GitHub artifactory 
const API_SERVER_SPEC_PATH = process.env.API_SERVER_SPEC_PATH;

// The spec file name
const SPEC_FILE_NAME = 'swagger.json';

// The directory to save the fetched spec
const SPEC_FILE_DEST_DIR = path.join('src/generated');

async function downloadSpec() {

    console.log(`[fetch-api] Fetching API spec form git...`);

    // Download the swagger API spec from the API server CI latest artifact https://github.com/haimkastner/node-api-spec-boilerplate/actions/workflows/actions.yml
    // Using https://nightly.link/ for download latest build dist
    const latestArtifact = await nodeFetch(`https://nightly.link/${API_SPEC_OWNER}/${API_SPEC_NAME}/workflows/actions/${API_SERVER_SPEC_BRANCH}/swagger-spec.zip`);
    
    // Get res buffer data
    const artifactBuffer = await latestArtifact.arrayBuffer();

    // Load buffer as a zip archive
    const artifactZip = await jsZip.loadAsync(artifactBuffer);

    // Fetch the archived spec file
    const archivedSpecFile = artifactZip.file(SPEC_FILE_NAME);

    // Extract file content as buffer
    const fileBuffer = await archivedSpecFile.async('nodebuffer');

    // Build the file full path
    const fileDist = path.join(SPEC_FILE_DEST_DIR, SPEC_FILE_NAME);

    console.log(`[fetch-api] Saving API Spec to "${fileDist}"`);

    // Create generated dir if not yet exists
    await fse.promises.mkdir(path.dirname(fileDist), { recursive: true });
    // Save the fetched spec into it
    fse.outputFileSync(fileDist,  fileBuffer);
}

(async () => {
    console.log(`[fetch-api] Fetching API Spec form server "${API_SERVER_SPEC_BRANCH}" branch...`);
    await downloadSpec();
    console.log(`[fetch-api] API Spec fetched successfully`);
})();
```

Let's also allow just copy spec file from any place on the machine, this is usefully on a local development machine, where working on the API server and the front application combined.

See this piece of code, if an `API_SERVER_SPEC_PATH` environment variable has been set, the file just will be copied and that's it.

```typescript

// If local path has been set, use it
if (API_SERVER_SPEC_PATH) {
    console.log(`[fetch-api] Coping API Spec from local path "${API_SERVER_SPEC_PATH}"...`);

    // Create generated dir if not yet exists
    await fse.promises.mkdir(SPEC_FILE_DEST_DIR, { recursive: true });

    // And copy spec file
    await fse.promises.copyFile(path.join(API_SERVER_SPEC_PATH), path.join(SPEC_FILE_DEST_DIR, SPEC_FILE_NAME));
    return;
}
```

This is how the full code will be on the SwaggerHub example, can do the same for GitHub's example.

```typescript

import fse from 'fs-extra';
import path from 'path';
import nodeFetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// The API owner
const API_SPEC_OWNER = 'haimkastner';
// The API name
const API_SPEC_NAME = 'node-api-spec-boilerplate';

// The Local spec file path, if set the spec will be taken from machine's FS and not be fetched by swagger API 
const API_SERVER_SPEC_PATH = process.env.API_SERVER_SPEC_PATH;

// The spec file name
const SPEC_FILE_NAME = 'swagger.json';

// The directory to save the fetched spec
const SPEC_FILE_DEST_DIR = path.join('./src/generated');

async function downloadSpec() {

    console.log(`[fetch-api] Fetching API versions form SwaggerHub...`);

    // Fetch all available versions from SwaggerHub API
    const allSpecsRes = await nodeFetch(`https://api.swaggerhub.com/apis/${API_SPEC_OWNER}/${API_SPEC_NAME}`);
    // Get info as JSON
    const allSpecs = await allSpecsRes.json();

    // Get the latest API available
    const latestVersionInfo = allSpecs.apis[allSpecs.apis.length - 1];

    // Find the SWagger property, where there is the URL to the spec 
    const latestVersionUrl = latestVersionInfo.properties.find(prop => prop.type === 'Swagger')?.url;

    console.log(`[fetch-api] Fetching API Spec form SwaggerHub URL "${latestVersionUrl}"`);

    // Fetch the spec
    const latestSpecRes = await nodeFetch(latestVersionUrl);
    // Get spec as JSON
    const latestSpec = await latestSpecRes.json();

    // Build the s file full path
    const fileDist = path.join(SPEC_FILE_DEST_DIR, SPEC_FILE_NAME);

    console.log(`[fetch-api] Saving API Spec to "${fileDist}"`);

    // Create generated dir if not yet exists
    await fse.promises.mkdir(path.dirname(fileDist), { recursive: true });
    // Save the fetched spec into it
    fse.outputJSONSync(fileDist, latestSpec);
}

(async () => {
    // If local path has been set, use it
    if (API_SERVER_SPEC_PATH) {
        console.log(`[fetch-api] Coping API Spec from local path "${API_SERVER_SPEC_PATH}"...`);

        // Create generated dir if not yet exists
        await fse.promises.mkdir(SPEC_FILE_DEST_DIR, { recursive: true });

        // And copy spec file
        await fse.promises.copyFile(path.join(API_SERVER_SPEC_PATH), path.join(SPEC_FILE_DEST_DIR, SPEC_FILE_NAME));
        return;
    }

    console.log(`[fetch-api] About to download spec form SwaggerHub API`);
    await downloadSpec();
    console.log(`[fetch-api] API Spec fetched successfully`);
})();
```

Once the fetch script is ready, go the the `package.json` file on the *project's root* and add the following script to the scripts section:

```
"fetch-spec": "node ./scripts/fetch-spec.js",
```

Then run `yarn fetch-spec` once a spec file named `swagger.json` should appear on the `src/generated` directory.

Here as well, if don't yet exist a `.gitignore` file, don't forget to create it on the project's root, with the following file & directories to exclude:
```

generated/
.env
node_modules/
```

## Generate API Facade

And... to the main part, the API facade to generate.

Copy the api template from Swagger repo resources
[https://github.com/swagger-api/swagger-codegen/blob/master/modules/swagger-codegen/src/main/resources/typescript-fetch/api.mustache](https://github.com/swagger-api/swagger-codegen/blob/master/modules/swagger-codegen/src/main/resources/typescript-fetch/api.mustache)
Create and paste it on the `resources/openapi/templates/typescript-axios/api.mustache` file in the project.

Add the OpenAPI generator tool by running `yarn add -D @openapitools/openapi-generator-cli`.

> OpenAPI generator tool requires [JVM](https://www.java.com/en/download/) to be installed on the machine

Create a new file `openapitools.json` with the OpenAPI generator configuration in it:
```json
{
  "$schema": "./node_modules/@openapitools/openapi-generator-cli/config.schema.json",
  "spaces": 2,
  "generator-cli": {
    "version": "6.0.1",
    "generators": {
			"typescriptStubs": {
				"generatorName": "typescript-axios",
				"output": "#{cwd}/src/generated/#{name}/",
				"glob": "src/generated/swagger.json",
				"additionalProperties": {
					"withInterfaces": true,
					"typescriptThreePlus": true
				},
				"templateDir": "#{cwd}/resources/openapi/templates/typescript-axios"
			}
		}
  }
}
```  

In the `package.json` file add the following scripts to the scripts section:
```

"generate-api": "openapi-generator-cli generate",
"prebuild": "npm run fetch-spec && npm run generate-api",
```

Run `yarn prebuild` and a new folder with the generated files should be on the `src/generated` directory, open the `src/generated/api.ts` this file contained the generated API as well as the spec interfaces.

Within this file, a few TS errors will probably appear, so let's modify a bit this template file to fix them and to make some changes to abject the API for the project needs.

Line 1 - Comment out the non-required ref.
```

{{! TEMPLATE EDIT: don't ref to custom deceleration file }}
{{! /// <reference path="./custom.d.ts" /> }}
```

Line 8, 13 - Comment out `portable-fetch` import, instead use browser's `fetch`.
```

{{! TEMPLATE EDIT: use built-in fetch as API caller  }}
{{! import * as portableFetch from "portable-fetch"; }}
import { Configuration } from "./configuration";

{{! TEMPLATE EDIT: use built-in fetch as API caller  }}
const portableFetch = fetch;
```

Line 15 - Allow pass API Server URL by `REACT_APP_API_SERVER_URL` environment variable.
```

{{! TEMPLATE EDIT: config API Server URL   }}
const BASE_PATH = process.env.REACT_APP_API_SERVER_URL || "{{{basePath}}}".replace(/\/+$/, "");
```

Line 54 - Fix newest TypeScript warning.
```

{{! TEMPLATE EDIT: TS fix }}
protected configuration: Configuration | undefined;
``` 

Line 72 - Fix newest TypeScript warning.
```

{{! TEMPLATE EDIT: TS fix }}
name!: "RequiredError";
```

Line 236 - Work-around to do the same logic, without the newest TypeScript warning.
```

{{! TEMPLATE EDIT: TS fix }}
const anonimusObj = localVarUrlObj as any;
delete anonimusObj.search;
```

Line 244 - Fix TypeScript lint warning.
```

{{! TEMPLATE EDIT: Lint fix }}
// eslint-disable-next-line
const needsSerialization = (<any>"{{dataType}}" !== "string") localVarRequestOptions.headers['Content-Type'] === 'application/json';
```

End-of-the-file - Add a better API facade, instead of creating a new class instead each API call or call to the ugly `StatusApiFp` functional API, add global `ApiFacade` with static public members with ready-to-use API topics, and the API call will be something like `ApiFacade.StatusApi.ping()`.
```

{{! TEMPLATE EDIT: Generate easy to use API Facade, with ready to use instances of each generated API class }}
{{#apiInfo}}
export class ApiFacade {
    {{#apis}}
    public static {{classname}} = new {{classname}}();
    {{/apis}}
}
{{/apiInfo}}
```

See [api.mustache](https://github.com/haimkastner/react-typescript-spec-facade/blob/main/resources/openapi/templates/typescript-axios/api.mustache) for the full modified template file.

Since the generated template uses the `url` library, add it to the project dependencies by `yarn add url`.

Run `yarn prebuild` again, and now all errors should be gone from the `api.ts` generated file, and all is finally ready for the next step, using the API 😌


## API Facade Uses

The only part that is left is to use the new shiny generated API facade.

Before implementation, make sure the front API Server is defined well, as default the URL will be the one defined in the OpenAPI spec.
As an alternative, the URL can be set by the `REACT_APP_API_SERVER_URL` environment variable, to apply this change needs to stop and run `yarn start` again.

Run `yarn start` if the app not running yet, and open the `src/App.tsx` file.

Import the ApiFacade as well as the generated interfaces

```typescript
import { ApiFacade, Ping, Pong } from './generated/swagger/api';
```

And the function to call it
```typescript

async function sendPing() {
  // Use the generated interfaces
  const ping: Ping = { whois: 'me' };
  const greeting: string = 'hello world';
  try {
    // The API call, bountiful, isn't it?
    // Pro-Tip: Move pointer over the 'ping' method to see the spec comments using JSDoc.
    const pong = await ApiFacade.StatusApi.ping(greeting, ping);
    console.log(`The pong arrived with the greeting: "${pong.greeting}" timestamp: "${pong.time}"`);
  } catch (error: any) {
    console.log(`The ping request failed with error: ${error?.message}`);
  }
}
```

It's awesome, right?

Now let's merge it to the app state, and make it works like a real app.
```javascript

import React, { useState } from 'react';
import './App.css';
import { ApiFacade, Ping, Pong } from './generated/swagger/api';

function App() {

  // The sending state, true if currently there is a ping request in the air.
  const [sending, setSending] = useState<boolean>(false);
  // The failed/error state, has some error message value, if the last ping request failed.
  const [failed, setFailed] = useState<string>('');
  // The greeting message state, stores the value of the greeting message to send in the next ping
  const [greeting, setGreeting] = useState<string>('');
  // The whois text state, stores the value of the whois text to send in the next ping
  const [whois, setWhois] = useState<string>('');
  // The pong state, stores the last pong responded from the API server.
  const [pong, setPong] = useState<Pong>();

  async function sendPing() {

    // Before sending ping, update relevant states.
    setSending(true);
    setFailed('');
    setPong(undefined);

    // Use the generated interfaces
    const ping: Ping = { whois };

    try {
      // The API call, bountiful, isn't it?
      // Pro-Tip: Move pointer over the 'ping' method to see the spec comments using JSDoc.
      const pong = await ApiFacade.StatusApi.ping(greeting, ping);
      console.log(`The pong arrived with the greeting: "${pong.greeting}" timestamp: "${pong.time}"`);
      // Update state with the new pong
      setPong(pong);
    } catch (error: any) {
      console.log(`The ping request failed with error: ${error?.message}`);
      // Update failed error due to the failure.
      setFailed(error?.message || 'unknown error');
    }

    // Mark sending state as finished
    setSending(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to the React Type Script API Spec Example APP
        </p>
        <p>
          For triggering an API call, please type any greeting message and press "Send"
        </p>
        <p>
          <div>
            <div>
              {/* The greeting input, once changed, the greeting state wil be updated */}
              <input type={'text'} placeholder={'Type greeting to send...'} onKeyUp={(e) => setGreeting(e.target.value)} />
            </div>
            <div>
              {/* The whois input, once changed, the whois state wil be updated */}
              <input type={'text'} placeholder={'Type whois to send...'} onKeyUp={(e) => setWhois(e.target.value)} />
            </div>
            <div>
              {/* The form submit input, available if both above inputs filled, once clicked, the ping request will be triggered */}
              <input type={'submit'} value={'Send'} disabled={!greeting || !whois} onClick={sendPing} />
            </div>
          </div>

        </p>
        <p>
          {/* Show a proper message in view regarding the state */}
          {failed && 'Send ping request failed'}
          {sending && 'Awaiting Server...'}
          {pong && 'API Server pong response:'}
        </p>
        {
          // Show (if there is) the last pong responded from the API server.
          !pong ? (failed || sending ? '' : '---No ping sent yet---') : <p>
            <div>
              {/* Show the greeting message arrived */}
              <input type={'text'} disabled={true} value={pong.greeting} style={{ color: 'white' }} />
            </div>
            <div>
              {/* Show the timestamp of the last ping as responded from the API server */}
              <input type={'text'} disabled={true} value={new Date(pong.time).toUTCString()} style={{ color: 'white' }} />
            </div>
          </p>
        }
      </header>
    </div>
  );
}

export default App;
```

The app view should look like this:

<image-responsive class="center" imageURL="blog/perfect-api-server-part-b/app-pre-css.jpg"  alt="App view Without CSS"/>

Let's put some make-up to the style... open the `src/index.css` and append the following style:

```css

input[type=text] {
  padding:5px; 
  border:2px solid #ccc; 
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

input[type=text]:focus {
  border-color:#333;
}

input[type=submit] {
  padding:5px 15px; 
  background:#ccc; 
  border:0 none;
  cursor:pointer;
  -webkit-border-radius: 5px;
  border-radius: 5px; 
}
```

The app view should look now a bit better:

<image-responsive class="center" imageURL="blog/perfect-api-server-part-b/app-with-css.jpg"  alt="App view With CSS"/>

And... the application is ready, once a new API will be added on modified at the API server spec, run `yarn prebuild & yarn start` again, and the change will be reflected in the `ApiFacade` and the generated interfaces, just seat down and enjoy 😎 

## Deploy to Netlify

Once the project is pushed to GitHub, open [Netlify Dashboard](https://app.netlify.com/).

Gp to `Add new site`->`Import an existing project`->`GitHub`.

Select the app repository, then select the branch to deploy (as default it's `main`).

Set the build command to be `yarn build` (this will auto trigger the prebuild command before).
Set publish directory to be `build`.
click on `Show Advanced` and then `New variable`.

Set `REACT_APP_API_SERVER_URL` variable with the API server URL as the value.

<image-responsive class="center" imageURL="blog/perfect-api-server-part-b/netlify-config.jpg"  alt="Netlify config"/>

Scroll down, click on `Deploy site`, and let Netlify do their magic.

## Conclusion

This article is only a brief taste of what can be done with the API template and the power that it gives to the developers, to be agile with the API changes and interfaces, and make a fancy tool easily, just start to think about adding a lazy-loading cache mechanism, unique ID to each request header, logging, telemetry, and muck much more. it's truly a powerful tool. 

Feel free to explorer the full example source-code [react-typescript-spec-facade](https://github.com/haimkastner/react-typescript-spec-facade).

This repo integrated to Netlify services on [react-typescript-spec-facade.castnet.club](https://react-typescript-spec-facade.castnet.club/)

Hope you enjoyed the article, and have fun with the OpenAPI echo system.

