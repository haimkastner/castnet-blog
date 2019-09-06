---
name: 'dummy-recursion-in-js-and-its-solution-with-async-await'
title: רקורסיית דמה ב-JS  ופתרונה עם async+await
year: 30 ביולי 2019
color: '#8e7964'
trans: 'soon'
id: 'dummy-recusion'
description: ביצוע קריאות אסינכרוניות בצורה סינכרונית, למה ואיך.
---

## הקדמונת: מקביליות ב-JavaScript

כידוע לכל, JavaScript יועדה לרוץ ללא מקביליות בקוד (ב-nodejs/browser) כך שבכל זמן נתון רק שורה אחת של הקוד רצה, ובקריאה אסינכרונית ל-IO שרצה "ברקע" לכשהפעולה תסתיים יופעל callback מלולאת האירועים רק כששאר הקוד סיים לרוץ.

בכל מקרה אין מצב בו שורות קוד JS של הפרויקט שלנו רצות במקביל. (כיום יש [Worker Threads](https://nodejs.org/api/worker_threads.html)  אבל זה כבר נושא לפוסט אחר). 

## הבעיה

נניח ואנחנו מעוניינים לבצע אוסף פעולות אסינכרוניות (שלא "עוצרות" את הקוד שלנו) אבל להריץ אותן סינכרונית.
איך עושים כזה דבר ב-JS?

## רגע, מה? להריץ אסינכרוני או סינכרוני?

אני אתן דוגמה מהעולם האמיתי. בפרויקט הבית החכם שלי ה-[casanet](https://github.com/haimkastner/home-iot-server) עלתה בעיה כזו, הפרויקט יועד לנהל בממשק אחד את כלל המכשירים החכמים בבית ללא תלות בחברה המייצרת ובפרוטוקול התקשורת הספציפי של המכשיר. 
לכן יצרתי ממשק גנרי של קבלת סטטוס ע"י callback ועבור כל סוג מכשיר מומש ה-API של החברה הספציפית בעטיפה של הממשק הגנרי. קל ופשוט.

התסריט הקלאסי לפרויקט כזה הוא לעבור לפי בקשה על כלל המכשירים בבית ולבדוק מה הסטטוס שלהם (כבוי, דלוק וכדו'). 

כך אמור להראות הקוד:

<iframe height="400px" width="100%" src="https://repl.it/@HaimKastner/get-all-async?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

(בדוגמה יצרתי פונקציה שממתינה זמן רנדומלי ומחזירה סטטוס רנדומלי)

מה שעשינו פה בעצם זה לעבור על כל המכשירים בבית, עבור כל אחד מהם לפנות ל-API ולבדוק מה הסטטוס, ברגע שכלל המכשירים יחזירו תשובה (כמות האיברים ברשימת המכשירים שווה לכמות המכשירים), נדפיס את רשימת הסטטוסים של המכשירים.

בשלב זה אין לנו שליטה על סדר הזנת הסטטוסים ברשימה.

## אז איפה הבעיה?

- לא מספיק מובן שכשהלולאה מסתיימת עדיין הקריאות "באוויר". והלולאה רק מפעילה את הקריאה סידרתית.
- מסתבר שעבור חלק מן המכשירים פרוטוקול התקשורת עם המכשיר די משונה, והוא מבוסס ברודקסטינג ב-UDP כך שאפשרי לדבר רק עם מכשיר אחד בזמן נתון.
מה שאנחנו רוצים לעשות זה לשלוט בסדר של בקשות ה-API האסינכרוניות, ורק אחרי שהראשון הסתיים להמתין כמה שניות ואז לבקש את השני, וכן הלאה.
והנה יש לנו דוגמה של צורך בביצוע פעולות אסינכרוניות, בצורה סינכרונית. אחת אחרי השנייה.

## רקורסיה. הפתרון האולטימטיבי.

מה שאפשר לעשות זה לבצע קריאה אסינכרונית, שלכשתסתיים היא תפעיל setTimeout של כמה שניות שמקבלת פונקציה שתפעיל את הקריאה האסינכרונית הבאה, וכך עד למכשיר האחרון.
כך גם סדר הקריאות סינכרוני, ואין קריאה שתתנגש באחרת, וגם בניית מערך הסטטוסים יהיה מסודר וקריא.

וכך נראה הקוד:

<iframe height="400px" width="100%" src="https://repl.it/@HaimKastner/recursive-solution?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>


## אז למה בעצם זו רקורסיית דמה? 

מבחינת הקוד אכן זו רקורסיה קלאסית, עם תנאי עצירה קלאסי. *אבל* אין פה באמת StackTrace בין הקריאות.
(בהינתן רשימת המכשירים אין סופית, הקוד ירוץ לנצח ולא נקבל StackOverflow).
בגלל מבנה השפה כל קריאה לפונקציה אסינכרונית משחררת את ה- Stack וה-callback יופעל מלולאת האירועים אחרי שחזרה התשובה, והלוגיקה שוב תפעיל את הקריאה הבאה ותשחרר את ה-Stack וחוזר חלילה.

בשורה התחתונה זאת לא *באמת* רקורסיה, אבל עדיין מבחינת הקוד שלנו זאת קריאה עצמית מקוננת.

## אז מה רע?

זהו שזה לא באמת רע, והפתרון הזה בהחלט עובד וגם יחסית קריא.
אממה אנחנו משתמשים בפתרון מורכב עבור בעיה שהייתה אמורה להיות סופר פשוטה. 
כל מה שרצינו היה לעבור בלולאה הכי מטופשת בעולם על המכשירים לבקש עבור כל אחד את הסטטוס, לשמור את התוצאה לרשימה ולהמתין כמה שניות עד שממשיכים את הלולאה,

וכך זה היה אמור להראות ב-Pseudo קוד:

```javascript  
for (device of devices) {
  currentStatus = readStatus(device)
  devicesStatuses.push(currentStatus)
  sleep(x)
}
```
 
ואיכשהו מצאנו את עצמנו כותבים קוד הרבה יותר מורכב, לא נעים.

## אז מה הפתרון?

למזלנו נוספה תמיכה מובנית ב-Promises, ולא רק אלא גם תחביר של async-await 
ובעזרתם נראה שממש קל ליצור קוד שגם עומד בדרישות כמו הקוד הרקורסיבי וגם נראה יפהפה בדיוק כמו ה-Pseudo קוד.

ראשית אנחנו צריכים פונקציה אסינכרונית שממתינה x שניות ונראית כך:


```javascript  
/** Simple pattern to sleep by promise */
const sleep = (seconds) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds * 1000)
  })
} 
```
(כמובן כמו כל דבר טוב [קיימת חבילה כזו ב-NPM](https://www.npmjs.com/package/sleep-promise))

שנית, את ה-API של הממשק הגנרי לקבלת סטטוס מכשירים צריך לשנות ל-Promise במקום Callback.

(בסופו של דבר גם Promise זו סה"כ עטיפה נוחה למנגנון ה-Callbacks) 

ועכשיו הקוד ייראה כך:

<iframe height="400px" width="100%" src="https://repl.it/@HaimKastner/final-async-await-solution?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

### יפהפה!

מבחינה לוגית לא השתנה כלום, הלוגיקה אותה לוגיקה. אבל עכשיו זה נראה קוד לגיטימי כמו שציפינו. קשה לדמיין שזה בדיוק אבל בדיוק הרקורסיה שעשינו מקודם.

----

Photo by <a href="https://burst.shopify.com/@sarahpflugphoto?utm_campaign=photo_credit&amp;utm_content=Free+Finger+Pointing+At+Javascript+Code+Photo+%E2%80%94+High+Res+Pictures&amp;utm_medium=referral&amp;utm_source=credit">Sarah Pflug</a> from <a href="https://burst.shopify.com/api-tech?utm_campaign=photo_credit&amp;utm_content=Free+Finger+Pointing+At+Javascript+Code+Photo+%E2%80%94+High+Res+Pictures&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>
