---
name: 'perfect-api-server-part-d-sdk'
title: 'Perfect API Server - Generating SDK'
year: 20 March 2024
color: '#8e7964'
# trans: 'perfect-api-server-part-d-sdk'
id: 'perfect-api-server-part-d-sdk'
description: Build API server fast and get API spec, documentation and consumer facade for free - Part II - Setting Up SDK
---

----
> *Setting Up SDK library Generated API operations*
>
> [Part I](/en/blog/perfect-api-server-part-a) – Setting Up Server
>
> [Part II](/en/blog/perfect-api-server-part-b) – Setting Up Front Facade
>
> [Part III](/en/blog/perfect-api-server-part-c-jobs) – Long processing via Rest API 
>
> <ins>[Part IV](/en/blog/perfect-api-server-part-d-sdk) – Setting Up SDK <ins>
>

----

<br>
<br>

Bla bla bla about SDK....

A complete example of the SDK can be found at https://github.com/haimkastner/open-api-based-sdk-boilerplate 
## Set Up TypeScript Project

Create an empty folder and open the command-line/terminal in the new created folder directory.

Run npm init to create an empty JS project.

Run tsc --init to create an empty TS project, and run yarn add -D typescript to add TS to the project.

Install the following dependencies:
    yarn add node-fetch
    yarn add -D fs-extra @types/node
    yarn add -D dotenv for loading environment variables from an .env file

And now let's prepare the SDK.

Open the folder directory in your favorite IDE, such as VS Code


## Fetch OpenAPI Spec


First, need to obtain the OpenAPI spec, usually, it will be the latest generated spec.

There are several options for how to fetch spec, depending on the needs and the CI/CD infrastructure, I will suggest 2 ways:

- `Fetch from Swagger Hub` - once a spec is published to SwaggerHub there is an easy-to-use API to fetch it, but this way will limit the fetch process to only the latest published spec.


- `Fetch from GitHub Actions Artifact` - once a commit is pushed to GitHub a new actions job to upload spec to GitHab's artifactory triggered, and a few seconds later available to be fetched by branch, but this option is a bit more complicated and required more maintenance.

Both are explained on the front facard Fetch OpenAPI Spec section, here, we will go with the simple SwaggerHub way.

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

// The Local spec file path, if set the spec will be taken from machine's FS and not be fetched by GitHub artifactory 
const API_SERVER_SPEC_PATH = process.env.API_SERVER_SPEC_PATH;

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
dist/
```

## Generate SDK

And... to the main part, the API SDK to generate.

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

Line 7 - Comment out `portable-fetch` import, instead import node-fetch by `yarn add node-fetch` and import it and use it for the `portableFetch`.
```
{{! TEMPLATE EDIT: use node-fetch fetch as API caller  }}
{{! import * as portableFetch from "portable-fetch"; }}
import fetch from "node-fetch";
import { Configuration } from "./configuration";
const portableFetch = fetch as any;
```

Line 13 - Take as default the URL from the specification, and allow pass API Server URL by `API_SERVER_URL` environment variable.
```

{{! TEMPLATE EDIT: config API Server URL   }}
const BASE_PATH = process.env.API_SERVER_URL || "{{{basePath}}}".replace(/\/+$/, "");
```

End-of-the-file - Implement the SDK API class. instead of creating a new class instead each API call or call to the ugly `StatusApiFp` functional API, add global `ServerSDK` with public members with ready-to-use API topics, and the API call will be something like `ServerSDK.StatusApi.ping()`.

This is the place to add/inject session managment, logging, and every think that needed in a real-world SDK.
```

