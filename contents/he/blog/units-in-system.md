---
name: 'units-in-system'
title: יחידות מידה ומערכות תכנה
year: 4 באפריל 2023
color: '#8e7964'
id: 'units-in-system'
trans: 'units-in-system'
description: צורת עבודה נכונה עם יחידות מידה במערכות תכנה
---

ב-23 בספטמבר 1999 ניתק הקשר עם הגשושית 
Mars Climate Orbiter.
 פרוייקט בשווי 327 מיליון דולר ירד לטמיון.

חקירת האירוע העלתה כי 
[סיבת ההתרסקות היא המרת נתונים שגויה](https://he.m.wikipedia.org/wiki/%D7%9E%D7%A7%D7%A4%D7%AA_%D7%94%D7%90%D7%A7%D7%9C%D7%99%D7%9D_%D7%A9%D7%9C_%D7%9E%D7%90%D7%93%D7%99%D7%9D),
מערכת אחת שידרה ביחידת מידה אחת ומערכת שנייה פירשה את המידע ביחידת מידה אחרת.

האמת היא שתקלות דומות להחריד מתרחשות כל הזמן. 
בדרך כלל זה לא עולה מיליוני דולרים, אלא קצת תסכול, לפעמים הרבה תסכול.

הסיבה לאתגרים הללו היא הקושי המובנה בהעברת מידע, 
כשבצמוד אל המידע עצמו צריך גם לוודא שהמקבל מודע ליחידת המידה בה משתמשים.

הפתרון הקלאסי הוא שיוּם טוב יותר של המתודות והמשתנים וכתיבת הערות ותיעוד. 

כן, אבל.

זהו פתרון שלא מבטיח כלום. עדיין ייתכן והתכניתן הנמהר לא ישים לב, 
יתבלבל או לא יבין את ההבדל בין המידות השונות 
(מי יודע את ההבדל בין מייל ימי למייל יבשתי?)

וגם אם כן, עדיין נצטרך להמיר את המידע ליחידת מידה אחרת. 
ובמערכות רבות זה קורה לעיתים תכופות, כאשר לדוגמה משתמשים ב-API חיצוני. 
פשוט מתיש. אם אתה זה שמספק את ה-API אתה מוצא את עצמך תוהה באיזו יחידת מידה כדאי לך לבחור.

במאמר זה אנסה להדגים את הבעייתיות שבצורת עבודה זו ולהציג פתרון שסוגר את הפינה בצורה טובה.

ראשית אמל"ק קטן לבעיות בכתיבת קוד עם יחידות מידה:
- קשה לנתח מהי יחידת המידה אם לא כתבו מפורשות בשם המשתנה או בתיעוד את יחידת המידה
- שמות משתנים טרחניים
- המרות מיותרות לכל רוחב המערכת
- בכל זמן נתון צריך לדעת להמיר מיחידת מידה X ל-Y
- לא נכון לוגית להכריח את ה-API להיות ביחידת מידה ספציפית

ובהרחבה 
ניתן דוגמאות קוד להמחשת הבעיתיות

בדוגמה זו ניתן להבחין בקושי להבין, מהי בעצם יחידת המידה המקורית?

<iframe height="400px" width="100%" src="https://repl.it/@HaimKastner/units-problem1?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

<br>
<br>
<br>

ובדוגמה זו ניתן להבחין בסירבול שמות המשתנים.

<iframe height="400px" width="100%" src="https://repl.it/@HaimKastner/units-problem2?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

<br>
<br>
<br>

בדוגמה זו מומחשת בעיית ההמרות מיותרות שלא ניתן להתחמק מהן.

<iframe height="400px" width="100%" src="https://repl.it/@HaimKastner/units-problem3?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

<br>
<br>
<br>

נו, מי רוצה להמיר דצימטר לנאוטיקל-מיילס?

<iframe height="400px" width="100%" src="https://repl.it/@HaimKastner/units-problem4?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

<br>
<br>
<br>

בדוגמה זו ניתן לראות שזה מרגיש "לא טוב" שחייבים דווקא יארדים בשעה שהמערכת עצמה מטרית.

<iframe height="400px" width="100%" src="https://repl.it/@HaimKastner/units-problem5?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

<br>
<br>
<br>
<br>

## הפתרון

תגידו שלום לספרייה 
[UnitsNET](https://github.com/angularsen/UnitsNet).

מה שהספרייה המופלאה הזו עושה זה לתת מבנה נתונים המייצג את התכונה הנדרשת, 
נגיד `Length` עבור אורך. 
למבנה הנתונים יהיו כתכונות את כל יחידות המידה הקיימות הרלוונטיות 
(מטרים, יארדים וכו' וכו'). 
כך שבכל רחבי המערכת יסתובב לו מבנה הנתונים `Length`, 
ולכשנצטרך יחידה ספציפית (נניח לקבל מידע מ-API שדורש מטרים) פשוט יקחו את המטרים ממבנה הנתונים של ה-`Length`.

דוגמה? יאללה דוגמה בקוד.

```cs

var distanceFromUser = Length.FromMeters(1000)

void PrintDistance(Length distance)
{
  console.Writeline("The distance is " + distance.Kilometers + " km") // 1
}

PrintDistance(distanceFromUser);

``` 

רואים כמה זה פשוט וטוב?

חשוב לציין כי המפתחים עשו בחכמה ובמקום לכתוב כל יחידה ויחידה ידנית בקוד, 
יצרו [קבצי הגדרה](https://github.com/angularsen/UnitsNet/tree/master/Common/UnitDefinitions)
(בפורמט JSON) עבור כל יחידת מידה הניתנים להרחבה בקלות רבה.
וקוד המחולל מקבצי ההדרה את מבני הנתונים.

אממה, הפרוייקט הנפלא הזה מחולל לקוד
בשפת #C 
שכבודה (ויש כבוד!) במקומה מונח,
אבל אנחנו (ועוד כמה מליוני מפתחים) מכירים עוד שפה שאנחנו מאוד אוהבים ומוקירים הלוא היא 
JS/TS.

וכאן עבדכם הנאמן נכנס לסיפור 
[ובנה](https://github.com/haimkastner/unitsnet-js/tree/master/generator-scripts) 
מקבצי 
[הגדרת היחידות](https://github.com/angularsen/UnitsNet/tree/master/Common/UnitDefinitions)
 של UnitsNET חבילת NPM  שנקראת 
[unitsnet-js](https://www.npmjs.com/package/unitsnet-js)
לרווחת משתמשי JS/TS.


והופ, הנה איך נפתרים כל הבעיות שהוצגו בדוגמאות מלעיל 
(ב-TypeScript)


<iframe height="400px" width="100%" src="https://repl.it/@HaimKastner/unitsnet-solution?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

<br>
<br>
<br>


ומרוב ההצלחה המסחררת (והצורך של הכותב גם בספרייה לפייתון)

הספרייה זמינה עכשיו גם בפייתון!

קוד המקור של הספרייה [unitsnet-py](https://github.com/haimkastner/unitsnet-py)

והספרייה זמינה לשימוש ב-[https://pypi.org/project/unitsnet-py](https://pypi.org/project/unitsnet-py/)

<br>


תהנו!
