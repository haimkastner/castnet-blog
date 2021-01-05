---
name: 'photoprism-on-rsp'
title: 'PhotoPrism + Raspberry PI שרת תמונות ביתי בגרושים'
year: 5 בינואר 2021
color: '#8e7964'
id: 'photoprism-on-rsp'
description:  סקירה והוראות התקנה לאלטרנטיבה לגוגל תמונות, מאובטחת, בקוד פתוח ובשליטה אישית מלאה. חלק ב'
---

לאחר שהתוודענו לפרויקט הקוד-פתוח המופלא של
 [PhotoPrism](https://photoprism.app/)
 
> לא קראתם עדיין? [PhotoPrism: אלטרנטיבת קוד פתוח לגוגל תמונות חלק א'](/blog/google-photos-alternative)

עכשיו הגיע הזמן להכין שרת תמונות ומדיה ייעודי משלנו בגרושים, אז איך עושים את זה?


מצרכים:

* Raspberry PI 3/4 (את המדריך בדקתי על Raspberry Pi 4 B 8GB), אישית קניתי קיט
 [בפייטל](https://piitel.co.il/shop/starter-pi48gb/)
 , נתנו אחלה שירות, אבל כמובן אפשר לקנות גם באליאקספרס אמזון או בכל מקום שתרצו
* דיסק קשיח\כונן אחסון חיצוני עם יציאת USB, אפשר גם לנצל דיסק קשיח ישן שבטח שוכב איפשהו בבית ולקנות מתאם SATA USB 
[כזה למשל](https://www.aliexpress.com/item/4001245354293.html)


ו..זהו!

## אז מה זה Raspberry PI?


בקצרה מחשב קטן (ולא רע!) שמריץ לינוקס ומיועד לשימושים ביתיים (בעיקר ל-IoT אך לא רק)

מי שלא מכיר, ממליץ לקרוא את 
[סדרת המדריכים](https://internet-israel.com/category/%d7%9e%d7%93%d7%a8%d7%99%d7%9b%d7%99%d7%9d/raspberrypi/)
 של רן בר זיק על Raspberry PI. 
 

במדריך הבא, אני אנסה להסביר גם למי שלא מכיר את העולם של לינוקס ו\או כלי פיתוח, איך להתקין את PhotoPrism, ולהגדיר אותו כך שישמור את התמונות על הדיסק הקשיח. גם פה אשתדל לא לבלבל במוח על מונחים טכניים :)


## התקנת הסביבה

דבר ראשון נוריד את האימייג' המתאים של raspbian 
[מכאן](https://www.raspberrypi.org/software/operating-systems/#raspberry-pi-desktop)

אחרי שההורדה הסתיימה נחלץ את קובץ ה-IMG ו"נצרוב" אותו על הכרטיס.

> לא יודעים איך? 
[התקנה והפעלה של רספברי פיי](https://internet-israel.com/%d7%9e%d7%93%d7%a8%d7%99%d7%9b%d7%99%d7%9d/raspberrypi/%d7%94%d7%aa%d7%a7%d7%a0%d7%94-%d7%95%d7%94%d7%a4%d7%a2%d7%9c%d7%94-%d7%a9%d7%9c-%d7%a8%d7%a1%d7%a4%d7%91%d7%a8%d7%99-%d7%a4%d7%99%d7%99/)

*חשוב מאוד* 
אחרי סיום ההעתקה של האימייג' לכרטיס לפני שמוציאים את הכרטיס מהמחשב, 
 להיכנס לכונן של הכרטיס (נמצא במחשב שלי), וליצור קובץ ריק בשם 
`ssh` 
(פותח את ה-SSH בלי צורך לפתוח ידנית)

ובנוסף יש להכנס לקובץ `config.txt`
ושם להוסיף את השורה הבאה:
```
arm_64bit=1
``` 

ככה זה נראה:

<image-responsive class="center" imageURL="blog/photoprism-on-rsp/p1.jpg" />

אחרי שסיימנו עם הכנת הכרטיס, נכניס את הכרטיס ונפעיל את הרספברי.

נתחבר לרספברי בעזרת [Putty](https://www.putty.org/)
(ממליץ להתקין גם
[WinSCP](https://winscp.net/eng/download.php)
 ככה נוח הרבה יותר לערוך ולהעתיק קבצים מ\אל המחשב)

אחרי שהתחברנו ב-ssh

(או אם מחוברים לרספברי דסקטופ פשוט לפתוח חלון טרמינל)

> לא יודעים איך?
[התחברות לרספברי פיי מרחוק](https://internet-israel.com/%d7%9e%d7%93%d7%a8%d7%99%d7%9b%d7%99%d7%9d/raspberrypi/%d7%94%d7%aa%d7%97%d7%91%d7%a8%d7%95%d7%aa-%d7%9c%d7%a8%d7%a1%d7%a4%d7%91%d7%a8%d7%99-%d7%a4%d7%99%d7%99-%d7%9e%d7%a8%d7%97%d7%95%d7%a7/) ו 
[התחברות לרספברי פיי מרחוק עם SSH](https://internet-israel.com/%d7%9e%d7%93%d7%a8%d7%99%d7%9b%d7%99%d7%9d/raspberrypi/%d7%94%d7%aa%d7%97%d7%91%d7%a8%d7%95%d7%aa-%d7%9c%d7%a8%d7%a1%d7%a4%d7%91%d7%a8%d7%99-%d7%a4%d7%99%d7%99-%d7%9e%d7%a8%d7%97%d7%95%d7%a7-%d7%a2%d7%9d-ssh/)

נסדר את אזור הזמן
```sh
sudo raspi-config
```
ושם 
`Localisation Options` -> `Timezone` -> `Asia` -> `Jerusalem`


## התקנת כלים

עכשיו הגיע הזמן להתחיל עם ההתקנות

דבר ראשון צריך שיהיה מותקן כלי שנקרא דוקר, בשביל זה
נריץ את הפקודות הבאות:

```sh
curl -fsSL https://get.docker.com -o get-docker.sh
```

```sh
sudo sh get-docker.sh
```

אחרי שההתקנה של Docker הסתיימה
נתקין Docker-compose

```sh
sudo curl -L --fail https://raw.githubusercontent.com/linuxserver/docker-docker-compose/master/run.sh -o /usr/local/bin/docker-compose
```
```sh
sudo chmod +x /usr/local/bin/docker-compose
```
## הורדת והפעלת PhotoPrism

ניצור תיקיה ונכנס אליה באמצעות הפקודות
```
mkdir photoprism
```
```
cd photoprism
```

 נוריד את קובץ ההגדרה של PhotoPrism למעבדי ARM

```
wget https://dl.photoprism.org/docker/arm64/docker-compose.yml
```

ו… נפעיל את (הקונטיינרים של) PhotoPrism

```
sudo docker-compose up -d
```

ברגע שההורדה וההפעלה מסתיימת
נלך לדפדפן במחשב שלנו ונזין בשורת הכתובת:
[`http://raspberrypi:2342`](http://raspberrypi:2342)

או אם נמצאים ברספברי עצמו אז [`http://localhost:2342`](http://localhost:2342)

עובד? מעולה 🚀

### הגדרת אחסון חיצוני

עכשיו אנחנו רוצים להגדיר את הדיסק קשיח שישמש בתור האחסון של המדיה.
חשוב לשים לב שחיבור אחסון חיצוני בלינוקס שונה ממה שרגילים ב-Windows,
בלינוקס אחרי שמחברים התקן האחסון (לא משנה איזה) צריך להגדיר "הצמדה" של תיקיה שדרכה ניגש לאחסון.

נשמע מורכב? זה ממש ממש פשוט.

נעצור את ההרצה של PhotoPrism באמצעות הפקודה
```sh
sudo docker-compose stop photoprism
```
נחבר את הדיסק קשיח פיזית ליציאה של ה-USB.

אחרי שחיברנו אנחנו צריכים לדעת מה המזהה היחודי (UUID) של הדיסק הקשיח.

נריץ את הפקודה

```
sudo lsblk -f
```

ונחפש את הUUID של הדיסק שלנו, למשל פה:
(חשוב לשים לב גם לFSTYPE נצטרך גם את זה)

<image-responsive class="center" imageURL="blog/photoprism-on-rsp/p2.jpg" />

ניצור תיקיה תחת מדיה עבור האחסון שלנו

```
sudo mkdir /media/storage
```

נערוך את הקובץ הבא (לא חייבים עם nano אפשר בכל עורך טקסט שנראה לכם לנכון)

```
sudo nano /etc/fstab
```

נרד עם המקלדת (בעזרת לחצני החצים) עד סוף הקובץ

ונוסיף למטה שורה חדשה עם התוכן הבא

- השורה הבאה מתאימה לדיסק שלי מהדוגמה, 
חשוב לשים לב שה-ntfs מגיע
מהשדה FSTYPE ממקודם 
וכמובן לשים את ה-UUID המתאים.

```
UUID=5CF286C7F286A4BC /media/storage   ntfs     defaults    0   0
```

נשמור את השינויים
בעזרת לחיצה על קונטרול + X ואז Y.

"נצמיד"
 את הדיסק באמצעות הפקודה

```
sudo mount -a
```

אם אין שגיאות, הדיסק הקשיח הוגדר כהלכה.

 ניצור תיקיה בכונן החדש לאחסון כל הקבצים
```
mkdir /media/storage/photoprism
```

 נערוך את הקובץ ההגדרה של PhotoPrism, כדי להגדיר את נתיב הקבצים, (וגם כדי לשנות סיסמאות ברירת מחדל, חשוב מאוד!)

גם כאן, לא חייבים nano 
אפשר באמצעות כל עורך טקסט שקיים ברספברי או 
ב-winSCP 
באמצעות לחיצה פעמיים על הקובץ

קובץ ההגדרה נקרא 
`docker-compose.yml` 
והוא נמצא בתיקיה
`photoprism`
 שיצרנו מקודם

אם משתמשים בnano נכתוב את הפקודה
```
nano docker-compose.yml
```

בקובץ נערוך את השורות הבאות:

<image-responsive class="center" imageURL="blog/photoprism-on-rsp/p3.jpg" />

אחרי שסיימנו לערוך, נשמור (
  ב-nano
   זה קונטרול X ואז Y)

נריץ מחדש
```
sudo docker-compose up -d
```
נתחבר שוב בדפדפן הפעם עם הסיסמה החדשה

ו.. הכל מוכן! 💪💪💪

<br>
<br>


---

<br>

#### כמה טיפים

 אם רוצים להוסיף כמות עצומה של תמונות מומלץ להעתיק את הקבצים ידנית 
לתיקיה 
`/media/storage/photoprism/Pictures`

אפשר גם להעתיק ע"י חיבור הדיסק הקשיח למחשב רגיל  
לדוגמה אם האות כונן זה
 G
אז להעתיק ל `G:/photoprism/Pictures` 
ובסיום ההעתקה לחבר חזרה לרספברי 


ולהריץ שוב `sudo mount -a` (או לאתחל, גם טוב).

ולהגדיר ל-PhotoPrism
 לאנדקס מחדש את כל הקבצים 

[`http://raspberrypi:2342/settings/library`](http://raspberrypi:2342/settings/library)

אפשר גם להרים שירות סמבה לשיתוף קבצים ברשת המקומית אבל זה כבר מורכב יותר (לא באמת... רק לא רציתי לחרוג מהנושא 🤓) 

<br>
<br>


חשוב גם לשים לב שאינדוקס וסיווג של עשרות אלפי קבצים במכה יכול לקחת המון זמן (ימים) 
ניתן לכבות את הסיווג ולהשתמש בזה רק כספרייה נוחה אבל ללא סיווג תמונות, ניתן כאן לראות את האופציות:

[`http://raspberrypi:2342/settings/advanced`](http://raspberrypi:2342/settings/advanced)

ושם `Disable TensorFlow`


> בהצלחה!

<br>

ולמי שהגיע עד לפה… בטח תשמחו מאוד מאוד לשמוע שאחרי בקשות של רבים רבים (= אף אחד) הוספתי לממשק תמיכה בשפת הקודש *כולל* יישור מלא לימין 😎

<image-responsive  imageURL="blog/photoprism-on-rsp/p4.jpg" />


<br>
<br>

----

Photo by <a href="https://burst.shopify.com/@sbk_lahn_food_photo?utm_campaign=photo_credit&amp;utm_content=Browse+Free+HD+Images+of+Top+View+Of+Raspberries+Chocolate+And+Mint+In+White+Dish&amp;utm_medium=referral&amp;utm_source=credit">Sheila Pedraza Burk</a> from <a href="https://burst.shopify.com/api-food-drink?utm_campaign=photo_credit&amp;utm_content=Browse+Free+HD+Images+of+Top+View+Of+Raspberries+Chocolate+And+Mint+In+White+Dish&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>