{{! TEMPLATE EDIT: Generate easy to use API Facade, with ready to use instances of each generated API class }}
{{#apiInfo}}
export class ServerSDK {
    {{#apis}}
    public readonly {{classname}} = new {{classname}}();
    {{/apis}}
}
{{/apiInfo}}
```

See [api.mustache](https://github.com/haimkastner//open-api-based-sdk-boilerplate/blob/main/resources/openapi/templates/typescript-axios/api.mustache) for the full modified template file.

Since the generated template uses the `url` library, add it to the project dependencies by `yarn add url`.

Run `yarn prebuild` again, and now all errors should be gone from the `api.ts` generated file, and all is finally ready for the next step.

Now let's export the SDK instande to the SDK consumers.

Add new `index.ts` in `src` directory with the following content:
```typescript
export * from './generated/swagger/api';
```

And add to the `package.json` the entry point file and the dist files (to be added later as part of the package)
```json
...
 "main": "dist/index.js",
 "files": ["dist"],
...
```

## Building SDK 



Let's add the testing tools by `yarn add -D chai mocha @types/chai @types/mocha ts-node`


Add a build command to the `package.json` in the scripts section:
```json
...
    "build": "tsc"
...
```

Config `tsconfig.json` with the `compilerOptions` properties:
```json
...
  "rootDir": "./src",
  "outDir": "./dist", 
  "declaration": true, 
...
```

And run `yarn build`.

The SDK is ready 😎 

## Testing SDK

Let's add the testing tools by `yarn add -D chai mocha @types/chai @types/mocha ts-node`

Add a test command to the `package.json` in the scripts section:

...
  "test": "mocha -r ts-node/register tests/**/*.spec.ts"
...

Create new directory `tests` and within it create new test file named `sdk.spec.ts` containes one simple test:
```typescript
import { describe } from 'mocha';
import { expect } from 'chai';
import { ServerSDK } from '../src/generated/swagger/api';

describe('# SDK Tests', () => {

    it('Test simple operation', async () => {
        const serverSDK = new ServerSDK();
        const greeting = 'hello';
        const res = await serverSDK.StatusApi.ping(greeting, { whois: 'me' });
        expect(res.greeting).be.equal(greeting)
    });
});
```

And run `yarn test`.

## Deploy to NPM

It is can be done simnply by loginig to npm with `npm login` and running `yarn publish`.

But here we will demonstrate how to build GitHub Action to generate & publish the package on each server new API.

Create new file at `.github/workflows/release.yml` with that content:
```yml
name: open-api-based-sdk-boilerplate

on: [push,workflow_dispatch] # Run this workflow on commit push, *and* if  this workflow triggers from API call to GitHub, this will be used for trigger buigl and release on server API change.

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]
    steps:
      - uses: actions/checkout@v4
      - name: Install node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Prepare dependencies
        run: |
          npm i -g yarn
          yarn install --frozen-lockfile 
          yarn prebuild

      - name: Build & Test 🔧
        run: |
          yarn build
          yarn test

  release:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' # make sure to release package only in the main branch
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'

      - name: Prepare package
        run: |
          npm i -g yarn
          yarn install --frozen-lockfile 
          yarn prebuild
          yarn build

      - name: Bomb Version
        id: update_version
        run: |
          git pull
          version=$(npm --no-git-tag-version --tag-version-prefix= version patch)
          echo $version
          echo "VERSION=$version" >> $GITHUB_OUTPUT

      - name: Get version info
        id: version_info
        run: |
          body=$(git log -1 --pretty=%B | sed -n '1p')
          echo "BODY=$body" >> $GITHUB_OUTPUT

      - name: Commit and push version
        uses: devops-infra/action-commit-push@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          commit_message: Update to version ${{ steps.update_version.outputs.VERSION }} [skip-ci]

      - name: Publish package on NPM 📦
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Create Release
        id: create_release
        uses: softprops/action-gh-release@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ steps.update_version.outputs.VERSION }}
          name: Package Version ${{ steps.update_version.outputs.VERSION }}
          body: ${{  steps.version_info.outputs.BODY }}
          draft: false
          prerelease: false

      - name: Commit and push generated docs update
        uses: devops-infra/action-commit-push@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          commit_message: Update gen docs for version ${{ steps.update_version.outputs.VERSION }} [skip-ci]

```


Generate a new NPM token for the publish and add it to the Repository secrete with the name `NPM_TOKEN`.

Enabled "Read and write permissions" in Repository Settings -> Actions -> General -> Workflow permissions.

Push the code to GitHub and... the actions will do the rest.


Now, let's create a token with premissions to run workflow. and add it to the server repository seretes with the name `SDK_EXAMPLE_WORKFLOW_TOKEN`

In the server's GitHub actions add this to the release action. 
```yml
- name: Call re-run generate & publish SDK example # Trigger SDK package re-generate and publish
  env:
    SDK_EXAMPLE_WORKFLOW_TOKEN: ${{ secrets.SDK_EXAMPLE_WORKFLOW_TOKEN }}
  run: |
    # Trigger re-generate Python units once a new release created 
    curl --fail --location --request POST 'https://api.github.com/repos/haimkastner/open-api-based-sdk-boilerplate/actions/workflows/release.ymdispatches' \
    --header 'Accept: application/vnd.github.everest-preview+json' \
    --header 'Content-Type: application/json' \
    --header "Authorization: token $SDK_EXAMPLE_WORKFLOW_TOKEN" \
    --data-raw '{"ref": "main" }'
```

## Consuming the SDK

Once the package published, install it on your project:
```bash
yarn add @haimkastner/open-api-based-sdk-boilerplate
``` 

And use the SDK:
```typescript
import { ServerSDK } from '@haimkastner/open-api-based-sdk-boilerplate';

// ...

const serverSDK = new ServerSDK();
const res = await serverSDK.StatusApi.ping('hello', { whois: 'me' });
```


## Conclusion

This article is the very begining of that the SDK can do.

You can customize every aspect of the SDK, add loging, monitoring, session managment and more, 
while benefiting it once to all API operations.

Feel free to explorer the full example source-code [open-api-based-sdk-boilerplate](https://github.com/haimkastner/open-api-based-sdk-boilerplate).

This exmplae SDK available at NPM on [@haimkastner/open-api-based-sdk-boilerplate](https://www.npmjs.com/package/@haimkastner/open-api-based-sdk-boilerplate)
