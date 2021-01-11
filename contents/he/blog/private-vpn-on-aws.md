---
name: 'private-vpn-on-aws'
title: 'שירות VPN אישי ופרטי בענן של AWS'
year: 10 בינואר 2021
color: '#8e7964'
trans: 'private-vpn-on-aws'
id: 'private-vpn-on-aws'
description:  מדריך הפעלת VPN פרטי על גבי ענן AWS צעד אחר צעד
---

ראשית צריך ליצור (אם עדיין אין...) חשבון ב-
[AWS](https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#)
(זה לא החשבון קניות ב Amazon הרגיל)

חשוב מאוד לשים לב, מאוד מאוד מאוד מומלץ לשים סיסמה טובה ואימות דו שלבי, 
כי הכרטיס אשראי מוצמד לחשבון, 
ואם האקר מצליח להכנס לחשבון הוא יכול לעשות ככל העולה על רוחו 
ובפוטנציאל לבצע פעולות בעלות של אלפי דולרים לפני שבכלל אפשר לשים לב 
(וכן מומלץ גם להגדיר התראות במששק כל שישלחו התראות בחריגה מסכום חיוב משוער מסוים)


אחרי שסיימנו את יצירת החשבון הגיע הזמן להרים את המכונה!

המדריך אמור להתאים גם ללא ידע מוקדם או הבנה במחשוב ענן ובכלל, אם כי ממליץ לקרוא את הטקסט ולהבין את הפעולות 
(וזה בכלל לא מסובך!)

ראשית נכנס ללשונית של השירותים ונבחר ב
EC2
שזה שירות הרצת מכונות וירטואליות עם גישה מהרשת
שזה בעצם בדיוק מה שאנחנו רוצים, מחשב בענן של אמאזון.

<image-responsive imageURL="blog/private-vpn-on-aws/1.jpeg" />

נבחר בחוות השרתים שבה אנו מעוניינים להתארח, מן הסתם נעדיף חוות שרתים שקרובה פיזית כך שהתקשורת שלנו לענן תהיה מהירה ככל האפשר.
<image-responsive imageURL="blog/private-vpn-on-aws/2.jpeg" />

אחרי שבחרנו את החוות שרתים שבה נרים את השרת, הגיע הזמן להרים אותו.
<image-responsive imageURL="blog/private-vpn-on-aws/3.jpeg" />

נבחר 
AMI
שזה בעצם אימייג'

(מה זה אימייג? לצורך העניין זה מערכת הפעלה מוכנה לשימוש עם סט התקנות נדרשות מותקנות מראש)

נבחר בטאב
AWS Marketplace
ובחיפוש
openvpn

ו
select

(האימייג המוצג מוגבל ל-2 מכשירים במקביל ניתן גם לבחור עם 10 או 25 חיבורים מקבילים)
<image-responsive imageURL="blog/private-vpn-on-aws/4.jpeg" />

חשוב לשים לב ששימוש באימייג עולה כסף 
(פר שעה)
*נוסף* 
על החיוב הרגיל של AWS

ניתן להשתמש ב
AMI
ללא עלות נוספת (לבד מהחיוב הרגיל ל
AWS)
אבל זה דורש התעסקות עם התקנות
בסוף המדריך יש נספח, לדעתי שווה את זה.

<image-responsive imageURL="blog/private-vpn-on-aws/5.jpeg" />

נבחר את סוג המכונה שאנחנו רוצים, לצורך הדוגמה וכנראה לשימוש אישי 
t2.micro 
בהחלט מספיק
לא מספיק לכם? תמיד אפשר ליצור מחדש ולבחור מכונה חזקה יותר, רק שימו לב לחיובים
:)
<image-responsive imageURL="blog/private-vpn-on-aws/6.jpeg" />

כאן אין מה לשנות פשוט להמשיך עם ההגדרות הדיפולטיות
<image-responsive imageURL="blog/private-vpn-on-aws/7.jpeg" />

נרים את המכונה
<image-responsive imageURL="blog/private-vpn-on-aws/8.jpeg" />

ניצור מפתח לגישה למכונה 
(אפשר לבחור כמובן גם מפתח קיים, אם קיים)
חשוב מאוד להוריד ולשמוש את המפתח במקום שמור, זה המפתח גישה למכונה.

ו.. נרים את המכונה
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
על המחשב

בסיום ההתקנה נחפש את התכנה 
puttygen
בכדי להמיר את הקובץ מפתח שהורדנו מפורמט
pem
לפורמט
pkk

נפתח את התכנה, ונבחר ב
conversions -> import key
נבחר את קובץ ה
pem
שהורדנו מקודם

<image-responsive imageURL="blog/private-vpn-on-aws/15.jpeg" />

וניצור קובץ
pkk
<image-responsive imageURL="blog/private-vpn-on-aws/16.jpeg" />

