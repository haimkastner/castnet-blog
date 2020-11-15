---
name: 'google-photos-alternative'
title: 'PhotoPrism: אלטרנטיבת קוד פתוח לגוגל תמונות'
year: 15 בנובמבר 2020
color: '#8e7964'
id: 'google-photos-alternative'
description: סקירה והוראות התקנה לאלטרנטיבה לגוגל תמונות, מאובטחת בקוד פתוח ובשליטה אישית מלאה
---

כמו כולם, גם אני קיבלתי את המייל של גוגל על כך שהמסיבה של העלאת תמונות וסרטונים ללא הגבלה הולכת להסתיים ([https://photos.google.com/storagepolicy](https://photos.google.com/storagepolicy)), והאמת, חוץ מזה שזה כמובן לגמרי זכותם, זה הרגיש לי כמו מלכודת דבש די צפויה שכמו כולם גם אני נפלתי בה, אבל חשבתי שזה הזדמנות טובה להפסיק לתת את <b>כל</b> התמונות והסרטונים האישיים ביותר שלי לשליטת חברה מסחרית ולהתחיל לנהל ולאחסן את התמונות שלי, בעצמי בבעלותי ובשליטתי המלאה.


## אז מה מחפשים

מערכת קוד פתוח שתאפשר לנהל לצפות לסווג לתייג ולחפש בתמונות, עם חווית משתמש (UI\UX) טובה, <b>קלה לגיבוי</b>, ועם עדיפות ליכולת סנכרון אוטומטי של תמונות מהטלפון. 

אחרי קצת חיפושים (בגוגל 😊…) מצאתי פרויקט קוד פתוח מדהים שעושה בדיוק את זה, ובצורה מעולה,  הפרוייקט  [PhotoPrism](https://docs.photoprism.org/) הנפלא מאפשר את כל מה שחיפשתי++, אמנם סיווג וניתוח התמונות לא ברמה של גוגל תמונות והסנכרון האוטומטי עדיין בשלבי פיתוח, אבל היי זה באמת *בחינם* חופשי לשימוש ורץ על מחשב ישן שלי אז… ברור מה עדיף.

ממליץ מאוד אם יש לכם חשבון בGitHub לתת להם כוכב, וגם לתרום להם קוד, זה נראה פרויקט 🔥 שעתידו עוד לפניו.

## איך מתקינים

אם אתם.ן מפתחי תכנה או א.נשים טכניים זה אמור להיות קלי קלות להרצה על Windows \ Linux, פשוט להתקין Docker ו-Docker Compose ולעקוב אחרי ההוראות בדוקומנטציה של 
[PhotoPrism](https://docs.photoprism.org/getting-started/docker-compose).

אגב על מכונות שאינם x86 כמו Raspberry PI  אין תמיכה out of the box בהתקנה של docker compose, ממליץ להשתמש בפרוייקט הזה [linuxserver/docker-compose](https://hub.docker.com/r/linuxserver/docker-compose).
 


אבל! גם אם אתם לא באים מעולם המחשוב זה לא אומר שאתם לא יכולים להנות מהפרויקט הזה, לנהל ולשלוט במידע ובתמונות שלכם בעצמכם, במדריך הבא אני אשתדל להסביר בצורה פשוטה  (ובלי יותר מדי הסברים מתישים על הכלים… רק להביא לינקים להסבר על מונחים שונים למי שמעוניין) איך להתקין ולהתחבר למערכת על גבי 10 Windows.



## אז מה צריכים
מחשב עם Windows 10 מעודכן (המדריך נעשה על Windows 10 Pro מעודכן נכון ל 15.11.2020) אפשר וגם רצוי להקדיש לזה מחשב ישן ועזוב, רק כדאי לוודא שהוא עומד בהמלצת המינימום של 4 ג'יגה ראם, ו-2 ליבות.

וכמובן כונן קשיח לאחסון כל התמונות והסרטונים, ממליץ בחום להשתמש דווקא ב-HDD (מה שנקרא דיסק קשיח מכני) ולא ב-SSD 
(מה זה HDD ו-SSD [ויקיפדיה](https://he.wikipedia.org/wiki/Solid_state_drive#SSD_%D7%9C%D7%A2%D7%95%D7%9E%D7%AA_%D7%9B%D7%95%D7%A0%D7%9F_%D7%9E%D7%92%D7%A0%D7%98%D7%99)) 
גם בגלל המחיר וגם בגלל האמינות לאורך זמן, 
וכמובן גם כונן *נוסף* בתור גיבוי, תזכרו, אתם המנהלים והבעלים של המידע, חשוב ביותר לגבות, כי אף אחד לא יעשה את זה בשבילכם, 
 מומלץ גם בנוסף כונן חיצוני לגיבוי
 Offline  שעוזר במקרה של כופרה וירוסים שונים ומשונים בעיות חשמל וכו'.    


## התקנה


ראשית יש להתקין כלי שנקרא Docker, נלך ל   [docker-ce-desktop-windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows/)

 ונוריד את Docker


<image-responsive class="center" imageURL="blog/google-photos-alternative/1.2.png" />


אחרי שההורדה הסתיימה, נפעיל את התוכנה, נאשר את ההגדרות הדיפולטיות, ונמתין לסיום התהליך.

אחרי שההתקנה הסתיימה נתבקש לעשות אתחול למחשב.

אחרי האתחול, נראה שנוסף האייקון חדש של Docker במגירת היישומים.




אם לא מותקן אצלכם (וכנראה שלא..) WSL 2 

(מה זה WSL?  [כמה מילים על WSL 2](https://linvirtstor.net/2019/05/09/%D7%9B%D7%9E%D7%94-%D7%9E%D7%99%D7%9C%D7%99%D7%9D-%D7%A2%D7%9C-wsl-2/) )


האייקון של הלווייתן אמור להיות בצבע אדום, ואתם אמורים לקבל הודעה כזו:

<image-responsive class="center" imageURL="blog/google-photos-alternative/1.png" />

כדי להתקין את ה-WSL 2:
נחפש בתיבת החיפוש של חלונות PowerShell ונפעיל אותה כמנהל (חשוב!) 

<image-responsive class="center" imageURL="blog/google-photos-alternative/1.1.png" />

בחלון שנפתח נעתיק את השורה הבאה:

```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```


ונקיש ENTER.

נעתיק את השורה הבאה:

```
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```


ושוב נקיש ENTER.

נוריד את התוכנה הבאה: [wsl_update_x64.msi](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

(ההוראות מתוך הבלוג של מיקרוסופט [wsl/install-win10](https://docs.microsoft.com/en-us/windows/wsl/install-win10))

אחרי שסיימנו את ההתקנה של WSL 2 

נלך לאייקון של הלוויתן האדום, לחצן ימני של העכבר ונבחר בrestart.

שוב נקבל את ההודעה שראינו, אבל הפעם נבחר restart.
<image-responsive class="center" imageURL="blog/google-photos-alternative/2.png" />


נמתין מספר שניות עד שנקבל הודעה `docker desktop is running`

עכשיו צריך לסדר את משתנה הסביבה Path כך שנוכל לגשת ל-Docker מכל מקום.
לחיצה ימנית על אייקון `המחשב שלי` בסייר הקבצים, בחירה ב`תכונות` (האחרון ברשימה) 

ואז `הגדרות מערכת מתקדמות` (מיקרוסופט שינו את הממשק הזה לאחרונה, רק תחפשו את זה איפשהו בדף)
בחלון שנפתח  נבחר ב`משתני סביבה`.

<image-responsive class="center" imageURL="blog/google-photos-alternative/3.png" />


בחלון שנפתח בטבלה התחתונה נבחר ב Path ונלחץ על `ערוך`.

<image-responsive class="center" imageURL="blog/google-photos-alternative/4.png" />


בחלון שנפתח נבחר `חדש` ולשורה החדשה נעתיק  `C:\Program Files\Docker\Docker` ונבחר אישור

<image-responsive class="center" imageURL="blog/google-photos-alternative/5.png" />


זהו סיימנו עם ההתקנות של הכלים השונים.

עכשיו להתקנה של PhotoPrism.

יצור תיקיה חדשה בכונן C
נקרא לה `PhotoPrism`

נוריד את הקובץ הבא [מכאן](https://dl.photoprism.org/docker/docker-compose.yml)

ונעתיק אותו ל `C:/PhotoPrism`.

(חשוב לוודא שההורדה לא הוסיפה לו סיומת TXT ואם כן למחוק אותה ולוודא שהשם של הקובץ הוא `docker-compose.yml` ראה
[שינוי סיומת קובץ](https://helpdesk.flexradio.com/hc/en-us/articles/204676189-How-to-change-a-File-Extension-in-Windows)) 

עכשיו נלך לשורת הכתובת בסייר הקבצים (תוך כדי שאנחנו בתיקייה `C:/PhotoPrism` !) נדרוס את הכתובת ונכתוב שם `cmd` ונקיש ENTER.

<image-responsive class="center" imageURL="blog/google-photos-alternative/6.png" />


בחלון שורת הפקודה שנפתח נכתוב `docker-compose up -d`  ונקיש ENTER.

<image-responsive class="center" imageURL="blog/google-photos-alternative/7.png" />


נמתין לתהליך ההורדה שלוקח כמה שניות, 

<image-responsive class="center" imageURL="blog/google-photos-alternative/8.png" />


אם קופץ חלון של ה Firewall (חומת האש) של חלונות, צריך לאפשר לתוכנה גישה לרשת.

<image-responsive class="center" imageURL="blog/google-photos-alternative/9.png" />


נמתין עד שנקבל הודעה בחלון שורת הפקודה שההפעלה הסתיימה.

<image-responsive class="center" imageURL="blog/google-photos-alternative/10.png" />


נפתח בדפדפן את הדף  [http://localhost:2342/](http://localhost:2342/) ובסיסמה נכניס `please-change`. 

זהו סיימנו!


בכדי לשנות את ההגדרות של המערכת כמו למשל מיקום הקבצים והאינדקסים צריך דבר ראשון להוריד את המערכת, על ידי כניסה לחלון שורת הפקודה בדיוק כמו מקודם, ואז להעתיק את השורה הבאה 
`docker-compose stop photoprism` ו-ENTER.

(אגב בשלב זה אפשר גם לעדכן את התוכנה, אם קיים עדכון, על ידי העתקת הפקודה 
`docker-compose pull photoprism`
ו.. ENTER)

עכשיו נבצע את השינויים שנרצה, 
אחרי שסיימנו את העריכה ושמרנו את השינויים, נחזור לשורת הפקודה נעתיק את הפקודה 
`docker-compose up -d --no-deps photoprism`
ו… ENTER.

### מה אפשר לערוך

כמה דברים ממש חשובים.


ראשית, את המיקום והכונן שבו ישמרו הקבצים והאינדקסים (זוכרים שייחדנו דיסק קשיח לזה?)

אז איך משנים?
נפתח את הקובץ `docker-compose.yml` בעזרת כל עורך טקסט פשוט כמו notepad או [notepad++](https://notepad-plus-plus.org/downloads/)
ונשנה את הנתיב של הקבצים תחת הסקשן volumes.


<image-responsive class="center" imageURL="blog/google-photos-alternative/11.png" />


מפה נוכל וחשוב גם לשנות את הסיסמה הדיפולטית למשהו אישי וסודי יותר...

### גיבוי וסנכרון

חשוב לדעת שניתן להוסיף תמונות וסרטונים לא רק דרך הממשק בדפדפן אלא גם ע"י 
העתקת התמונות לתת 
תיקייה בנתיב שבו אנחנו שומרים את התמונות, (כברירת מחדל זה ב-`C:/users/username/Pictures` או בכל מקום שהגדרנו 
אליו, למשל `D:/Pictures` ואז אחרי שמעלים בחזרה את המערכת ניתן בממשק לגשת לטאב של
 Library ולבקש לאנדקס את כל הקבצים שהוספתם.

 מה שמאפשר להוריד את כל התמונות  מגוגל ,תמונות
  ([Download photos or videos to your device](https://support.google.com/photos/answer/7652919?co=GENIE.Platform%3DDesktop&hl=en))
לחלץ את כל הקבצים, ולהעתיק לתת תיקיה לדוגמה `D:/Pictures/google_photos_lib`
ואחרי שמעלים שוב את המערכת ניתן לגשת לעמודה של הספריה ולבקש לאנדקס את כל מה שקיים בתיקיה שהוספנו.

<image-responsive class="center" imageURL="blog/google-photos-alternative/12.png" />

אחרת קשה לעלות ג'יגות של תמונות וסרטונים דרך ממשק העלאה בדפדפן
(אישית הפעלתי ככה את האינדוקס של כל התמונות והסרטונים שהורדתי מגוגל פוטוס, וזה לקח כמעט יום שלם לאנדקס…) 


כשאתם מגבים חשוב מאוד להעתיק גם את התיקייה של הקבצים (במקרה שלי `D:/Picture` ) וגם את התיקיה של האינדקסים וההגדרות (במקרה שלי `D:/.photoprism`).


אם כבר מדברים על גיבוי, היות ואנחנו מגבים ידנית בעצמנו, אני חושב שכדאי להשתמש בסקריפט פשוט שיעתיק עבורנו רק את העדכונים ולא סתם ידרוס שוב ושוב את כל הקבצים, ככה זה יחסוך גם זמן וגם קריאות לדיסק.

נשמע מורכב? אז ממש לא.


כל מה שצריך זה ליצור קובץ טקסט פשוט ולתת לו סיומת `bat` לדוגמה 

`my_copy_script.bat`

ובתוכו נכניס את השורות הבאות:

```

:: this is to miror the dest to be like src (remove files in dest if needed)
Robocopy D:\Pictures F:\.photoprism /MIR /FFT /Z /XA:H /W:5
Robocopy D:\.photoprism F:\.photoprism /MIR /FFT /Z /XA:H /W:5
pause

```

הנתיבים פה הם כמובן מה נכונים למקרה שלי, נשנה אותם למה שרלוונטי נשמור את השינויים, וכל מה שנשאר זה ללחוץ פעמים על הקובץ ולהמתין שההעתקה תסתיים.


כדאי לדעת שהמפתחים של הפרויקט גם עובדים על סנכרון מול Google Drive למי שזה חשוב ועדיין לא רוצה להתנתק לגמרי מהאח הגדול...

<br>
<br>

אז בהצלחה בלקחת את המידע שלכם אליכם בחזרה!

אשמח כמובן להערות והארות אם משהו לא ברור או מספיק מובן במדריך  😃.

<br>

---

<br>
<br>
<br>

נקודה חשובה שכדאי להזכיר למיטיבי לכת, אם שמתם את זה על מחשב ייעודי וגם אם לא 😉  כדאי לתת לו כתובת סטטית.

 זה לא מדי מסובך [How to set static ip windows 10](https://pureinfotech.com/set-static-ip-address-windows-10/)
וכך תוכלו לגשת לתמונות מכל מחשב או טלפון ברשת הביתית פשוט ע"י הזנת הכתובת של המחשב עם הפורט `http://{ip-address}:2342`.

 וגם כדאי לנסות את האפליקציה של   [photoprism-mobile](https://github.com/photoprism/photoprism-mobile) PhotoPrism שאמנם כרגע בשלבי בנייה, אבל יש בה פיצ'ר ניסיוני של סנכרון אוטומטי ממש כמו בגוגל תמונות, לי זה עבד חלק. שווה לנסות.

 ואם כבר הלכתם על כתובת סטטית כדאי להתקין Pi Hole (תודות לרן בר זיק על המאמר הנפלא [התקנה ושימוש ב-PI HOLE כשרת DNS](https://internet-israel.com/%d7%9e%d7%93%d7%a8%d7%99%d7%9b%d7%99%d7%9d/raspberrypi/%d7%94%d7%aa%d7%a7%d7%a0%d7%94-%d7%95%d7%a9%d7%99%d7%9e%d7%95%d7%a9-%d7%91-pi-hole-%d7%9b%d7%a9%d7%a8%d7%aa-dns/)) ולהוסיף רשומות DNS מקומית למחשב.
 
<br>
<br>

----

Photo by <a href="https://burst.shopify.com/@ndekhors?utm_campaign=photo_credit&amp;utm_content=Picture+of+Secure+On+Chalkboard+With+Locks+%E2%80%94+Free+Stock+Photo&amp;utm_medium=referral&amp;utm_source=credit">Nicole De Khors</a> from <a href="https://burst.shopify.com/security?utm_campaign=photo_credit&amp;utm_content=Picture+of+Secure+On+Chalkboard+With+Locks+%E2%80%94+Free+Stock+Photo&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>