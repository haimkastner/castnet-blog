---
name: 'private-vpn-on-aws'
title: 'שירות VPN אישי ופרטי בענן של AWS'
year: 10 בינואר 2021
color: '#8e7964'
trans: 'private-vpn-on-aws'
id: 'private-vpn-on-aws'
description:  מדריך הפעלת VPN פרטי על גבי ענן AWS צעד אחר צעד
---

<image-responsive imageURL="blog/private-vpn-on-aws/1.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/2.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/3.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/4.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/5.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/6.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/7.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/8.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/9.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/10.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/11.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/12.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/13.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/14.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/15.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/16.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/17.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/18.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/19.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/20.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/21.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/22.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/23.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/24.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/25.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/26.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/27.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/28.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/29.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/30.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/31.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/32.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/33.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/34.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/35.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/36.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/37.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/38.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/39.jpeg" />
<image-responsive imageURL="blog/private-vpn-on-aws/40.jpeg" />
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m1.jpg" />
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m2.jpg" />
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m3.jpg" />
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m4.jpg" />
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m5.jpg" />
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m6.jpg" />
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m7.jpg" />
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m8.jpg" />


<br>
<br>
<br>
<br>
<br>

# התקנה ללא רכישת OpenVPN AMI

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