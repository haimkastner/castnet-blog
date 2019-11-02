---
name: 'flashing-tasmota-on-sonoff-rf-bridge'
title: צריבת Tasmota  על Sonoff RF Bridge
year: 1 בנובמבר 2019
color: '#8e7964'
trans: 'flashing-tasmota-on-sonoff-rf-bridge'
id: 'flashing-sonoff-rf'
description: מדריך צריבת קושחת Tasmota על משדר\מקלט RF של Sonoff
---

# מדריך צריבת קושחה על Sonoff RF 433MHz.

## תמונות של המכשיר 

<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/device-1.jpg"  alt="Device"/>
<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/device-2.jpg"  alt="Device"/>
<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/device-3.jpg"  alt="Device"/>
<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/device-4.jpg"  alt="Device"/>

## הקדמה

### מה אפשר לעשות עם זה

ממליץ להעיף מבט במאמר מוקדם יותר שלי
[כאן](/blog/flashing-tasmota-on-tuya-ir-bridge)
על IR
ההקדמה מאוד רלוונטית גם לפה
כי העיקרון מאוד דומה, 
שבעזרת משדר\מקלט RF 
ניתן לשלוט בשערים חשמליים אזעקות וכדו' מכל מקום בעולם.

## מה צריך

חשוב להדגיש, אלו הכלים שאני השתמשתי בהם, כמובן שאפשר לקנות ממתחרים או להשתמש בכלים דומים.

### ציוד חומרה

1. [המכשיר עצמו, משדר ומקלט RF](https://www.aliexpress.com/item/32995684766.html)
1. [מלחם ובדיל](https://www.aliexpress.com/item/924260113.html)
1. [2.54MM פינים ישרים להלחמה](https://www.aliexpress.com/item/33038082958.html)
1. [חוטי חשמל נקבה](https://www.aliexpress.com/item/32636873838.html)
1. [USB to TTL serial](https://www.aliexpress.com/item/32969146794.html)

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

<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/device-manager.png"  alt="Device manager"/>

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

המכשיר מורכב משני חלקים, המחוברים בעזרת 4 ברגים.

<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/device-screws.jpg"  alt="Device screws"/>

אחרי פתיחת המכשיר, הלוח אמור להראות כך:

<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/device-opend.jpg"  alt="Device opend"/>

עכשיו נוציא בעדינות ובזהירות את הלוח מהחלק העליון של הפלסטיק.
והלוח אמור להראות כך:

<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/device-board.jpg"  alt="Device board"/>

נרים בעדינות את החלק השחור העבה עם המדבקה הלבנה שעליו ב-90 מעלות.
(ניזהר שלא יקרע\יינתק מהלוח)
שייראה כך:

<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/device-board-ready.jpg"  alt="Device board ready"/>

עכשיו נשאר רק את המתג בלוח להעביר ל-OFF.

מצורף תרשים
<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/board-switch.png"  alt="Device board ready"/>


### הלחמת חוטים

צריך לחבר את המכשיר
 (המנותק מהחשמל!)
 למחשב ע"י הממיר.

החיבור הוא כדלהלן:

* יציאת `3v3` של המכשיר ליציאת `3v3` של הממיר
* יציאת `TXD` של המכשיר ליציאת `RXD` של הממיר
* יציאת `RXD` של המכשיר ליציאת `TXD` של הממיר
* יציאת `GND` של המכשיר ליציאת `GND` של הממיר

מצורף צילומים ותרשימים של החיבור.

<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/board-arrows.png"  alt="Full wiring"/>
<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/device-wiring-1.jpg"  alt="Full wiring"/>
<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/device-wiring-2.jpg"  alt="Full wiring"/>
<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/device-wiring-3.jpg"  alt="Full wiring"/>

### חיבור למחשב

נוודא שוב שכל החוטים מחווטים נכון הכל מחובר.
והמתג בלוח על-OFF.

עכשיו הכל מוכן לצריבה עצמה.

נלחץ על ה-`Pairing Button`.

מצורף תמונה של מיקום הכפתור.
<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/pairing-button.png"  alt="Full wiring"/>


נחבר את הממיר למחשב תוך כדי לחיצה על הכפתור ובחלון שורת הפקודה שהכנו מקודם נלחץ Enter.


בהנחה והכל עבר כשורה וקיבלנו את ההודעה 
`flush complete`,
כמו כאן:
<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/flash-cmd.jpg"  alt="Full wiring"/>

הצריבה הסתיימה!

ננתק את הממיר מהמחשב, נסיר את החוטים שהלחמנו נחזיר את המתג בלוח ל-ON
ונחבר בעדינות מחדש את חלקי המכשיר ונסגור אותו עם הברגים.


## חיבור וקינפוג המכשיר

נוודא שניתקנו את כל החוטים, והחזרנו את המתג בלוח למקומו על -ON.
ונחבר את המכשיר להזנת חשמל.

נמתין כמה שניות ואמורים לראות רשת חדשה במחשב או בטלפון שנקראת `sonoff-xxxx`

<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/networks.jpg"  alt="networks"/>

נתחבר לרשת הזו

נפתח בדפדפן את הכתובת `192.168.4.1`

ונזין את ה-SSID של ה-WiFi הביתי ואת הסיסמה
(ניתן לחבר לשני רשתות)

ונלחץ על 'Save'

<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/ssid-config.jpg"  alt="ssid config"/>

המכשיר אמור לעשות אתחול עצמי ולהתחבר לרשת.

נתחבר בחזרה לרשת הביתית הרגילה, ונכנס לראוטר בכדי לראות מה הכתובת של המכשיר החדש.

כל ראוטר עם הממשק (המשונה) שלו אבל אמור להיות בו איפשהו הכתובות של המכשירים.

בראוטר שלי (ASUS RT-xxxxxx) זה נראה כך:
<image-responsive class="center" imageURL="blog/flashing-sonoff-rf/dhcp-ips.jpg"  alt="DHCP IPs"/>

אחרי שמצאנו מה הכתובת של המכשיר (במקרה שלי `192.168.1.36`)
נזין את הכתובת בדפדפן.

בממשק שמופיע נבחר `Configuration`
ואז `Configure Other`.

בחלונית ה-Tamplate נחליף את התוכן הקיים בתוכן הבא:

```
{"NAME":"Sonoff Bridge","GPIO":[17,148,255,149,255,255,0,0,255,56,255,0,0],"FLAG":0,"BASE":25}
```

(מתוך פרוייקט התבניות של Tasmota [הדף של משדר ה-RF](https://blakadder.github.io/templates/sonoff_RF_bridge.html))

נלחץ על הצלמית ליד ה-Activate שיהיה בה V.

ונלחץ על 'Save'.

המכשיר שוב אמור לאתחל את עצמו.

וזהו סיימנו להגדיר את המכשיר.

ניתן להשתמש במכשיר, ולהעזר בקהילה סביב Tasmota.

ממליץ להעיף מבט [פה](https://github.com/arendst/Sonoff-Tasmota/wiki/Commands#sonoff-rf-bridge) 

### אז שוב, תעשו חיים!