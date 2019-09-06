---
name: 'earth-coordinates-and-spatial-data'
title: כדור הארץ, קואורדינטות במרחב ומה שביניהם
year: 27 באוגוסט 2019
color: '#8e7964'
id: 'earth-coordinates'
description: אינפורמציה קלה על קצה המזלג על עולם קואורדינטות כדור-הארץ, תיאור מיקומים ויחס בין מיקומים, מנקודת המבט של מפתח מערכות GIS.
---

## רקע

המאמר מקוצר מאוד. הוא אינו מתיימר להקיף הכל ונכתב מנסיוני כמפתח ללא רקע אקדמי.
אשמח מאוד להארות, הערות ותיקונים במייל, טוויטר, PR ב-GitHub או בכל דרך אחרת 😀.

המידע במאמר יכול לדעתי להוסיף למי שצריך להבין את העקרונות הבסיסיים של עולם המושגים של מפות ומערכות GIS כמפתח תכנה.

כמובן, גם אם אתם לא מפתחים אבל תמיד תהיתם מה הם המספרים המוזרים ב-URL של מיקום בגוגל Maps, מקומכם איתנו.
## מערכות קואורדינטות וישור קו כללי
* [מערכת קרטזית](https://he.wikipedia.org/wiki/%D7%9E%D7%A2%D7%A8%D7%9B%D7%AA_%D7%A6%D7%99%D7%A8%D7%99%D7%9D_%D7%A7%D7%A8%D7%98%D7%96%D7%99%D7%AA) - 
הינה מערכת המבוססת על צירי X,Y,Z 
[במרחב האוקלידי](https://he.wikipedia.org/wiki/%D7%9E%D7%A8%D7%97%D7%91_%D7%90%D7%95%D7%A7%D7%9C%D7%99%D7%93%D7%99) 
לתיאור מרחק נקודה נתונה מראשית הצירים. שיטה זו מתאימה בדר"כ למרחב מלבני.

<image-responsive class="center" imageURL="blog/earth-coordinates/cartesian-2d-map.png" alt="Cartesian 2D map"/>

(קרדיט [Wikipedia](https://he.wikipedia.org/wiki/%D7%A7%D7%95%D7%91%D7%A5:Cartesiancoordinates2D_he.svg))


* [מערכת פולארית (קוטבית)](https://he.wikipedia.org/wiki/%D7%A7%D7%95%D7%90%D7%95%D7%A8%D7%93%D7%99%D7%A0%D7%98%D7%95%D7%AA_%D7%9B%D7%93%D7%95%D7%A8%D7%99%D7%95%D7%AA) - 
הינה מערכת קואורדינטות מבוססת הזוית מראשית מערכת הצירים
 בה מיקום מיוצג בעזרת הזווית בכל ציר (ציר רוחב/גובה) מנקודת ה-0 במערכת הצירים, מתאים בד"כ למרחב כדורי.
 

<image-responsive class="center" imageURL="blog/earth-coordinates/spherical_coordinate_system.jpg" alt="Spherical coordinate system"/>

(קרדיט [Wikipedia](https://he.wikipedia.org/wiki/%D7%A7%D7%95%D7%91%D7%A5:Spherical_coordinate_system.jpg))
 

### Datum (מבנה נתונים)

דאטום הינו מודל גאוגרפי, המכיל אוסף של נקודות המגדירות מערכת יחוס קבועה (כלומר מגדירות גאואיד - חתך של פני כדור הארץ). הדאטום מאפשר לתאר מקום על פני כדור הארץ ([ויקיפדיה](https://he.wikipedia.org/wiki/דאטום))

ובעברית: בגלל שצורת כדור-הארץ איננה גוף מתמטי פשוט (כדור, גליל, חרוט וכדו') , 
כדי שיהיה אפשר לתאר מיקום במערכת צירים כלשהי, יש צורך לסכם מראש מהי הצורה המתמטית שעליה נעבוד, שתהיה הכי קרובה לצורתו האמיתית של כדוה"א. 
ההחלטה הזו היא הדאטום שלנו, ולכן אין זה משנה באיזו מערכת צירים/קואורדינטות נשתמש, תמיד נצטרך לסכם מראש מהו הדאטום שעמו אנו עובדים.

קיימים דאטומים רבים, כשהנפוצים הם:
#### `ED50` Europe datum
במלחמת העולם השניה עלו קשיים בתכנון מבצעים בעקבות דאטומים שונים בין בעלות הברית. דאטום זה נוצר בשנת 1950 כחלק מהלקחים שהופקו ממלחמת העולם השנייה.
#### `WGS84` World geographic system
סטנדרט עולמי משנת 1984, משמש ב-GPS וברוב המערכות העולמיות.

## מערכות קואורדינטות בכדור הארץ

### Geocentric Cartesian
#### הרעיון
מאחר ואנו מעוניינים לתאר מיקום במערכת מבוססת מרחקים (המערכת הקרטזית) וצורתו של כדוה"א ככדור, עבור החישוב 
"נכניס" את כדוה"א בתוך ריבוע וירטואלי (ממש כמו לקחת כדור להכניס אותו לקופסא המרובעת הקטנה ביותר האפשרית), 
ומעתה כל מיקום בתוכו יהיה בעזרת צירי X,Y,Z כמו כל מלבן עם גובה, כשראשית מערכת הצירים במרכז כדוה"א.

איור "הכנסת" כדור הארץ למערכת הצירים:
<image-responsive class="center" imageURL="blog/earth-coordinates/earth-with-3d-cartesian.jpeg" alt="Earth with 3d cartesian"/>

(קרדיט [paul-reed.co.uk](http://paul-reed.co.uk/programming.html))

איור מערכת הצירים על פני כדור הארץ: 

<image-responsive class="center" imageURL="blog/earth-coordinates/geocentriccoordinatesystem.png" alt="Geocentric cartesian coordinates system"/>

(קרדיט [mak.com](https://ftp.mak.com/out/classdocs/vrlink5.2.1/hla1516e/vrl_coordinate_conversions.html))


#### יצוג מיקום במערכת 
ניקח את המיקום הבא, שמייצג את המיקום של מפרץ חיפה בגובה פני הים, ישראל, ביצוג מטרי:
- X `4393545.25898511`
- Y `3080024.99015086`
- Z `3436747.86996515`

#### יתרונות
* קל מאוד לחשב מרחקים (מי לא שמע על [פיתגורס](https://he.wikipedia.org/wiki/משפט_פיתגורס#מרחק_במרחב_האוקלידי)) ותנועה. (ללא התחשבות בכדוריות פני כדוה"א, כמובן).
* המיקומים מדויקים (ללא עיגול לטובה).
* ניתן לתאר בקלות מיקום בחלל החיצון.
#### חסרונות
* מאחר והמערכת מלבנית אבל אנו נעים על פני כדור בתוכו, אומדן מרחקים וכיוונים בין נקודות לא אינטואיטיבי למח האנושי.
 לדוגמה, צירי ה-X,Y ו-Z משתנים בתנועה צפונה על פני הכדור (=פני הים) למרות שבתחושתנו אנו נעים על ציר ה-Y בלבד.
### Geodetic polar
#### הרעיון
נתבונן על כדור הארץ, צורתו כצורת כדור. נפרוס עליו קווים - פעם לרוחב, פעם לאורך.

את קווי האורך `Longitude`נפרוס במרחק זויתי זה מזה כך שיהיה 11 מעלות. נפרוס אותם מהקוטב הצפוני לקוטב הדרומי, 
כאשר קו האורך החשוב הוא קו 0, אשר נקבע להיות קו מרידיאן. קו זה עובר בגריניץ', אנגליה.

המרחקים בין הקווים משתנים לפי המיקום על הקשת שנוצרת בגלל צורתו הכדורית של כדור הארץ.

את קווי הרוחב `Latitude`נפרוס ממזרח למערב ונקיף איתם את כדור הארץ. קו המשווה הוא קו 0, ושאר הקווים רצים עד 90 מעלות צפון או 90 מעלות דרום.

גובה `Altitude` הוא המרחק מפני הים.

הערכים הזוויתיים של קווי הרוחב/גובה הם לפי הזווית מנקודת ה-0 ולכן הם בד"כ במעלות או רדיאנים בבסיס עשרוני, 
אך ניתן (ומקובל) לתאר את המעלות גם בעזרת DMS (Degrees, Minutes, Seconds) שזה תיאור שברי המעלות בבסיס 60.

איור קווי רוחב\גובה על פני כדור הארץ:

<image-responsive class="center" imageURL="blog/earth-coordinates/fedstats_lat_long.png"  alt="Geographic lat lon coordinates"/>

(מתוך [wikipedia](https://en.wikipedia.org/wiki/Geographic_coordinate_system))

איור חלוקת פני כדור הארץ לזוויות:

<image-responsive class="center" imageURL="blog/earth-coordinates/full_earth_lat_lon.gif"  alt="Full earth lan lon angels"/>

[קרדיט](https://thesocialsciencesblogger.blogspot.com/2013/09/geographic-coordinates-quiz.html)


#### יצוג מיקום במערכת 
ניקח את המיקום הבא, שמייצג את המיקום של מפרץ חיפה בגובה פני הים, ישראל, ביצוג מעלות:
:
- Latitude `32.8103889`
- Longitude `35.0108669`
- Altitude `0`

כמובן ניתן לייצוג גם כ-DMS
<image-responsive class="center" imageURL="blog/earth-coordinates/dms.png"  alt="dms location"/>

ועכשיו כבר די מובן וברור לאן מוביל אותנו הקישור הבא של גוגל מפות:
`https://www.google.co.il/maps/place/32°48'37.4"N+35°00'47.0"E/`

המערכת, כמו שלא קשה להבין, היא קוטבית.

#### יתרונות
* קל להתמצא במרחקים ואיפה נמצאים ביחס למיקום אחר.
* המיקומים מדויקים ללא עיגול לטובה.
* רוב מוחלט של המפות ומערכות ה-GIS משתמשות במערכת זו.
#### חסרונות
* חישוב מרחקים ויחס בין נקודות (הפרש מרחק זווית תלוי בהיקף הכדור בגובה הנתון)

### UTM universal transverse Mercator
#### הרעיון
יצירת מערכת קרטזית ממחלוקת פני כדוה"א (למעט איזור הקטבים) ל-60 רצועות והשטחתם לתמונה דו-ממדית, כל פלח/רצועה 6.5 מעלות. (6 מעלות + חפיפה).

כך כל נ.צ. (=נקודת ציון, נקודה במפה) כוללת x,y,z ופלח.

בנוסף, מאחר ורוחב הרצועה שונה בהתאם למרחק מקו המשווה, גם הרצועה מחולקת לגבהים באותיות מ-C עד X (לא חייבים נתון זה, מאחר וניתן להסיק אותו מערך ציר ה-y).

איור חלוקת פני כדור הארץ לפלחים:

<image-responsive class="center" imageURL="blog/earth-coordinates/utm-zones-globe.png"  alt="Full earth lan lon angels"/>

[קרדיט](https://gisgeography.com/utm-universal-transverse-mercator-projection/)


איור מפת אפריקה ב-UTM:

(ניתן להבחין שישראל נמצאת באיזור `36S/R`)
<image-responsive class="center" imageURL="blog/earth-coordinates/africa-utm-zones.png"  alt="Full earth lan lon angels"/>

[קרדיט](https://commons.wikimedia.org/wiki/File:LA2-Africa-UTM-zones.png)

מאחר והקטבים מתעוותים לחלוטין ישנה מערכת משלימה שנקראת UPS.

#### יתרונות
* קל מאוד לחישוב וניתוח (כל עוד נמצאים באותו הפלח)
* קל מאוד להבנה של מרחקים ויחס לבני אדם.
* מתאים לניהול אזור מצומצם.
#### חסרונות
* מעוות את המציאות בצורה משמעותית.
* עבודה לא נוחה במעבר בין אזורים.


---
# נספח יישות במרחב

## Range vector (יחס בין נקודות)

#### Distance (מרחק)
המרחק בין שתי נקודות במרחב.

#### Elevation (הגבהה)
זווית ההגבהה בין שתי נקודות במרחב תלת ממדי.

#### Azimuth (אָזִימוּט)
זווית בציר האופקי (בדו ממדי) בין שתי נקודות במרחב הדו ממדי (גם במרחב תלת ממדי מתייחסים לזווית הדו ממדית)

איור להדגמת ההבדל בין זווית ה-`Elevation` לזווית ה-`Azimuth`:
<image-responsive class="center" imageURL="blog/earth-coordinates/azimuth_elevation.gif"  alt="Azimuth vs Elevation angle"/>

[קרדיט](http://www.ece.northwestern.edu/local-apps/matlabhelp/techdoc/visualize/chview3.html)

## Orientation (נטייה)
אוריינטציה הינה המנח של העצם ביחס לעולם (כלומר סיבוב ביחס לעצמו בשלושת הצירים).
 
אוריינטציה מורכבת מוקטור של yaw, pitch, roll.

חשוב להדגיש שנתון זה *שונה* מכיוון התנועה והכיוון במרחב.
למשל מטוס נוחת כשהנטייה שלו כלפי מעלה והכיוון שלו מן הסתם כלפי מטה.

#### heading \ yaw (סבסוב)

<image-responsive class="center" imageURL="blog/earth-coordinates/aileron_yaw.gif"  alt="Airplane yaw animation"/>

[קרדיט](https://commons.wikimedia.org/wiki/File:Aileron_yaw.gif)

#### Pitch (עילרוד)

<image-responsive class="center" imageURL="blog/earth-coordinates/aileron_pitch.gif"  alt="Airplane pitch animation"/>

[קרדיט](https://commons.wikimedia.org/wiki/File:Aileron_pitch.gif)

#### Roll (גלגול)

<image-responsive class="center" imageURL="blog/earth-coordinates/aileron_roll.gif"  alt="Airplane roll animation"/>

[קרדיט](https://commons.wikimedia.org/wiki/File:Aileron_roll.gif)

## Velocity (תנועה)

### תיאור תנועה באמצעות מהירות + כיוון 

##### Speed (מהירות)
מהירות מוחלטת בכל הצירים בערכי מרחק/זמן.

##### Course (כיוון)
כיוון תנועת הישות במרחב האופקי (דו ממדי) ביחס למערכת צירים נתונה, בערכי זווית.

##### Elevation (הגבהה)
כיוון ההגבהה של הישות במרחב (תלת ממדי) ביחס למערכת צירים נתונה, בערכי זווית.

### תיאור תנועה באמצעות המהירות בכל ציר
ידוע בשמו `Velocity vector`
מתאר יחידת מרחק / זמן עבור כל ציר בנפרד.

## סיכום
חשוב לציין כי התוכן במאמר נותן סקירה ראשונית על עולם הקואורידנטות ויצוגים על מפות.
תחום זה כולל המון מתמטיקה וידע אנושי שנצבר במשך שנים.
ובתקווה שמי שלא מכיר את עולם התוכן הזה, המאמר כן יתן פתח לעולם מדהים זה.

ונסיים באיור שלא יועד להיות קומי

<image-responsive class="center" imageURL="blog/earth-coordinates/earth_projections.jpg"  alt="Cool earth projection"/>

[ק-רדיט](https://www.reddit.com/r/coolguides/comments/bsjr8f/this_is_pretty_cool_guide_of_how_distorting_map/) (בחבחבח...)

---

Photo by <a href="https://burst.shopify.com/@matthew_henry?utm_campaign=photo_credit&amp;utm_content=Free+Hand+Points+On+Globe+Photo+%E2%80%94+High+Res+Pictures&amp;utm_medium=referral&amp;utm_source=credit">Matthew Henry</a> from <a href="https://burst.shopify.com/trip?utm_campaign=photo_credit&amp;utm_content=Free+Hand+Points+On+Globe+Photo+%E2%80%94+High+Res+Pictures&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>
