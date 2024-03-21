---
name: 'perfect-api-server-part-d-sdk'
title: 'Perfect API Server - Generating SDK'
year: 20 March 2024
color: '#8e7964'
# trans: 'perfect-api-server-part-d-sdk'
id: 'perfect-api-server-part-d-sdk'
description: Build API server fast and get API spec, documentation and consumer facade for free - Part IV - SDK Setup
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
> <ins>[Part IV](/en/blog/perfect-api-server-part-d-sdk) – SDK Setup <ins>
>

----

<br>
<br>

We have an API server, and we want to provide an SDK for it instead of letting customers do their research on the specifications, build boilerplate code, handle authentication, sessions, etc.


We aim to provide them with an easy-to-use SDK, complete with all interface validations, and more. However, we don’t want to duplicate code ourselves. We just want to build the infrastructure and generate the operations. So, how can this be done? In this article, we will demonstrate how it can be accomplished easily.





## Set Up Project

Create an empty folder and open the command-line or terminal in the newly created folder directory.

Run `npm init` to create an empty JavaScript project.

Run `tsc --init` to create an empty TypeScript project, and run 

Add the following dependencies:
`yarn add -D typescript node-fetch fs-extra @types/node dotenv`

Now, let’s prepare the SDK. 

Open the folder directory in your favorite IDE, such as Visual Studio Code.


## Fetch OpenAPI Specification

First, you need to obtain the OpenAPI spec, which is usually the latest generated spec.

There are several options for fetching the spec, depending on your needs and the CI/CD infrastructure. I suggest two ways:

- `Fetch from SwaggerHub` - Once a spec is published to SwaggerHub, there is an easy-to-use API to fetch it. However, this method will limit the fetch process to only the latest published spec.

- `Fetch from GitHub Actions Artifact` - Once a commit is pushed to GitHub, a new actions job to upload the spec to GitHub’s artifact is triggered, and a few seconds later it’s available to be fetched by branch. This option is a bit more complicated and requires more maintenance.

Both methods are explained in the [Setting Up Front Facade](/en/blog/perfect-api-server-part-b) -> “Fetch OpenAPI Spec” section. Here, we will go with the simpler SwaggerHub method.

Within the scripts folder, create a file named `package.json` and fill it with this content:
```json
{
    "type": "module"
}
```
> This configuration is necessary in order to use the `import ... from "..."` syntax in JavaScript scripts within this directory.

Create a new file `fetch-spec.js` in this file needs to be the JS script code that fetches spec and places it at the `src/generated` directory.

Next, create a new file named `fetch-spec.js`. This file should contain the JavaScript script code that fetches the spec and places it in the `src/generated` directory.

Let’s start with an example using SwaggerHub. Copy and paste the following code, replacing the `API_SPEC_OWNER` owner name and the `API_SPEC_NAME` name with your own values. Feel free to read the comments to understand the flow.

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

Once the fetch script is ready, you need to modify the `package.json` file located at the *project’s root*. Add the following script to the scripts section:

```json
"fetch-spec": "node ./scripts/fetch-spec.js",
```

once you’ve added the script to your `package.json` file, you can run `yarn fetch-spec` from the command line. This should generate a spec file named `swagger.json` in the `src/generated` directory. This means your script is working correctly and you’ve successfully fetched the spec.

If a `.gitignore` file doesn’t already exist in your project’s root directory, it’s important to create one. This file is used to tell Git which files or directories to ignore in a project.
```
generated/
.env
node_modules/
dist/
```

## Generate the SDK

let’s move on to the main part: generating the API SDK. This is where we’ll use the OpenAPI spec that we fetched earlier to generate an SDK that will make it easier for your customers to interact with your API.

