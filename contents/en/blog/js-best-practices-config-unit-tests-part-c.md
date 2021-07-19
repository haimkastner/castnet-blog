---
name: 'js-best-practices-config-unit-tests-part-c'
title: 'Setting Up a Node.JS Development Environment - Setting Unit-Tests'
year: 10 July 2021
color: '#8e7964'
trans: 'js-best-practices-config-unit-tests-part-c'
id: 'js-best-practices-config-unit-tests-part-c'
description:  A short manual to set up a standard Project Environment in NODE.JS - Part III - Setting Unit-Tests
---

----
> *Setting Up a Node.JS Development Environment*
>
> [Part I](/en/blog/js-best-practices-config-ts-part-a) – Setting TypeScript
>
> [Part II](/en/blog/js-best-practices-config-linter-part-b) – Setting Linter
>
> <ins>[Part III](/en/blog/js-best-practices-config-unit-tests-part-c) – Setting Unit-Tests</ins>
>
> [Part IV](/en/blog/js-best-practices-config-ci-part-d) – Setting Continues Integration (CI)
----

<br>
<br>

After the project environment is ready, it's time to set the most important part for the project stability, the Unit-Tests.

In this article, we will see how to integrate the test with [mocha](https://mochajs.org/) for the test runner environment, 
and [chai](https://www.chaijs.com/) for the tests assertions.

First, add the following libraries:

([ts-node](https://typestrong.org/ts-node/) used to run test without pre-build)
```bash
npm i --save-dev mocha chai ts-node @types/mocha @types/chai
```

In the `package.json` file under `scripts` section replace the `test` script content with
```bash
"test": "mocha -r ts-node/register src/**/*.spec.ts"
```
From now on, all files in the `src` directory that ends with `spec.ts`  will consider as test files.

Create a new `src/index.spec.ts` test file.

In the new file import the test libraries and to the logic we want to test.

```ts
import { describe } from 'mocha';
import { expect } from 'chai';
import { addNumbers } from './index';
```

Describe test collection
```ts
describe('#Test addNumbers logic', () => {
	// The tests are here
});
```
 
Create a new unit test
```ts
it('Test positive numbers', () => {
	// The test logic is here
});
```

And inside, call to the `addNumbers` API, and verify the results using `chai` assertion.
```ts
it('Test positive numbers', () => {
    // Prepare test parameters
    const a = 1;
    const b = 2;
    const c = a + b;
    // Call to the API
    const addResults = addNumbers(a, b);
    // Make sure the results is as expected
    expect(addResults).to.be.equal(c, `"${a}" + "${b}" should be "${c}" but "addNumbers" returns "${addResults}"`);
  });
```

Let's add another test, to make sure the logic is OK also in negative numbers.

Also, another test collection to verify the legacy logic behavior.

The complete file should look like this:
```ts
import { describe } from 'mocha';
import { expect } from 'chai';
import { addNumbers } from './index';
import { addNumbersLegacy } from './legacy';

describe('#Test addNumbers logic', () => {
	it('Test positive numbers', () => {
		// Prepare test parameters
		const a = 1;
		const b = 2;
		const c = a + b;
		// Call to the API
		const addResults = addNumbers(a, b);
		// Make sure the results is as expected
		expect(addResults).to.be.equal(c, `"${a}" + "${b}" should be "${c}" but "addNumbers" returns "${addResults}"`);
	});

	it('Test negative numbers', () => {
		// Prepare test parameters
		const a = -1;
		const b = -2;
		const c = a + b;
		// Call to the API
		const addResults = addNumbers(a, b);
		// Make sure the results is as expected
		expect(addResults).to.be.equal(c, `"${a}" + "${b}" should be "${c}" but "addNumbers" returns "${addResults}"`);
	});
});

describe('#Test legacy addNumbers logic', () => {
	it('Test positive numbers', () => {
		// Prepare test parameters
		const a = 1;
		const b = 2;
		const c = a + b;
		// Call to the API
		const addResults = addNumbersLegacy(a, b);
		// Make sure the results is as expected
		expect(addResults).to.be.equal(c, `"${a}" + "${b}" should be "${c}" but "addNumbers" returns "${addResults}"`);
	});

	it('Test negative numbers', () => {
		// Prepare test parameters
		const a = -1;
		const b = -2;
		const c = a + b;
		// Call to the API
		const addResults = addNumbersLegacy(a, b);
		// Make sure the results is as expected
		expect(addResults).to.be.equal(c, `"${a}" + "${b}" should be "${c}" but "addNumbers" returns "${addResults}"`);
	});
});
```
You can see the full file here [index.spec.ts](https://github.com/haimkastner/js-project-best-practice/blob/main/src/index.spec.ts)

Now, run the `npm run test` command, and ... that's it. yes, simple as that 😊

For now, everything is ready, but if we want to get a beautiful report about the tests coverage we can get it.

Add the packages
```bash
npm i --save-dev mocha-lcov-reporter nyc
```

In the `package.json` under `scripts` add the following line:
```bash
"cover": "node \"node_modules/nyc/bin/nyc.js\" --exclude src/**/*.spec.ts --reporter=lcov npm run test"
```

This script will invoke the `nyc` with the test runner command, so the test will run, and meanwhile nyc will get the coverage data. 


Run the `npm run cover` command, then you can see a new folder named `.nyc_output` that contained the report raw data, and another folder named
`coverage` inside it, there is a `lcov-report/index.html` file, open it in any browser.

As you can see, we are on the 100% coverage 🥇🥇🥇
 

<image-responsive imageURL="blog/js-best-practices-config-unit-tests-part-c/cover-report-1.jpg" />
<image-responsive imageURL="blog/js-best-practices-config-unit-tests-part-c/cover-report-2.jpg" />


> What else can we do with this report?
>
> In the [next article](/blog/js-best-practices-config-ci-part-d) will see how to build a full CI using all the tools we already integrated into the project and more.

----

Photo by <a href="https://burst.shopify.com/@matthew_henry?utm_campaign=photo_credit&amp;utm_content=Browse+Free+HD+Images+of+Wide+Shot+Of+Compass+And+Waterfalls&amp;utm_medium=referral&amp;utm_source=credit">Matthew Henry</a> from <a href="https://burst.shopify.com/ocean?utm_campaign=photo_credit&amp;utm_content=Browse+Free+HD+Images+of+Wide+Shot+Of+Compass+And+Waterfalls&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>