---
name: 'flashing-tasmota-on-tuya-ir-bridge'
title: צריבת Tasmota  על Tuya IR bridge
year: 29 באוגוסט 2019
color: '#8e7964'
trans: 'flashing-tasmota-on-tuya-ir-bridge'
id: 'flashing-tuya-ir'
description: מדריך צריבת קושחת Tasmota על משדר\מקלט IR של Tuya
---

# מדריך צריבת קושחה על Tuya IR (דגם UFO-R1).

### או כותרת חלופית: השלט האוניברסלי הכי טוב והכי זול מאז ומעולם.

## תמונות של המכשיר 

<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-1.jpg"  alt="Device"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-2.jpg"  alt="Device"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-3.jpg"  alt="Device"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-4.gif"  alt="Device"/>

## הקדמה

### מה זה IR (אינפרא אדום)

אינפרא-אדום זו קרינה באור בלתי נראה
 (בספקטרום מתחת האור האדום, ומכאן שמה)

 משתמשים בקרינה הזו בהרבה דברים בעולמנו, למשל ראיית לילה ובעיקר מה שנוגע אלינו
 בתדר 38KHz
 משתמשים בעשרות השנים האחרונות לשליטה אלחוטית במכשירים במכשירים שונים

אז איך בעצם אנחנו מדליקים את המזגן עם השלט?

לשלט יש נורת LED שמקרינה בתדר IR
למזגן יש דיודה שמאזינה לשדרים ב-IR

וכשהשלט שולח סט מוסכם מראש של מנעד קרינה המזגן מעבד את זה 
ובאם זה תמאים לפקודה מסויימת הוא מבצע אותה

#### תהליך השימוש 
* בשלט שמור דיגיטלית פקודה
* המשתמש לוחץ על פקודת הדלקה
* השלט ממיר את הפקודה מדיגיטלי לאנלוגי ובעצם משדר את הפקודה
* המזגן מאזין לפדוקה האנלוגית
* המזגן ממיר את הפקודה לדיגיטלית
* אם הפקודה מתאימה וקרובה מספיק לפקידה השמורה של הדלקה, הזמגן יידלק

### מה אפשר לעשות עם זה

כיום יש לנו אוסף של מכשירים בבית כל אחד עם השלט שלו,
מה אם ניצור מכשיר אחד שישלוט בכולם? אוקיי יש את זה כבר וקוראים לזה שלט אוניברסלי
 מה הוא בעצם עושה? יש לו גם משדר וגם מקלט של IR 
 וכך אפשר להקליט פקודה כלשהיא מהשלט המקורי לתת לזה שם ובהמשך לשלוח את הפקודה לפי הצורך.

 אבל כמו שאמרנו, זה כבר קיים שנים. אבל מה אם ניקח את השלט האוניברסלי הזה נחבר לו צ'יפ של WiFi
 וכך נוכל מכל מקום בעולם לשלוח פקודות IR בתוך ביתנו הקט? AKA להדליק את המזגן מהטלפון.

 טוב, אנחנו לא הולכים באמת להיות מהנדסי חומרה ואשכרה לבצע את זה 
 (?אמממ... למה לא בעצם)

אבל הסינים כבר יצרו כזה עבורנו וכל מה שהם דורשים 
זה עלות של מנת שווארמה (~10$)
ולהמתין יפה לדואר.

מה שאנחנו מקבלים זה מכשיר 
(נאה יש לציין) 
שכולל משדר ומקלט IR חיבור ל-WiFi ולחשמל 
(על המטען הם התקמצנו)
וחיבור לאפליקציה דרכה אפשר להקליט ולשדר פקודות מכל מקום בעולם.
מגניב, לא?

### מה לא טוב במה שיש

הסינים הם כנראה אחלה בחומרה, מבחינת מחיר נראות ויחס האיכות.
אבל בתכנה נראה שיש להם הרבה מה לשפר.
הממשק למכשיר (API) דרך האפליקצייה הרשמית בלבד
ובאמצעות שירותי הענן של Tuya.

