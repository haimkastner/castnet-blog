---
name: 'js-best-practices-config-unit-tests-part-c'
title: 'הגדרת סביבת פיתוח ל-Node.JS – הגדרת בדיקות יחידה'
year: 10 ביולי 2021
color: '#8e7964'
trans: 'js-best-practices-config-unit-tests-part-c'
id: 'js-best-practices-config-unit-tests-part-c'
description:  מדריך הגדרת סביבת פרוייקט תקני ב-NODE.JS – חלק ג' – הגדרת בדיקות יחידה
---

----
> *הגדרת סביבת פיתוח ל-Node.JS*
>
> [חלק א'](/blog/js-best-practices-config-ts-part-a) – הגדרת פרוייקט TS
>
> [חלק ב'](/blog/js-best-practices-config-linter-part-b) – הגדרת לינטר
>
> <ins>[חלק ג'](/blog/js-best-practices-config-unit-tests-part-c) – הגדרת בדיקות יחידה</ins>
>
> [חלק ד'](/blog/js-best-practices-config-ci-part-d) – הגדרת תהליך אינטגרציה אוטומטית
----

<br>
<br>

אז אם יש פרוייקט עם סביבת פיתוח מוכנה
וגם כלים מובנים לווידוא איכות כתיבת הקוד, 
מה נשאר? כמובן, לוודא שגם הלוגיקה בסדר 😊  

בסוף הרי זה החלק הכי חשוב, 
כותבים לוגיקה מסויימת, אחרי הרבה זמן צריך לתקן משהו, 
מי יידע אם זה שבר משהו? הטסט כמובן.

ישנם פילוסופיות שונות איך להתסכל על הבדיקות יחידה, 
אך בכל מקרה אין חולק כמה זה חשוב וקריטי לפרוייקט מתפקד.

אז נרד ישר לפרטים, 
איך לשלב בדיקות בפרוייקט, במדריך הזה נשתמש בספריית 
[mocha](https://mochajs.org/)
 בשביל לכתוב את הטסטים ובספריית 
[chai](https://www.chaijs.com/)
לאסרשנים (ספריית העזר לבדיקת תקינות התוצאה של הטסט)

 נוסיף את הספריות הבאות
([ts-node](https://typestrong.org/ts-node/) מיועדת לאפשר הרצת הטסטים בלי בילד ל-JS)

```bash
npm i --save-dev mocha chai ts-node @types/mocha @types/chai
```

נפתח את הקובץ `package.json` וב-`scripts` נראה שם `test` נחליף אותו בשורה הבאה
```bash
"test": "mocha -r ts-node/register src/**/*.spec.ts"
```
מה שאומר שהגדרנו שיוחשב כקובץ טסט כל קובץ שהסיומת שלו היא `spec.ts`  ושנמצא איפשהוא תחת `src`


עכשיו ניצור קובץ בשם `src/index.spec.ts` (או כל שם אחר בהתאם לעניין רק שיסתיים ב-`spec.ts`)
בתוכו נקרא לספריות של הטסטים וכמובן ללוגיקה שברצוננו לבדוק
```ts
import { describe } from 'mocha';
import { expect } from 'chai';
import { addNumbers } from './index';
```

נגדיר אוסף של טסט\ים 
```ts
describe('#Test addNumbers logic', () => {
	// The tests are here
});
```
 
ועכשיו נוסיף את הטסט עצמו, שבודק האם באמת הלוגיקה של addNumbers עובדת היטב
```ts
it('Test positive numbers', () => {
	// The test logic is here
});
```

בתוכו נקרא ל-`addNumbers` עם ערכים שנחליט עליהם, נבדוק בעזרת `chai` 
שהתוצאה אכן תקינה
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

נוסיף עוד בדיקה לצורך העניין, לוודא שגם במספרים שליליים הלוגיקה עובדת היטב

וגם נבדוק שהלוגיקה בקוד הלגסי אכן עובדת היטב

ועכשיו הקובץ ייראה כך
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
 אפשר לראות את הקובץ המלא כאן [index.spec.ts](https://github.com/haimkastner/js-project-best-practice/blob/main/src/index.spec.ts)

נריץ את הפקודה `npm run test` .ו... זהו simple as that 😊

בעיקרון הכל מוכן, 
אבל אם אנחנו רוצים גם לקבל דו"ח מסודר מה מהלוגיקה נבדק וכמה, 
וסטטיסטיקות על אחוז הכיסוי, 
מה שיכול גם לשמש אתנו להצגת מידע בדשבורדים שונים, נוסיף את הספריות הבאות
```bash
npm i --save-dev mocha-lcov-reporter nyc
```

ונוסיף ב-`package.json` ב-`scripts` את השורה הבאה
```bash
"cover": "node \"node_modules/nyc/bin/nyc.js\" --exclude src/**/*.spec.ts --reporter=lcov npm run test"
```

מה שאומר שאנחנו מריצים את `nyc` 
שתריץ את הטסטים ותכין את הדו"ח 
(ושהדו"ח כמובן לא יכלול את קבצי הטסט עצמם😊)

נריץ `npm run cover`

אחרי הריצה נוצרה תיקייה שנקראת 
```bash
.nyc_output
```
 שמכילה את תוצאות הבדיקה הגולמיות, ותיקייה בשם `coverage` 
 בתוכה נראה קובץ בשם `lcov-report/index.html`
 נפתח את זה בדפדפן ונראה את הדו"ח היפה.
 
היי!!! אנחנו על 100 אחוז כיסוי  🥇🥇🥇

<image-responsive imageURL="blog/js-best-practices-config-unit-tests-part-c/cover-report-1.jpg" />
<image-responsive imageURL="blog/js-best-practices-config-unit-tests-part-c/cover-report-2.jpg" />


> מה עוד אפשר לעשות עם הדו"ח הזה? 
>
> [במאמר הבא](/blog/js-best-practices-config-ci-part-d)
נראה איך לארגן אינטגרציה מלאה של כל הטוב שסידרנו עד עכשיו, יחד לכדי מכונה משומנת ואוטומטית 🥊.
