---
name: 'js-best-practices-config-linter-part-b'
title: 'הגדרת סביבת פיתוח ל-Node.JS – הגדרת לינטר'
year: 10 ביולי 2021
color: '#8e7964'
id: 'js-best-practices-config-linter-part-b'
description:  מדריך הגדרת סביבת פרוייקט תקני ב-NODE.JS – חלק ב' – הגדרת לינטר
---

----
> *הגדרת סביבת פיתוח ל-Node.JS*
>
> [חלק א'](/blog/js-best-practices-config-ts-part-a) – הגדרת פרוייקט TS
>
> <ins>[חלק ב'](/blog/js-best-practices-config-linter-part-b) – הגדרת לינטר</ins>
>
> [חלק ג'](/blog/js-best-practices-config-unit-tests-part-c) – הגדרת בדיקות יחידה
>
> [חלק ד'](/blog/js-best-practices-config-ci-part-d) – הגדרת תהליך אינטגרציה אוטומטית
----

<br>
<br>

אחרי שהגדרנו את סביבת הפיתוח של הפרוייקט, 
חשוב מאוד 
(בכל פרוייקט ובכל שפה)
לקבוע מוסכמות פיתוח בקוד,
כמובן מומלץ שזה יהיה  כמה שיותר תואם למה שמקובל בקהילת הפיתוח של הטכנולוגיה הספציפית, 
התאמת מוסכמות עוזרת למניעת בעיות נפוצות שיפור הקריאות ולמבנה תקין של קוד,
גם אם לעיתים זה נראה מעט קטנוני זה *מאוד* חשוב.

בכדי לעזור לנו 
לשים לב ולאכוף את הכללים ישנו כלי 
שנקרא לינטר שתפקידו לוודא שהקוד אכן עומד בכללים, עבורנו 
ב-Node.JS 
 הכלי הנפוץ והמקובל 
לכך הוא
 [ESLint](https://eslint.org/)
  ובחלק הבא של המאמר נראה איך לשלב אותו בפרוייקט שלנו.

ראשית נוסיף את הכלי ואת הפלאגאינים שלו כתלויות פיתוח:
```bash
npm i --save-dev eslint eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react
```
נוסיף גם את הפרסר ל-TypeScript
```bash
npm i --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin 
```
ונוסיף את אוסף הכללים של Airbnb (לא חובה, אך לטעמי זה הכי טוב :)
```bash
npm i --save-dev eslint-config-airbnb eslint-config-airbnb-typescript
```

בכדי להגדיר את הלינטר, הפרסר ואוסף הכללים, 
ניצור קובץ בשם 
```bash
.eslintrc.js
```
 בו נגדיר את הפלאגינים ואת הכללים. 
כרגע נגדיר את זה הכי מינימלי,
 רק שישתמש בפרסר של TypeScript, ושישתמש בכללים של airbnb לצורך כך.

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

נוסיף לפרוייקט קובץ בשם
```bash
.eslintignore
```

  כשמו כן הוא, בו נגדיר את התיקיות\קבצים שאנו לא מעוניינים שהלינטר יבדוק, 
	למשל את תיקיית התלויות או את התוצרים של הבילד וכו'
```bash
node_modules
dist
.eslintrc.js
```

בקובץ המניפסט `package.json` תחת `scripts` נוסיף את השורות הבאות
```bash
"lint": "eslint . --ext .js,.ts",
"lint:fix": "eslint . --ext .js,.ts --fix",
```

נריץ אתץ הפקודה `npm run lint` בכדי לראות ולאמת שאכן אין שגיאות לינט, 
ובמקרה ויש חלקם ניתנים לתיקון אוטומטי ע"י הפקודה `npm run lint:fix`.

אחרי הרצה של הפקודה נקבל ככל הנראה את השגיאה הבאה:
```
7:1  error  Prefer default export  import/prefer-default-export
```

מה זה אומר? שיש כלל בלינטר שצריך שיהיה
`export default` 
אך בקובץ `index.ts` אין כזה, 
אבל... 
אם אנחנו בכוונה לא רוצים שיהיה, מה עושים?

פשוט מאוד, דורסים את הכלל ומוסיפים את השורה הבאה תחת `rules` בקובץ `.eslintrc.js`
```
'import/prefer-default-export': 'off'
```

נריץ שוב `npm run lint` ו... הבעיה נעלמה. 

כך לכל כלל ניתן לתת ידנית את הערך המתאים עבורנו `off` \ `warn` \ `error`, כמובן מומלץ לשים לב טוב טוב לכל שינוי מהדיפולט.

לשינויים יותר מורכבים מומלץ לעיין 
[בדוקומנטציה של ESLint](https://eslint.org/docs/user-guide/configuring/configuration-files#using-configuration-files).


במקרה וה-IDE הוא VSCode מומלץ מאוד להתקין את התוסף של ESLint
 כך שנקבל את המשוב מיידית ב-IDE מהלינטר.  
 (אחרי שינוי ההגדרות כדאי לעשות ריסטרט ל-VSCode).

חשוב גם להכיר, 
בהינתן ויש צורך בכללים שונים עבור סוגי קבצים שונים או סתם עבור קבצים במיקום מסויים, 
ניתן להוסיף הרחבה לקובץ ההגדרה של 
ESLint 
ובתוכו כמובן לשים איזה כללים או הרחבות שאנחנו מעוניינים בהם.

למשל, בדיפולט של הכללים כרגע לא מקובל לכתוב בקוד `console.log('print some')` 
אבל נגיד ויש לנו קוד לגסי שיושב ב- `src/legacy` שיש בו הרבה כאלה, 
ואנו לא מעוניינים כרגע לתקן הכל, 
מצד שני כן רוצים שיהיה לינטר, 
מה עושים? 

קל, 
נוסיף לקובץ הקונפיגורציה של ESLint  שדה `overrides`
ובתוכו נגדיר על איזה קבצים זה יחול ומה הכללים החדשים שלנו
כך שהקובץ ייראה עכשיו כך:
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

והכל בא על מקומו בשלום.

כמו שאפשר לראות הלינטר מיועד ומתריע בעיקר על שגיאות איכות קוד כמו למשל שימוש במשתנה לפני שהוא הוצהר 
איך לזרוק שגיאות וכדו' 

אך כמו כן כרגע גם מתריע על ענייני נראות של הקוד כמו רווחים שלא במקום, מספר טאבים 
וכו', 
אבל זה לא הייעוד העיקרי ובמקרה של
Node.JS
יש גם כלי ייעודי במיוחד לזה שנקרא
`prettier`
, ממש לא חובה אבל כן כדאי להוסיף אותו,
איך עושים את זה? פשוט!

ראשית נוסיף את הכלי והפלגאין שלו ל-
ESLint
```bash
npm i --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

ניצור קובץ הגדרות של `prettier` בשם 
```bash
.prettierrc.json
```

 בתוכו נגדיר את הכללים איך אנו רוצים שייראה הקוד שלנו 
 למשל אינדנטציה, אורך שורה רווחים וכדומה לצורך הדוגמה נכתוב בתוכו את התוכן הבא:
```json
{
  "tabWidth": 2,
  "useTabs": true,
  "singleQuote": true,
  "printWidth": 160,
  "endOfLine": "auto"
}
```

ניתן לראות 
[בדוקוטמנטציה של prettier](https://prettier.io/docs/en/options.html)
 את כלל האפשרויות עבור זה.

בכדי להגדיר את הכללים כחלק מהלינטר 
וכן למנוע סתירות בין הכללים, 
נידרש להכניס את `prettier` כפלגאין בלינטר 
וכמובן לדרוס את הכללים הקיימים עם הכללים החדשים של `prettier`.

נפתח שוב את קובץ ההגדרות של הלינטר `.eslintrc.js`
ונוסיף את `prettier`  בתור פלגאין.

נרחיב את הכללים הקיימים עם הכללים החדשים 
ונוודא דריסה של הכללים הקיימים שסותרים את החדשים.

וקובץ ההגדרות ייראה עכשיו כך:
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

אחרי כל השינויים קבצי ההבגדרות אמורים להראות אמורים להראות בערך כך:
* [.eslintrc.js](https://github.com/haimkastner/js-project-best-practice/blob/main/.eslintrc.js)
* [.eslintignore](https://github.com/haimkastner/js-project-best-practice/blob/main/.eslintignore)
* [.prettierrc.json](https://github.com/haimkastner/js-project-best-practice/blob/main/.prettierrc.json)


ומעכשיו מבנה הקוד של הפרוייקט שלנו בטוח יהיה תקין ומסודר 💪 💪 💪

> [במאמר הבא](/blog/js-best-practices-config-unit-tests-part-c) נלמד איך לוודא שהלוגיקה עצמה שכתבנו לא תישבר ושבכל שינוי של לוגיקה שום דבר לא נדפק בטעות (או בזדון 😱) בעזרת בדיקות יחידה

----

Photo by <a href="https://burst.shopify.com/@matthew_henry?utm_campaign=photo_credit&amp;utm_content=Picture+of+Organized+Pencil+Holder+%E2%80%94+Free+Stock+Photo&amp;utm_medium=referral&amp;utm_source=credit">Matthew Henry</a> from <a href="https://burst.shopify.com/design?utm_campaign=photo_credit&amp;utm_content=Picture+of+Organized+Pencil+Holder+%E2%80%94+Free+Stock+Photo&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>