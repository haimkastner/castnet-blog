---
name: 'private-vpn-on-aws'
title: 'שירות VPN אישי ופרטי בענן של AWS'
year: 17 בינואר 2021
color: '#8e7964'
trans: 'private-vpn-on-aws'
id: 'private-vpn-on-aws'
description: מדריך הפעלת שרת VPN פרטי על גבי הענון של AWS, צעד אחר צעד.
---

🔐 במדריך הבא נלמד איך ליצור שרת 
VPN פרטי בענן של AWS 🔐

## מה זה בכלל VPN
בגדול הרעיון הוא לנתב את כל תעבורת הרשת דרך מחשב אחר (שרת ה-VPN) כך שמבחינת מקבל הבקשה שלנו המחשב ששלח את הבקשה זה שרת ה-VPN ומבחינת ספקית האינטרנט שלנו (וכל מי ש"יושב" עליה, כמו המדינה) אנחנו ניגשנו לשרת ה-VPN.



### למה זה טוב?
להרבה דברים, למשל התחברות לרשת פנימית של ארגון, ועוד.

אחת המטרות החשובות והמפורסמות זה ענייני פרטיות, ברגע שגולשים עם
 VPN 
הספקית ואיתה כל החברים שלהם יודעים רק שניגשתם 
ל-VPN 
אבל לא יודעים לאן באמת גלשתם. וגם לצד השני, האתר יודע שבאה אליו בקשה 
מה-VPN
 אבל לא יודע מי באמת שלח אותה.

#### נשים לב שבמחינת האתר, כל זה רק ברמת ה-IP (יענו ה"מספר טלפון" האינטרנטי שלכם) אבל אם מתחברים או מזדהים באמצעות פייסבוק וכו' האתר בהחלט ידע גם ידע מי אתם בלי קשר לכתובת ממנה באתם.

חשוב להבין 
ש-VPN
 זה לא איזה פתרון קסם לכל בעיות הפרטיות והמעקב ברשת אלא רק יוצר הפרדת תקשורת בין המחשב שלנו לבין השירות שמקבל את הבקשה.

אחרי שהבנו את העיקרון מאחורי ה VPN קל להבין כמה קריטי ששירות ה VPN יהיה אמין ובטוח ולא חינמי, כי שרת הVPN יודע גם מי ביקש את הבקשה וגם לאן זה הלך, משמע הוא יודע הכל, ואם אתם.ן המוצר זה הופך להיות בעיה גדולה.

אבל גם בבחירה בשירות בטוח ואמין, עדיין ישנם יתרונות מסוימים ביצירת שרת VPN פרטי.

השוואה קצרה של ספק VPN מול שרת VPN פרטי (שכמובת לא כוללת את כל האספקטים!)


- כתובות שירותי ה-VPN ידועים לכולם, ולכן גם הספקית\סינון\מדינה מבינים שאת.ה ניגש לשרת VPN ואולי יחלטו לחסום את התקשורת, וגם האתר אולי יחליט שהוא לא מעוניין לתת שירות למשתמשי VPN, אבל בשרת פרטי כתובת IP לא מזוהה כשירות VPN אלא ככתובת תמימה של AWS וסיכוי אפסי שיתחילו לחסום כתובות של AWS (ואם כן.. הבעיה האחרונה תהיה ה-VPN הקטן שלכם) , נכון גם לספק האינטרנט, וגם לאתר שאליו גולשים.
- בשרת פרטי הכתובת בשליטתך,  רוצה להחליף? תרים מכונה חדשה והופ, יש חדש.
- בשרת פרטי אין סיכוי שמישהו אחר יאסוף נתונים מהשרת, השרת הוא שלך ובשליטתך הבלעדית, כל עוד לא גונבים לך את המפתחות אליו כמובן 😄
- מבחינת עומסים, סיכוי מאוד נמוך לבעיות בשרת פרטי כי זה שרת שרק אתם מתחברים אליו, בשונה מספק VPN שייתכנו עומסים, אם כי שוב זה תלוי באמינות סםק ה VPN.
- עלות די דומה בס"כ אם כי בשרת פרטי העלות היא שעתית וניתן בכל רגע להוריד את השירות מהאוויר ולהפסיק לשלם.
- כשאת.ה היחיד שמשתמש בכתובת IP אין הגנת "רעש" כמו בספק VPN שעוד אלפי אחרים גולשים דרכו גם, ולכן ברגע שמישהו הבין מה ה-IP שלך ויודע לקשר אליו את הIP של ה VPN הוא יכול עקרונית ל"תשאל"  את האתר אם הכתובת הייתה שם (זה ממש סיזיפי, אבל אפשרי).
 
