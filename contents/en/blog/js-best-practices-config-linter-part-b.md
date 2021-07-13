---
name: 'js-best-practices-config-linter-part-b'
title: 'Setting Up a Node.JS Development Environment - Setting Linter'
year: 10 July 2021
color: '#8e7964'
trans: 'js-best-practices-config-linter-part-b'
id: 'js-best-practices-config-linter-part-b'
description: A short manual to set up a standard Project Environment in NODE.JS - Part II - Setting Linter
---

----
> *Setting Up a Node.JS Development Environment*
>
> [Part I](/en/blog/js-best-practices-config-ts-part-a) – Setting TypeScript
>
> <ins>[Part II](/en/blog/js-best-practices-config-linter-part-b) – Setting Linter</ins>
>
> [Part III](/en/blog/js-best-practices-config-unit-tests-part-c) – Setting Unit-Tests
>
> [Part IV](/en/blog/js-best-practices-config-ci-part-d) – Setting Continues Integration (CI)
----

<br>
<br>

After the development environment has been set, it's very important to define the code conventions,
 of course, it's recommended to be as close as possible to the community of the current technology.

Using code conventions helps to avoid common issues, and improve the readability and the structure of the code.

To help us to do that, there is a tool called Linter that is his purpose.

In Node.JS the wide-used tool is the [ESLint](https://eslint.org/) and in the next part of the manual, we will explain how to integrate it in the project.

Run the command
```bash
npm i --save-dev eslint eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react
```
To add the ESLint tool and his dependencies.

To add the parser to TypeScript run the command 
```bash
npm i --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin 
```

And add the Airbnb set of lint rules 
```bash
npm i --save-dev eslint-config-airbnb eslint-config-airbnb-typescript
```

To configure the lint behavior create a new file named `.eslintrc.js` in the project root.

Currently let config the minimum basic configuration, use the TypeScript parser, and the Airbnb set of rules.  
```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // The dedicated TS parser 
  extends: [
    'airbnb-typescript', // The Airbnb rules policies extension
  ],
  parserOptions: {
    project: './tsconfig.json' // The project TS configuration file 
  },
  rules: {
  }
};
```

Create a new file named `.eslintignore`, this file use to mark which files the linter should ignore. 
```bash
node_modules
dist
.eslintrc.js
```

In the `package.json` file under the `script` section add the following lines:
```bash
"lint": "eslint . --ext .js,.ts",
"lint:fix": "eslint . --ext .js,.ts --fix",
```

After saving the changes, run the command `npm run lint` to make sure that there are no lint errors, 
and if there are errors run `npm run lint:fix` so the linter will fix those that can be fixed automatically.

After run it, probably the following error will appear:

```
7:1  error  Prefer default export  import/prefer-default-export
```

This means there is a lint rule that each TS file should has a `export default` but there is no one in the `index.ts` file.

But... of we do want to not use `export default`, what can we do?

In the `.eslintrc.js` file under the `rules` section add the following line:
```
'import/prefer-default-export': 'off'
```
This will override the default rule.

Run again the `npm run lint` command and... the problem is gone. 

This how you can set manually the rule setting with `off` \ `warn` \ `error`, of curse, override the default rule very carefully.

To more complex changes see the [ESLint documentation](https://eslint.org/docs/user-guide/configuring/configuration-files#using-configuration-files).

If you're using the VSCode IDE it's recommended to install the ESLint extension (pay attention to restart the VSCode after Lint configuration change)

it's good to know, if there is a requirement to set different rules to some kind of files or to some directory, there is an option to extend the linter rules and defined some new rules to those files.

For example, by default writing of `console.log('print some')` is forbidden, but say that we have a legacy code placed in the `src/legacy` directory that uses the console
and we don't want to currently refactor it, but we do want some lint in it, what can we do?

It's quite easy, add to the  ESLint configuration file a new `overrides` field, and inside it, defined the rule on which files it will be applied and the new rule to them.

This is how the `.eslintrc.js` file will look like now:
```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript',
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'import/prefer-default-export': 'off'
  },
  overrides: [{
    files: ["src/legacy/**/*.ts"], // Set specific rules policy for all TS files in the src/legacy directory 
    parser: '@typescript-eslint/parser',
    extends: [
      'airbnb-typescript',
    ],
    parserOptions: {
      project: './tsconfig.json'
    },
    rules: {
      'import/prefer-default-export': 'off',
      'no-console': 'off',
    }
  }]
};
```

That's it.

As you can see, the linter is used to warn about code-quality issues such as using a variable before it's defined, how to throw an error, etc.

As well, it warns also about code-formatting such as spaces VS tabs, indentation, etc.

But this is not the main goal of the linter, and in the Node.JS ecosystem there is a dedicated tool for that called `prettier`,
it's not mandatory but it's highly recommended to add and use it.

To add the prettier tool and his EsLint plugin run the command
```bash
npm i --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

To configure `prettier` create a new file named `.prettierrc.json` in it we will be able to configure how the code format should look like.
For the example write in it the following content
```json
{
  "tabWidth": 2,
  "useTabs": true,
  "singleQuote": true,
  "printWidth": 160,
  "endOfLine": "auto"
}
```

See in the [prettier documentation](https://prettier.io/docs/en/options.html) the full configuration options.

In order to defined those rules as part of the linter and to void conflicts with the linter rules, open the `.eslintrc.js` file and add `prettier` plugin and add the `prettier` rules set.

The `.eslintrc.js` should look like that
```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    'prettier', // Add prettier plugin
  ],
  extends: [
    'airbnb-typescript',
    'prettier',  // Extend the linter with new prettier rules
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'prettier/prettier': 'error', // Override any conflict rule by the prettier rule and consider all of them as level "error" 
    'import/prefer-default-export': 'off'
  },
  overrides: [{
    files: ['src/legacy/**/*.ts'],
    parser: '@typescript-eslint/parser',
    plugins: [
      'prettier',
    ],
    extends: [
      'airbnb-typescript',
      'prettier',
    ],
    parserOptions: {
      project: './tsconfig.json'
    },
    rules: {
      'prettier/prettier': 'error',
      'import/prefer-default-export': 'off',
      'no-console': 'off',
    }
  }]
};
```

After all those changes the configuration files should look like this
* [.eslintrc.js](https://github.com/haimkastner/js-project-best-practice/blob/main/.eslintrc.js)
* [.eslintignore](https://github.com/haimkastner/js-project-best-practice/blob/main/.eslintignore)
* [.prettierrc.json](https://github.com/haimkastner/js-project-best-practice/blob/main/.prettierrc.json)

From now and on, our code structure and format always will be correct as we defined  💪 💪 💪

> In the [next article](/en/blog/js-best-practices-config-unit-tests-part-c) we will see how to set Unit-Tests

----

Photo by <a href="https://burst.shopify.com/@matthew_henry?utm_campaign=photo_credit&amp;utm_content=Picture+of+Organized+Pencil+Holder+%E2%80%94+Free+Stock+Photo&amp;utm_medium=referral&amp;utm_source=credit">Matthew Henry</a> from <a href="https://burst.shopify.com/design?utm_campaign=photo_credit&amp;utm_content=Picture+of+Organized+Pencil+Holder+%E2%80%94+Free+Stock+Photo&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>