Copy the API template from the Swagger repository resources. You can find it at this [link](https://github.com/swagger-api/swagger-codegen/blob/master/modules/swagger-codegen/src/main/resources/typescript-fetch/api.mustache).

Create a new file in your project at `resources/openapi/templates/typescript-axios/api.mustache` and paste the copied content into this file.

Add the OpenAPI generator tool to your project. You can do this by running the following command in your terminal:
```
yarn add -D @openapitools/openapi-generator-cli
```

This command adds the OpenAPI generator CLI as a devDependency to your project. 

Create a new file at the project root, named `openapitools.json` with the OpenAPI generator configuration in it:
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

Now, you’re all set to generate your API SDK!

In the `package.json` file add the following scripts to the scripts section:
```json

...
"generate-api": "openapi-generator-cli generate",
"prebuild": "npm run fetch-spec && npm run generate-api",
...
```

Run `yarn prebuild` from the command line. This should create a new folder with the generated files in the `src/generated` directory.

Open the `src/generated/api.ts` file, This file contains the generated API as well as the spec interfaces.

You might notice a few TypeScript errors within this file. Don’t worry, these can be fixed by modifying the template file.

Let’s go ahead and make some changes to adapt the API for the project’s needs.

Line 1 - Comment out the non-required ref.
```

{{! TEMPLATE EDIT: don't ref to custom deceleration file }}
{{! /// <reference path="./custom.d.ts" /> }}
```

Line 7 - Comment out `portable-fetch` import, instead use the `cross-fetch` library.

Run `yarn add cross-fetch` to import it, and use it for the `portableFetch`.
```

{{! TEMPLATE EDIT: use cross-fetch as API caller  }}
{{! import * as portableFetch from "portable-fetch"; }}
import fetch from "node-fetch";
import { Configuration } from "./configuration";
const portableFetch = fetch as any;
```

Line 13 - As default, take the URL from the specification, and allow passing dedicated API Server URL by `API_SERVER_URL` environment variable.
```

{{! TEMPLATE EDIT: config API Server URL   }}
const BASE_PATH = process.env.API_SERVER_URL || "{{{basePath}}}".replace(/\/+$/, "");
```

let’s implement the SDK API class. so instead of creating a new class for each API call or using the StatusApiFp functional API, we’ll add a global ServerSDK with public members that have ready-to-use API topics. This way, an API call will look something like `ServerSDK.StatusApi.ping()`.

This is also the place where you can add or inject session management, logging, and anything else that’s needed in a real-world SDK.
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

The `url` library is used in the generated template. You can add it to your project dependencies by running `yarn add url` command in your terminal.

Run `yarn prebuild` again from the command line. This should resolve all errors in the api.ts generated file, and your project is now ready for the next step.

Now, let’s export the SDK instance to the SDK consumers. Add a new file named `index.ts` in the `src` directory with the following content:
```typescript
export * from './generated/swagger/api';
```

Next, update the `package.json` file to include the entry point file and the dist files (which will be added later as part of the package). Here’s how you can do this:
```json
...
 "main": "dist/index.js",
 "files": ["dist"],
...
```

## Building The SDK 

Add a build command to the `package.json` file in the scripts section:
```json
...
    "build": "tsc"
...
```
Configure the `tsconfig.json` file with the following `compilerOptions` properties:
```json
...
  "rootDir": "./src",
  "outDir": "./dist", 
  "declaration": true, 
...
```

And run `yarn build`.

Congratulations, your SDK is now ready! 😎

## Testing The SDK

Let's add the testing tools by `yarn add -D chai mocha @types/chai @types/mocha ts-node` commadn.

Add a test command to the `package.json` in the scripts section:
```json
...
  "test": "mocha -r ts-node/register tests/**/*.spec.ts"
...
```

Create new directory `tests` and within it create a new test file named `sdk.spec.ts` containes one simple test:
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

However, this right way is to publish it as part of the piplies.

Here are the steps to deploy your SDK to NPM using GitHub Actions:

#### Create a new NPM token for publishing
Generate a new NPM token. This can be done on the NPM website under `Auth Tokens` in your account settings.

#### Add the NPM token to your GitHub repository secrets
- Go to your GitHub repository settings.
- Click on `Secrets` in the left sidebar.
- Click on `New repository secret`.
- Enter `NPM_TOKEN` as the name and paste your NPM token as the value.


#### Enable “Read and write permissions” in your repository settings

To increase package version during release, a write permission need to grant to the actions token.
- Go to your GitHub repository settings.
- Click on `Actions` in the left sidebar.
- Under `General`, find `Workflow permissions` and set it to `Read and write permissions`.

#### Create a new GitHub Actions workflow:
- Create a new file at `.github/workflows/release.yml`.
- Paste the provided YAML content into this file. This content defines your build and release jobs.
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

#### Push your code to GitHub
- Run git push in your terminal to push your code to GitHub.
- Once your code is pushed, the GitHub Actions workflow will automatically run and do the rest.

Your SDK should now be automatically built and published to NPM whenever you push to your main branch. Congratulations!


Finally, let’s create a token with permissions to run the workflow.

Go to your GitHub account settings.
- Click on `Developer settings`.
- Click on `Personal access tokens`.
- Click on Generate new token.
- Give your token a descriptive name.
- Under Select scopes, check the boxes that correspond to the permissions you need. For a public repository and workflow, you might need repo (which - includes all repository permissions) and workflow (which allows you to run workflows).
- Click on Generate token at the bottom of the page.

Your new personal access token will appear.

- Go to the server's GitHub repository settings.
- Click on `Secrets` in the left sidebar.
- Click on `New repository secret`.
- Enter `SDK_EXAMPLE_WORKFLOW_TOKEN` as the name and paste your newly created token as the value.

In the server's actions add this to the release action. 
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

Now, your SDK will be automatically re-generated and published whenever a new release is created in your server repository.

## Consuming the SDK

Once the package is published, install it on any project:
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

This article is just the beginning of what the SDK can do.

You can customize every aspect of the SDK, add logging, monitoring, session management, and more, while benefiting from it across all API operations.

A complete example of the SDK can be found at the following GitHub repository [open-api-based-sdk-boilerplate](https://github.com/haimkastner/open-api-based-sdk-boilerplate)


This SDK example is available on NPM at [@haimkastner/open-api-based-sdk-boilerplate](https://www.npmjs.com/package/@haimkastner/open-api-based-sdk-boilerplate)


Thank you for reading this article. We hope you found it informative and helpful. Enjoy exploring the capabilities of the SDK and happy coding!