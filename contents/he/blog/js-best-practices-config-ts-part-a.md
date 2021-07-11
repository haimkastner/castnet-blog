---
name: 'js-best-practices-config-ts-part-a'
title: 'הגדרת סביבת פיתוח ל-Node.JS – הגדרת TypeScript'
year: 9 ביולי 2021
color: '#8e7964'
id: 'js-best-practices-config-ts-part-a'
description:  מדריך הגדרת סביבת פרוייקט תקני ב-NODE.JS –  חלק א' -הגדרת TypesScript
---

----
> *הגדרת סביבת פיתוח ל-Node.JS*
>
> <ins>[חלק א'](/blog/js-best-practices-config-ts-part-a) – הגדרת פרוייקט TS</ins>
>
> [חלק ב'](/blog/js-best-practices-config-linter-part-b) – הגדרת לינטר
>
> [חלק ג'](/blog/js-best-practices-config-unit-tests-part-c) – הגדרת בדיקות יחידה
>
> [חלק ד'](/blog/js-best-practices-config-ci-part-d) – הגדרת תהליך אינטגרציה אוטומטית
----

<br>
<br>

בבואנו לכתוב פרוייקט קוד, עוד לפני שמתחילים לכתוב את הקוד והלוגיקות, חשוב מאוד להגדיר סביבת פיתוח ותהליך פיתוח מסודר טוב עם בקרה על הקוד ושימוש בכלים נפוצים על מנת למנוע בעיות ובאגים, ובכללית להפוך את תהליך כתיבת הקוד ותחזוקו לקל ונעים יותר.

ישנם כלים רבים לצורך כך, וכמובן אוסף של בסט-פרקטיסס מקובלים על כולם.

אבל, ישנם כלים שמוסכם על כולם שהם ממש חובה והמינימום בכדי לאפשר ניהול ותחזוקה סבירה של כל פרוייקט.

במדריך הבא, אני אסביר ואראה לפי מיטב הבנתי את הכלים וצורת הפיתוח בסביבת Node.JS, אני אשתדל להסביר בקצרה ממש למה הכלי\תהליך נועד וכמובן עם דוגמאות איך להגדיר אותו בהתאם לצרכים של כל אחד.

נתחיל? נתחיל.

אז מה באמת המינימום? (נכון בהתאמה קלה לכל שפה שתהיה)

*	`Types`- שימוש בכלים שהשפה עצמה נותנת, במקרה שלנו שימוש ב TypeScript במקום ישירות ב JavaScript.
* `Linter` (לינטר) - כלי המוודא שמבנה וקונבנציות הקוד בכל הפרוייקט תואמים לסט כללים מקובלים ומוגדרים מראש (למשל, איך מגדירים שם של פוקציה?) במקרה שלנו ESLint.
*	`Prettier` (מייפה 🤔) - כלי המוודא שנראות הקוד תהיה זהה בכל הפרוייקט (למשל, רווחים VS טאבים) במקרה שלנו זה נקרא... Prettier (לעיתים זה נחשב כחלק מהלינטר).
* `Unit Tests` בדיקות יחידה - כן מראש, לפני כתיבת שורת קוד אחת, 
צריך כבר לארגן סביבה תומכת לבדיקות שבוודאי יגיעו. במקרה שלנו נשתמש ב Mocha להרצת הטסטים (וב-Chai להגדרת האסרשנס).
*	`Continuous Integration` (אינטגרציה רציפה 🤔) – שילוב כל הכלים למעלה למערכת אחת אוטומטית שמוודאת הכל בודקת ובונה את התוצר או מתריעה על בעיות אם ישנם, במקרה שלנו GitHub Actions.

אז... לעבודה, ראשית ניצור תיקייה ריקה נקרא לה לצורך העניין
`js-project-best-practice`.

בתוכה נפתח את הטרמינל\חלון הפקודה  וניצור פרוייקט JS חדש בעזרת הפקודה 
`npm init`.

בסיומה יווצר עבורנו הקובץ `package.json` הלוא הוא קובץ המניפסט של מבנה פרוייקט ה-JS התלויות שלו וכו' וכו'.

כמו שאמרנו, 
אנחנו מעוניינים לכתוב בעטיפה של TypeScript ולא ישירות ב-JavaScript,
 כך שהקוד גם יהיה הרבה *הרבה* יותר קריא וגם ימנע טעויות ושגיאות של טייפים, 
 וכמובן ייתן לנו מערכת "בילד" קטנה שגם תמפה עבורנו שגיאה ותתריע על בעיות עוד לפני זמן הריצה.

בכדי להגדיר TypeScript ואת הטייפים הבסיסיים של Node, 
נוסיף בעזרת [NPM](https://www.npmjs.com/) (Node Packages Manager)  את TypeScript בתור תלות (דפנדנסי) של הפרוייקט, (אם כי רק תלות בתהליך הפיתוח ולא בזמן הריצה עצמה)  בעזרת הפקודה 
```bash
npm i --save-dev typescript @types/node
```
ונגדיר את TypeScript בפרוייקט בעזרת הפקודה `npx tsc –init`.

נפתח את הפרוייקט ב-IDE (עורך הקוד) מומלץ להתשמש ב-VSCode אם כי ממש ממש לא חובה, ונפתח את הקובץ החדש
שנוצר שנקרא `tsconfig.json`.

לא נעבור כרגע על כל האופציות שיש, אבל מה שכן חשוב לנו ביותר לשנות זה הבאים:

* `target` - בעזרתו מוגדרת גרסת הJS שאיתה נשתמש, אז אלא אם יש סיבה טובה לתמוך במנוע JS  ישן, כדאי לשים שם ESNEXT או ES2021
* `declaration`, `declarationMap`, `sourceMap` - נגדיר בהם `true` במידה 
ומטרת הפרוייקט היא להיות ספרייה ואנו מעוניינים לקבל את קבצי המיפוי והצהרות הטייפים אחרי הבילד.
* `outDir` - בו מוגדר הנתיב אליו יישמרו הקבצים שייבנו בתהליך הבילד של TypeScript נשנה את הערך ל
```bash
./dist
```
* `types` - בו מגדירים טייפים גלובליים שרלוונטיים לכל הפרוייקט, 
מאחר ואנחנו רוצים להשתמש בטייפים של Node נוסיף תחת האובייקט `compilerOptions`  את האובייקט הבא
```json
"types": [
      "node",
  ]
```
* `include` - נוסיף את האובייקט הבא לJSON בכדי להגדיר את מיקום קבצי קוד המקור 
```json
  "include": [
    "src/**/*.*"
  ],
```
* `exclude` - ונוסיף את האובייקט הבא בכדי להגדיר מה *לא* קוד המקור, למשל הנתיב שבו נמצאים הדפנדנסיז של הפרוייקט.
```json
  "exclude": [
    "node_modules"
  ]
```

אחרי כל השינויים הקובץ אמור להראות בערך כך
[tsconfig.json](https://github.com/haimkastner/js-project-best-practice/blob/main/tsconfig.json)

נעבור חזרה לקובץ `package.json` בתוכו נראה שדה שנקרא `scripts` שזה הפקודות ריצה\בילד שאפשר
 לתת ולהגדיר מראש לפרוייקט, נוסיף שם את השורה  הבאה:
```json
"build": "tsc",
```
שבעצם מגדיר שכשנריץ `npm run build` הפקודה `tsc` (פקודת הבילד של TS) תרוץ.

בשביל לבדוק שאכן הגדרנו הכל כמו שצריך  ניצור תיקיה בשם `src` בפרוייקט  בתוכה ניצור קובץ בשם `index.ts`
 בתוכו נכתוב את הקוד התמים הבא:
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
עכשיו נריץ את הפקודה `npm run build` ובסיומה נראה שנוצר קובץ js בתיקייה ה-`dist`שמכיל את הקוד אחרי שעבר "הסבה" ל-JS.

מעולה! יש לנו עכשיו פרוייקט TypeScript מוגדר ומוכן לשימוש.

> [במאמר הבא](/blog/js-best-practices-config-linter-part-b) נלמד איך להוסיף לינטר לפרוייקט כך שנמנע מעצמנו בעיות כמו למשל לקרוא למשתנה לפני שהוא הוגדר 😲

----

Photo by <a href="https://burst.shopify.com/@sarahpflugphoto?utm_campaign=photo_credit&amp;utm_content=Browse+Free+HD+Images+of+Neatly+Set+Desk+For+Startup+Or+School&amp;utm_medium=referral&amp;utm_source=credit">Sarah Pflug</a> from <a href="https://burst.shopify.com/team?utm_campaign=photo_credit&amp;utm_content=Browse+Free+HD+Images+of+Neatly+Set+Desk+For+Startup+Or+School&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>