נאשר
<image-responsive imageURL="blog/private-vpn-on-aws/17.jpeg" />

והגיע הזמן להתחבר למכונה ב-
SSH

הפעם נחפש במחשב 
putty

ונזין את השם והכתובת
`openvpn@{the public ip}`

<image-responsive imageURL="blog/private-vpn-on-aws/18.jpeg" />

בעץ התפריט נבחר
connection -> SSH -> Auth
ונטען את קובץ ה
pkk

ונלחץ על 
open
<image-responsive imageURL="blog/private-vpn-on-aws/19.jpeg" />

נאשר את הסכם השימוש
`yes`
<image-responsive imageURL="blog/private-vpn-on-aws/20.jpeg" />

ונקסט נקסט נקסט 
(מקש ה  `Enter`)

<image-responsive imageURL="blog/private-vpn-on-aws/21.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/22.jpeg" />

והשרת מוכן!
<image-responsive imageURL="blog/private-vpn-on-aws/23.jpeg" />

נזין את הפקודות הבאות בכדי להגדיר סיסמה

```sudo su
```
```
passwd openvpn
```

ונזין פעמיים את הסיסמה שאנו מעוניינים בה
<image-responsive imageURL="blog/private-vpn-on-aws/24.jpeg" />

ניגש בדפדפן לכתובת הציבורית של השרת עם הפורט 
`943`

זה אמור להראות ככה
`https://{public ip}:943/admin`

בדפדפן תוצג שגיאה בגלל ששם המתחם לא אומת.
זה בסדר, ונשאיר את זה בצד כרגע
(אפשר כמובן לסדר את זה, אבל לא רלוונטי כרגע)

נבחר ב
`מתקדם`
<image-responsive imageURL="blog/private-vpn-on-aws/25.jpeg" />

ונבחר להמשיך לאתר
<image-responsive imageURL="blog/private-vpn-on-aws/26.jpeg" />

נזין את שם המשתמש
`openvpn`
ואת הסיסמה שיצרנו מקודם
<image-responsive imageURL="blog/private-vpn-on-aws/27.jpeg" />

עוד משהו לאשר
<image-responsive imageURL="blog/private-vpn-on-aws/28.jpeg" />

נלך ל
`vpn settings`
ונגדיר כמו בתמונה
ונשאר את השינויים
<image-responsive imageURL="blog/private-vpn-on-aws/29.jpeg" />

תקפוץ התראה בראש הדף
ונבחר לעדכן גם מה שרץ כרגע

עכשיו השרת מוגדר כהלכה
<image-responsive imageURL="blog/private-vpn-on-aws/31.jpeg" />

עכשיו נזין שוב בשורת הכתובת הפעם בלי תוספת 
`admin`
<image-responsive imageURL="blog/private-vpn-on-aws/30.jpeg" />

נזין שם משתמש וסיסמה כמו מקודם
ונבחר את הקליינט שנרצה להוריד

 לצורך ההמחשה נוריד את של חלונות
<image-responsive imageURL="blog/private-vpn-on-aws/32.jpeg" />

אחרי ההורדה נתקין את התכנה 

ובסיום יופיע לנו האייקון בשלחן העבודה
 
 נלחץ עליו

<image-responsive imageURL="blog/private-vpn-on-aws/33.jpeg" />

נצא מהטיפים (או שלא...)
<image-responsive imageURL="blog/private-vpn-on-aws/34.jpeg" />

נאשר הכל

<image-responsive imageURL="blog/private-vpn-on-aws/35.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/36.jpeg" />

ונפעיל את החיבור

<image-responsive imageURL="blog/private-vpn-on-aws/37.jpeg" />

נזין שם משתמש וסיסמה כמו מקודם

<image-responsive imageURL="blog/private-vpn-on-aws/38.jpeg" />

ו.. הנה אנחנו גולשים כמו מאירלנד!!!

<image-responsive imageURL="blog/private-vpn-on-aws/39.jpeg" />

אם השרת לא בשימוש כדאי לכבות או למחוק אותו, זה עולה כסף להחזיק סתם באוויר.

<image-responsive imageURL="blog/private-vpn-on-aws/40.jpeg" />


וכמובן ה-
VPN
זמין גם מהטלפון, נלך לגוגל פליי (אפשר כמובן גם להוריד ידנית אם כי פחות מומלץ)

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
ואפילו יותר ממה שמשלמים לאמאזון עצמה על המכונה.

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


<br>
<br>

----

Photo by <a href="https://burst.shopify.com/@ndekhors?utm_campaign=photo_credit&amp;utm_content=Browse+Free+HD+Images+of+Key+To+Padlock+In+Hand&amp;utm_medium=referral&amp;utm_source=credit">Nicole De Khors</a> from <a href="https://burst.shopify.com/api-home-furniture?utm_campaign=photo_credit&amp;utm_content=Browse+Free+HD+Images+of+Key+To+Padlock+In+Hand&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>