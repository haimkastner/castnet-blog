---
name: 'js-best-practices-config-ts-part-a'
title: 'Setting Up a Node.JS Development Environment - Setting TypeScript'
year: 9 July 2021
color: '#8e7964'
trans: 'js-best-practices-config-ts-part-a'
id: 'js-best-practices-config-ts-part-a'
description: A short manual to set up a standard Project Environment in NODE.JS - Part I - Setting TypeScript
---

----
> *Setting Up a Node.JS Development Environment*
>
> <ins>[Part I](/en/blog/js-best-practices-config-ts-part-a) – Setting TypeScript</ins>
>
> [Part II](/en/blog/js-best-practices-config-linter-part-b) – Setting Linter
>
> [Part III](/en/blog/js-best-practices-config-unit-tests-part-c) – Setting Unit-Tests
>
> [Part IV](/en/blog/js-best-practices-config-ci-part-d) – Setting Continues Integration (CI)
----

<br>
<br>

When we come to write a code project, before we start writing the code and the logic, it is very important to set up the development environment and use common tools to improve the development process and deployed and make sure the code will be aligned as much as possible to the community conventions and best-practices.

Among the common tools, there are a few tools that everyone agrees that is mandatory and are the minimum to allow reasonable maintenance of any project.

In the next tutorial, I will explain and show as best I understood the tools and form of development in the Node.JS ecosystem, I will try to explain briefly exactly what the tool/process is for and of course with examples of how to configure it.

In this tutorial, we will see how to configure those extremely important tools:

*	`Types`- Using tools provided by the language itself, in our case it means to use TypeScript instead of using JavaScript directly.
* `Linter` - A tool that verifies the code conventions using a set of predefined rules (e.g., how to define a function name?) In our case, it's the ESLint.
*	`Prettier` - The tool that makes sure the code looks the same throughout the project (e.g., spaces VS tabs) in our case it's called Prettier (sometimes it's considered as part of the Linter).
* `Unit Tests` - Yes, it's important to be before writing a single line of code.
In our case, we will use Mocha to run the tests (and Chai to set the assertions).
*	`Continuous Integration (CI)`– Combining all the tools above into one automatic system that tests and builds the product or alerts if needed, in our case it will be GitHub Actions.

Let's start, first create a new empty folder named `js-project-best-practice`.

Open the command-line/terminal and create a new JS project by the command `npm init`.

This command will create a `package.json` file, this file is the project manifest, where the project structure and the dependencies will be defined in.

As we said, we want to write in TypeScript and not write directly in JavaScript, to set TypeScript run the following command:
```bash
npm i --save-dev typescript @types/node
```
This will add the typescript from the [NPM](https://www.npmjs.com/) registry and the basic Node types as well, both as development-only dependencies.

To create the TypeScript configuration file let's run the command `npx tsc –init`.

Open the project in your favorite IDE (VSCode is highly recommended, but for sure, not mandatory) and then open the new `tsconfig.json` file.

There is a lot of option within this file, but the must important are the following: 


* `target` - Unless you have a good reason for using an old JS engine, is's better to put here ESNEXT or ES2021
* `declaration`, `declarationMap`, `sourceMap` - Set to `true` in case you'ar build a library and you want the types definitions and the maps to the source code in the built bundles.
* `outDir` - The build destination directory, change it to `./dist`.
* `types` - The global types for all the project, add this key under the `compilerOptions` with the Node types
```json
"types": [
      "node",
  ]
```
* `include` - The source code files, set to be all `.ts` files under project `src` directory.
```json
  "include": [
    "src/**/*.*"
  ],
```
* `exclude` - Mark to TypeScript to ignore those files, currently set to ignore the dependencies directory.
```json
  "exclude": [
    "node_modules"
  ]
```

After all changes the file should look like [tsconfig.json](https://github.com/haimkastner/js-project-best-practice/blob/main/tsconfig.json)

Back to the `package.json` file, there is a  `scripts` section where all the project build and tests scripts are defined. 

For now add the following line:

```json
"build": "tsc",
```
Now, the command `npm run build` will invoke the `tsc` command (The TypeScript engine build command).

In order to make sure that the project is well configured, let's create the source-code directory named `src` and within a new file named `index.ts`. 

In this file let write the following simle logic:
```typescript
/* Calculate add number :)
 * @param a The first number
 * @param b The seconds number
 * @returns The add results
 */
export function addNumbers(a: number, b: number): number {
  return a + b;
}
```

After saving the changes, run `npm run build` and when it's done you will see a new `index.js` file in the `dist` directory.

Great!, seems that we have a TypeScript project ready to use! 


> In the [next article](/en/blog/js-best-practices-config-linter-part-b) we will see how to add and defined a Linter to this project.