## יצירת שרת OpenVPN ב-AWS
החלטתם ללכת על שרת פרטי? אתם לא צריכים להיות אנשי Devops! זה קל ופשוט.

ראשית צריך ליצור (אם עדיין אין) חשבון ב-
[AWS](https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#)
(זה לא החשבון קניות ב Amazon הרגיל)

> חשוב מאוד לשים לב, מאוד מאוד מאוד מומלץ לשים סיסמה טובה ואימות דו שלבי, 
כי הכרטיס אשראי מוצמד לחשבון, 
ואם האקר מצליח להכנס לחשבון הוא יכול לעשות ככל העולה על רוחו 
ובפוטנציאל לבצע פעולות בעלות של אלפי דולרים לפני שבכלל אפשר לשים לב 
(וכן מומלץ גם להגדיר התראות בממשק כך ש-AWS ישלחו התראות בחריגה מסכום חיוב משוער מסוים)


אחרי שסיימנו את יצירת החשבון הגיע הזמן להרים את המכונה 💪

המדריך אמור להתאים גם ללא ידע מוקדם או הבנה במחשוב ענן ובכלל, אם כי ממליץ לקרוא את הטקסט ולהבין את הפעולות 
(וזה בכלל לא מסובך!)

ראשית נכנס ללשונית של השירותים ונבחר ב
EC2
שזה שירות הרצת מכונות וירטואליות עם גישה מהרשת
שזה בעצם בדיוק מה שאנחנו רוצים, מחשב בענן של AWS.

<image-responsive imageURL="blog/private-vpn-on-aws/1.jpeg" />

נבחר בחוות השרתים שבה אנו מעוניינים להתארח, מן הסתם נעדיף חוות שרתים שקרובה פיזית כך שהתקשורת שלנו לענן תהיה מהירה ככל האפשר.
<image-responsive imageURL="blog/private-vpn-on-aws/2.jpeg" />

אחרי שבחרנו את החוות שרתים שבה נרים את השרת, הגיע הזמן להרים אותו.
<image-responsive imageURL="blog/private-vpn-on-aws/3.jpeg" />

נבחר 
AMI
שזה בעצם אימייג'

(מה זה אימייג'? לצורך העניין זה מערכת הפעלה מוכנה לשימוש עם סט התקנות נדרשות מותקנות מראש)

נבחר בטאב
`AWS Marketplace`
ובחיפוש
`openvpn`

ו
`select`

(האימייג המוצג מוגבל ל-2 מכשירים במקביל ניתן גם לבחור עם 10 או 25 חיבורים מקבילים)
<image-responsive imageURL="blog/private-vpn-on-aws/4.jpeg" />

חשוב לשים לב ששימוש באימייג עולה כסף 
(פר שעה)
<b>נוסף</b> 
על החיוב הרגיל של AWS

ניתן להשתמש ב
AMI
ללא עלות נוספת (לבד מהחיוב הרגיל ל
AWS)
אבל זה דורש התעסקות עם התקנות
בסוף המדריך יש נספח איך
, לדעתי שווה את זה.

<image-responsive imageURL="blog/private-vpn-on-aws/5.jpeg" />

נבחר את סוג המכונה שאנחנו רוצים, לצורך הדוגמה וכנראה לשימוש אישי 
t2.micro 
בהחלט מספיק.

לא מספיק לכם? תמיד אפשר ליצור מחדש ולבחור מכונה חזקה יותר, רק שימו לב לחיובים
😏
<image-responsive imageURL="blog/private-vpn-on-aws/6.jpeg" />

בחלון הבא אין מה לשנות פשוט להמשיך עם ההגדרות הדיפולטיות
<image-responsive imageURL="blog/private-vpn-on-aws/7.jpeg" />

נרים את המכונה
<image-responsive imageURL="blog/private-vpn-on-aws/8.jpeg" />

ניצור מפתח לגישה למכונה 
(אפשר לבחור כמובן גם מפתח קיים, אם קיים)
חשוב מאוד להוריד ולשמוש את המפתח במקום שמור, זה המפתח גישה למכונה.

ו.. נעלה את המכונה לאוויר
<image-responsive imageURL="blog/private-vpn-on-aws/9.jpeg" />

נמתין ל
AWS
שיכינו את המכונה
<image-responsive imageURL="blog/private-vpn-on-aws/10.jpeg" />

והנה היא, נלחץ על הקישור
<image-responsive imageURL="blog/private-vpn-on-aws/11.jpeg" />

ניתן שם קריא ונאה למכונה החדשה
<image-responsive imageURL="blog/private-vpn-on-aws/12.jpeg" />


<!-- <image-responsive imageURL="blog/private-vpn-on-aws/13.jpeg" /> -->

נמתין עד שהמכונה תהיה מוכנה ונעתיק את הכתובת
IP
הציבורית של המכונה
<image-responsive imageURL="blog/private-vpn-on-aws/14.jpeg" />

נתקין 
[putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
על המחשב.

בסיום ההתקנה נחפש את התכנה 
`puttygen`
בכדי להמיר את הקובץ מפתח שהורדנו מפורמט
`pem`
לפורמט
`pkk`.

נפתח את התכנה, ונבחר ב
`conversions` -> `import key`
נבחר את קובץ ה
`pem`
שהורדנו מקודם.

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/15.jpeg" />

וניצור קובץ
pkk
<image-responsive class="center" class="center" imageURL="blog/private-vpn-on-aws/16.jpeg" />

נאשר
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/17.jpeg" />

והגיע הזמן להתחבר למכונה ב-
SSH

הפעם נחפש במחשב 
`putty`

ונזין את השם והכתובת
`openvpn@{the public ip}`

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/18.jpeg" />

בעץ התפריט נבחר
`connection` -> `SSH` -> `Auth`
ונטען את קובץ ה
`pkk`

ונלחץ על 
`open`
<image-responsive  class="center" imageURL="blog/private-vpn-on-aws/19.jpeg" />

נאשר את הסכם השימוש
`yes`
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/20.jpeg" />

ונקסט נקסט נקסט 
(מקש ה  `Enter`)

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/21.jpeg" />
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/22.jpeg" />

והשרת מוכן!
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/23.jpeg" />

נזין את הפקודות הבאות בכדי להגדיר סיסמה

```
sudo su
```
```
passwd openvpn
```

ונזין פעמיים את הסיסמה שאנו מעוניינים בה
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/24.jpeg" />

ניגש בדפדפן לכתובת הציבורית של השרת עם הפורט 
`943`

זה אמור להראות ככה
`https://{public ip}:943/admin`

בדפדפן תוצג שגיאה בגלל ששם המתחם לא אומת.
זה בסדר, ונשאיר את זה בצד כרגע
(אפשר כמובן לסדר את זה, אבל לא רלוונטי כרגע)

נבחר ב
`מתקדם`
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/25.jpeg" />

ונבחר להמשיך לאתר
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/26.jpeg" />

נזין את שם המשתמש
`openvpn`
ואת הסיסמה שיצרנו מקודם
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/27.jpeg" />

עוד משהו לאשר
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/28.jpeg" />

נלך ל
`vpn settings`
ונגדיר כמו בתמונה
ונשאר את השינויים
<image-responsive imageURL="blog/private-vpn-on-aws/29.jpeg" />

תקפוץ התראה בראש הדף
ונבחר לעדכן גם מה שרץ כרגע

עכשיו השרת מוגדר כהלכה 
🚀🚀🚀

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/31.jpeg" />

<br>
<br>
<br>


אם השרת לא בשימוש כדאי למחוק אותו, עולה 💲💲💲 להחזיק סתם באוויר.

<image-responsive imageURL="blog/private-vpn-on-aws/40.jpeg" />

<br>
<br>
<br>
<br>
<br>
<br>
<br>


## חיבור Windows לשרת ה-VPN
נזין שוב בשורת הכתובת הפעם בלי תוספת 
`admin`
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/30.jpeg" />

נזין שם משתמש וסיסמה כמו מקודם
ונבחר את הקליינט שנרצה להוריד

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/32.jpeg" />

אחרי ההורדה נתקין את התכנה 

ובסיום יופיע לנו האייקון בשלחן העבודה
 
 נלחץ עליו

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/33.jpeg" />

נצא מהטיפים (או שלא...)
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/34.jpeg" />

נאשר הכל

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/35.jpeg" />
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/36.jpeg" />

ונפעיל את החיבור

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/37.jpeg" />

נזין שם משתמש וסיסמה כמו מקודם

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/38.jpeg" />

ו.. הנה אנחנו גולשים כמו מאירלנד!!!

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/39.jpeg" />

<br>
<br>
<br>
<br>
<br>
<br>
<br>

## חיבור טלפון לשרת ה-VPN
וכמובן ה-
VPN
זמין גם מהטלפון, נלך ל
[Google Play](https://play.google.com/store/apps/details?id=net.openvpn.openvpn)
 (אפשר כמובן גם להוריד ידנית אם כי פחות מומלץ)

ונתקין את
`OpenVPN Connect`
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m1.jpg" />

נזין את כתובת ה
IP
הציבורית
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m2.jpg" />

נאשר
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m3.jpg" />

נזין את שם המשתמש והסיסמה
(אפשר גם לבחור שיתחבר אוטו'  אבל לא חובה)
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m4.jpg" />

נפעיל את החיבור
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m5.jpg" />

נאשר גישה לשינוי תעבורת הרשת
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m6.jpg" />

והכל מוכן
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m7.jpg" />

והנה שוב אנו באירלנד
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m8.jpg" />


<br>
<br>
<br>
<br>
<br>

## נספח
### התקנה ללא רכישת OpenVPN AMI

שימוש בAMI של 
OpenVPN
מהמרקטפלייס של AWS עולה כסף, 
ואפילו מעט יותר ממה שמשלמים לAWS עצמה על המכונה.

ניתן גם להתקין את 
OpenVPN 
על 
AMI
(אימייג')
רגיל, כך שהעלות תהיה רק על המכונה עצמה אבל זה דורש התקנה ידנית של 
OpenVPN

איך עושים את זה? זה קל.

בממשק של 
AWS
בוחרים 
AMI 
של דביאן
(נבדק על debian-stretch-hvm-x86_64-gp2-2019-04-27-83345)

<image-responsive  imageURL="blog/private-vpn-on-aws/g0.jpg" />


ב-Security Rules
נוודא שהפורטים הבאים פתוחים 
* TCP 443, 943, 945
* UDP 1194

<image-responsive  imageURL="blog/private-vpn-on-aws/g1.jpg" />

מתחברים ב-SSH 
(עם שם המשתמש admin ומפתח pkk בדיוק כמו מקודם)

ומתחילים את ההתקנה עצמה

עדכון המערכת
```
sudo apt update
```

התקנת כלי רשת
```
sudo apt install net-tools
```

הורדת 
OpenVPN
```
curl -O http://swupdate.openvpn.org/as/openvpn-as-2.5.2-Debian9.amd_64.deb
```

התקנת 
OpenVPN
```
sudo dpkg -i openvpn-as-2.5.2-Debian9.amd_64.deb
```

הרצת 
OpenVPN
```
sudo /usr/local/openvpn_as/bin/ovpn-init
```

ואם נדרש למחוק קינפוג קיים אז להזין 
`DELETE`


ומכאן בדיוק כמו מקודם 
(רק ביותר זול 😉)


<br>
<br>

----

Photo by <a href="https://burst.shopify.com/@ndekhors?utm_campaign=photo_credit&amp;utm_content=Free+Stock+Photo+of+Computer+Security+Lock+And+Payment+%E2%80%94+HD+Images&amp;utm_medium=referral&amp;utm_source=credit">Nicole De Khors</a> from <a href="https://burst.shopify.com/technology?utm_campaign=photo_credit&amp;utm_content=Free+Stock+Photo+of+Computer+Security+Lock+And+Payment+%E2%80%94+HD+Images&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>