ישנו פרוייקט קוד-פתוח [Tuyapi](https://github.com/codetheweb/tuyapi) לגישה למכשיר ללא האפליקציה, אבל המעקף מסורבל מאוד לשימוש.

שניה, מה לא טוב באפליקציה הרשמית? 
אז ככה:
1. אין למשתמש שליטה על הקוד שרץ במכשיר, רוצים לסמוך על הסינים שאין שם בוט נסתר או כל נזק אחר עם גישה מלאה לרשת הפרטית בבית? בהצלחה.
1. לא ניתן לשלוט מתוך הרשת הפנימית, מה שאומר שאם נפל האינטרנט גם אם הרשת הביתית תקינה (הראוטר פועל) לא ניתן לשלוט במכשירים בבית
1. אם יום אחד Tuya יורידו את השירות שלהם המכשיר יהפוך לפלסטיק יפהפה
1.(ממשק לא יציב ליישומים חיצוניים, לדוגמה [home-assistant](https://www.home-assistant.io/) [casanet](https://github.com/casanet/casanet-server)  ועוד ועוד

### מה זה Tasmota

אז הבנו שאנחנו רוצים את החומרה לקנות מן המוכן אבל את התכנה להשתמש במשהו טוב יותר.

וזה גם אפשרי, בגלל שחלק נכבד ממכשירי ה-IOT הסיניים
ורוב המכשירים שתמתשמשים באפליקציה (ובשירותי)
Tuya / Smart Life
(וכמובן גם משדר ה-IR שנסקור במאמר)
מבוססים על ערכת השבבים שנקראת 
[ESP8266](https://www.espressif.com/en/products/hardware/esp8266ex/overview)
וקהילת הקוד הפתוח פיתחה עבורה קושחות אלטרנטיביות כשאחת הטובות שבהן היא 
[Tasmota](https://github.com/arendst/Sonoff-Tasmota) (תנו בכוכבים, מגיע להם).

Tasmota מציעה ממשק בכל הפרוטוקולים הסטנדרטיים וכמובן ממשק וובי נוח ביותר לתפעול.
ואפילו יש דוקומנטציה פעילה בה אפשר לראות את המכשירים שהקהילה התאימה לקושחה [Tasmota Device Templates](https://blakadder.github.io/templates/),
שווה להציץ שם.

מעולה! אז נקנה חומרה מוכנה 
נשים עליה את הקושחה המתאימה 
וכך נוכל לגשת בקלות למכשיר דרך הדפדפן בצורה נוחה
או לחבר את המכשיר למערכת הבית החכם אם יש לנו כזו.

אז איפה הקאטצ'? 

הבעיה היא שלהחליף את הקושחה זה ממש לא כזה פשוט.
וזה לא נקסט נקסט אלא הלחמות וחיבורים.

המאמר הזה ינסה להפוך את תהליך צריבת הקושחה למשדר
ה-IR
לנהיר וברור גם למי שלא מגיע מהתחום.

## מה צריך

חשוב להדגיש, אלו הכלים שאני השתמשתי בהם, כמובן שאפשר לקנות ממתחרים או להשתמש בכלים דומים.

### ציוד חומרה

1. [המכשיר עצמו, משדר ומקלט IR](https://www.aliexpress.com/item/33004692351.html?spm=a2g0s.9042311.0.0.2e4d4c4dKvphql)
1. [מלחם ובדיל](https://www.aliexpress.com/item/924260113.html?spm=a2g0s.9042311.0.0.27424c4doJgn8c)
1. [לוח (לנוחות, לא חובה)](https://www.aliexpress.com/item/32701019904.html?spm=a2g0s.9042311.0.0.27424c4doJgn8c)
1. [חוטי חשמל זכר](https://www.aliexpress.com/item/32701019904.html?spm=a2g0s.9042311.0.0.27424c4doJgn8c)
1. [חוטי חשמל נקבה](https://www.aliexpress.com/item/32636873838.html?spm=a2g0s.9042311.0.0.27424c4dLBkmSl)
1. [USB to TTL serial](https://www.aliexpress.com/item/32969146794.html?spm=a2g0s.9042311.0.0.27424c4dLBkmSl)


<image-responsive class="center" imageURL="blog/flashing-tuya-ir/hardware.jpg"  alt="Hardware"/>

כל הציוד עולה בערך 40 שח, והמכשיר עצמו עולה בערך 40 שח.

### תכנה

1. PC עם מערכת ההפעלה Windows 10.
1. esptool תכנה לצריבת קושחה, ניתן להוריד [כאן](/assets/esptool.exe) או ישירות [מהמאגר](https://github.com/espressif/esptool) הרשמי ב-GitHub.
1. קושחת Tasmota, ניתן להוריד [כאן](/assets/tasmota.bin) (גרסה 6.5.0-release-sonoff) או ישירות [מהמאגר](https://github.com/arendst/Sonoff-Tasmota/releases) הרשמי ב-GitHub.

## צריבת הקושחה

# לפני שאנחנו מתחילים חשוב להבהיר: תהליך הצריבה מסוכן ואיני אחראי לשום תוצאה לא צפויה או נזק כלשהוא השימוש במדריך הוא על אחריות הקורא הנבון בלבד!!!

## הגדרת התכנה
ניצור תיקיה ואליה נעתיק את הקבצים שהורדנו את
`tasmota.bin` ואת `esptool.exe`
נניח לצורך הדוגמה ששמנו בתיקיה `C:\flasing`

נחבר את ה-USB to Serial למחשב
נמתין עד שהדרייברים יותקנו אוטומטית 
(אם לא ניתן להוריד [מכאן](http://www.prolific.com.tw/US/ShowProduct.aspx?p_id=225&pcid=41) או [מכאן](https://answers.microsoft.com/en-us/windows/forum/windows_10-hardware/prolific-usb-to-serial-comm-port-windows-10/0a4f8e48-7135-4434-9d10-349c9ce87fcf?auth=1))

בחיפוש של Windows נחפש `device manager`
ונכנס לתוצאה הראשונה.

או לחילופין יש ללחוץ על Windows Key + R במקלדת ובחלונית שנפתחת להזין `devmgmt.msc`.

שם נחפש את היציאה שמערכת ההפעלה הקצתה עבור ה-USB to Serial.

במקרה שלי זה COM6. נצטרך את זה בהמשך.

<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-manager.png"  alt="Device manager"/>

נפתח את שורת הפקודה בתיקיה שבה שמנו את הקבצים
(אם אתה לא יודעים איך חפשו [פה](https://www.thewindowsclub.com/how-to-open-command-prompt-from-right-click-menu))

ונעתיק לתוכה את הפקודה הבאה 

```bash
  esptool.exe -vv -cb 115200 -cp COM6 -ca 0x00000 -bz 1M -bm dout -cf tasmota.bin
```

שימו לב שה-`COM6` צריך להיות מוחלף ביציאה ששמרנו מהסעיף הקודם.

*לא ללחוץ Enter, להשאיר את שורת הפקודה עם הפקודה מוכנה להפעלה*

ננתק את ה-USB to Serial (ממיר) מהמחשב.

נשאיר את המחשב איך שהוא עכשיו ונעבור ל:

## הגדרת החומרה

### פתיחת המכשיר

*ראשית יש לנתק את המכשיר מהזנת החשמל, מעתה ועד סיום התהליך אין לחבר את המכשיר לחשמל.*

המכשיר מורכב משני חלקים, התחתית שאליו מחובר הצ'יפ עם ברגים
והמכסה המבריק שלא מחובר עם ברגים.


<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-equator.jpg"  alt="Device equator"/>

נסיר את המכסה בעדינות אפשר להעזר במברג פס, וכך לאט לאט לפתוח בזהירות בלי לשבור.

בסוף התהליך המכשיר אמור להראות כך


<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-opend.jpg"  alt="Device opend"/>

### הלחמת חוטים

צריך לחבר את המכשיר
 (המנותק מהחשמל!)
 למחשב ע"י הממיר.

החיבור הוא כדלהלן:

* יציאת `v3v` של המכשיר ליציאת `v3v` של הממיר
* יציאת `TXD` של המכשיר ליציאת `RXD` של הממיר
* יציאת `RXD` של המכשיר ליציאת `TXD` של הממיר
* יציאת `GND` של המכשיר ליציאת `GND` של הממיר
* יציאת `IO0` של המכשיר ליציאת `GND` של הממיר

מצורף צילומים של החיבור.


<image-responsive class="center" imageURL="blog/flashing-tuya-ir/full-wiring.jpg"  alt="Full wiring"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/converter-wiring.jpg"  alt="Converter wiring"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/board-wiring.jpg"  alt="Board wiring"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-wiring-1.jpg"  alt="Device wiring"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-wiring-2.jpg"  alt="Device wiring"/>

### חיבור למחשב

נוודא שוב שכל החוטים מחווטים נכון והכל מחובר.

עכשיו הכל מוכן לצריבה עצמה.

נחבר את הממיר למחשב, נלך לחלון שורת הפקודה שהכנו מקודם ונלחץ Enter.

שורת הפקודה והממיר אמורים להראות כך:

<iframe width="560" height="315" src="https://www.youtube.com/embed/oJWv0eCkdLA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

בהנחה והכל עבר כשורה וקיבלנו את ההודעה 
`flush complete`,
ננתק את הממיר מהמחשב ואז נסיר את החוטים שהלחמנו למכשיר ונחזיר בעדינות את המכסה.

הצריבה הסתיימה!

## חיבור וקינפוג המכשיר

נוודא שניתקנו את כל החוטים, והחזרנו את הכיסוי של המכשיר למקומו.
ונחבר את המכשיר להזנת חשמל

נמתין כמה שניות ואמורים לראות רשת חדשה במחשב או בטלפון שנקראת `sonoff-xxxx`

<image-responsive class="center" imageURL="blog/flashing-tuya-ir/networks.jpg"  alt="networks"/>

נתחבר לרשת הזו

נפתח בדפדפן את הכתובת `192.168.4.1`

ונזין את ה-SSID של ה-WiFi הביתי ואת הסיסמה
(ניתן לחבר לשני רשתות)

ונלחץ על 'Save'

<image-responsive class="center" imageURL="blog/flashing-tuya-ir/ssid-config.jpg"  alt="ssid config"/>

המכשיר אמור לעשות אתחול עצמי ולהתחבר לרשת.

נתחבר בחזרה לרשת הביתית הרגילה, ונכנס לראוטר בכדי לראות מה הכתובת של המכשיר החדש.

כל ראוטר עם הממשק (המשונה) שלו אבל אמור להיות בו איפשהו הכתובות של המכשירים.

בראוטר שלי (ASUS RT-xxxxxx) זה נראה כך:
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/dhcp-ips.jpg"  alt="DHCP IPs"/>

אחרי שמצאנו מה הכתובת של המכשיר (במקרה שלי `192.168.1.36`)
נזין את הכתובת בדפדפן.

בממשק שמופיע נבחר `Configuration`
ואז `Configure Other`.

בחלונית ה-Tamplate נחליף את התוכן הקיים בתוכן הבא:

```
{"NAME":"YTF IR Bridge","GPIO":[255,255,255,255,56,51,0,0,0,17,8,0,0],"FLAG":0,"BASE":62}
```

(מתוך פרוייקט התבניות של Tasmota [הדף של משדר ה-IR](https://blakadder.github.io/templates/ytf_ir_bridge.html))

נלחץ על הצלמית ליד ה-Activate שיהיה בה V.

ונלחץ על 'Save'.

המכשיר שוב אמור לאתחל את עצמו.

וזהו סיימנו להגדיר את המכשיר.

ניתן להשתמש במכשיר, ולהעזר בקהילה סביב Tasmota.

ממליץ להעיף מבט [פה](https://github.com/arendst/Sonoff-Tasmota/wiki/Commands#irremote) [ופה](https://github.com/arendst/Sonoff-Tasmota/issues/2116#issuecomment-440716483)

### תעשו חיים!
----

Photo by <a href="https://burst.shopify.com/@enisa97?utm_campaign=photo_credit&amp;utm_content=Free+Stock+Photo+of+Red+Abstract+Street+Lights+%E2%80%94+HD+Images&amp;utm_medium=referral&amp;utm_source=credit">Enisa Abazaj</a> from <a href="https://burst.shopify.com/red?utm_campaign=photo_credit&amp;utm_content=Free+Stock+Photo+of+Red+Abstract+Street+Lights+%E2%80%94+HD+Images&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>
