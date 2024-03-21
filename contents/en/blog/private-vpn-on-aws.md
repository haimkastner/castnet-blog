---
name: 'private-vpn-on-aws'
title: 'Private VPN server on AWS Cloud'
year: '17 January 2021'
color: '#8e7964'
trans: 'private-vpn-on-aws'
id: 'private-vpn-on-aws'
description: Step by step manual to configure private and secure VPN server on AWS cloud
---


🔐 In this tutorial we will learn how to create a private VPN server on the AWS cloud 🔐

## What is a VPN 
The idea is to route all network traffic through another computer (the VPN server) so in terms of our request recipient the computer that sending the request is the VPN server and in terms of our ISP we accessing to the VPN only.

You can read more about it [here](https://en.wikipedia.org/wiki/Virtual_private_network) and [here](https://www.howtogeek.com/133680/htg-explains-what-is-a-vpn/).

Once we understand the principle behind the VPN it is easy to understand how critical for a VPN provider to be reliable and secure, because the VPN provider knows who sent the request and what is the final destination, meaning the VPN provider knows everything.

But even for a safe and reliable provider, there are still some advantages to creating your own private VPN server.

A brief comparison of a VPN provider VS a private VPN server (which does not include all aspects!)


- The addresses of the VPN providers are known to everyone, so your ISP also knows that you are accessing a VPN server and may decide to block the communication, and on the other hand, the site/service you want to access may also decide that it does not want to serve VPN users, but when using unfamiliar AWS addresses there is zero chance that the ISP will start blocking AWS addresses (and if so .. the last problem will be your small VPN), and also the site/server can't know that you're using VPN.
- In a private VPN server, the address is under your control, want to replace it? it's easy, just create a new server with a new IP, that's all.
- In a private VPN server, there is no chance that someone else will collect data or logs from your VPN server, the server is yours and under your control, as long as you are keeping the access key secure 😄
- There is a very low chance to face load issues with a private server because only you connect to it, unlike any VPN provider that may have loads issues, but it depends on the reliability of the VPN provider.
- The cost in both options is quite the same in total although on a private VPN the cost is per hour and not per month.
- When you're the only one using an IP address there is no "noise" protection like as in a VPN provider that thousands of other people using the same IP through as well, so if someone knows what your IP is, and has the visitors list of a site/service to, it's possible to detect your activity in this service (it's really very hard to do that, but possible).
 
## Create an OpenVPN server on AWS Cloud
Once you decided to create a private VPN server you can do it within minutes, It's easy and simple.


First of all, you need to create (if you don't have yet) and login to the [AWS](https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#) account.
(this is not the regular Amazon shopping account)

> Pay attention, it's highly recommended to put a good password and set two-step verification, since that yours credit card is attached to the account, if a hackers manages to get into the account they can perform operations that will cost you thousands of dollars before you can even notice. (and it is also recommended to set up alerts using AWS dashboard so AWS will send alerts when you exceed your approximate billing amount)


First, go to the Services tab and select
EC2
the AWS virtual machines service, which is exactly what we need, a computer on the AWS cloud.

<image-responsive imageURL="blog/private-vpn-on-aws/1.jpeg" />

Choose the region where you are interested in being hosted, prefer a region that is physically close to you, so the communication to the cloud will be as fast as it is possible.

<image-responsive imageURL="blog/private-vpn-on-aws/2.jpeg" />

After region selection, it is time to create a machine instance.

<image-responsive imageURL="blog/private-vpn-on-aws/3.jpeg" />

select
AMI
(which is actually an OS image)

Press on the
`AWS Market` tab, then search for `openvpn` and `select`

(The selected image on the screenshot is limited to 2 devices at the same time, you can also select the 10 or 25 parallel connections images)

<image-responsive imageURL="blog/private-vpn-on-aws/4.jpeg" />

It is important to note that using this image costs money
(Per hour)
<b> in additional </b>
to the AWS standard billing

You can use an AMI without any extra cost (apart from the usual charge to AWS) but it requires more installations on the image,
at the bottom of this guide, there is an appendix on how to it, I think it's worth it.

<image-responsive imageURL="blog/private-vpn-on-aws/5.jpeg" />

We can choose the type of machine we want, become it's only for personal use, the `t2.micro`  should enough.

Not enough for you? You can always recreate and choose a more powerful machine, just pay attention to the charges 😏

<image-responsive imageURL="blog/private-vpn-on-aws/6.jpeg" />

In the next view, there is nothing to change just continue with the default settings.

<image-responsive imageURL="blog/private-vpn-on-aws/7.jpeg" />

Launch the machine.

<image-responsive imageURL="blog/private-vpn-on-aws/8.jpeg" />

We'll create a `pem` key to access the machine (You can also select an existing key if you have one) It is very important to download and store the key in a safe place. 

Now let's launch the machine
<image-responsive imageURL="blog/private-vpn-on-aws/9.jpeg" />

Wait for the machine while AWS
preparing it.
<image-responsive imageURL="blog/private-vpn-on-aws/10.jpeg" />

Once the machine is ready, you can click on the machine ID link.
<image-responsive imageURL="blog/private-vpn-on-aws/11.jpeg" />

Set a readable name for the new machine
<image-responsive imageURL="blog/private-vpn-on-aws/12.jpeg" />


<!-- <image-responsive imageURL="blog/private-vpn-on-aws/13.jpeg" /> -->

Wait until the machine will be ready then copy the public IP address

<image-responsive imageURL="blog/private-vpn-on-aws/14.jpeg" />

Install 
[putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
on your PC.

After the instalation finished, search for
`puttygen`
witch is is used to convert the 
`pem` key into the
`pkk` format.

Open the puttygen and in it select
`conversions` -> `import key`
then select the
`pem` file tThat we downloaded earlier.

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/15.jpeg" />

Create the `pkk` file
<image-responsive class="center" class="center" imageURL="blog/private-vpn-on-aws/16.jpeg" />

Approve
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/17.jpeg" />

Connect to the machine by
SSH

In your PC search for `putty` and start it.

Enter the name and address with the following format
`openvpn@{the public ip}`

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/18.jpeg" />

In the tree menu select
`connection` -> `SSH` -> `Auth`
and load the 
`pkk` key file.

Then press `open`
<image-responsive  class="center" imageURL="blog/private-vpn-on-aws/19.jpeg" />

approve the licenses agreement by pressing
`yes`
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/20.jpeg" />

Then next next next
(by `Enter`)

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/21.jpeg" />
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/22.jpeg" />

The server is ready!
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/23.jpeg" />

Press the following command to set your username password

```
sudo su
```
```
passwd openvpn
```

Press you password twice
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/24.jpeg" />

In a browser URL bar press the following URL

`https://{the machine public ip}:943/admin`

Just make sure to set your machie public IP instead of the `{the machine public ip}`.

A warning will be displayed in the browser because the domain name has not been verified.
That's OK, and we'll leave that aside for now
(It is of course possible to fix this, but not relevant at this moment)

selected
`Advanced`
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/25.jpeg" />

Chosen to continue to the site
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/26.jpeg" />

Enter the username `openvpn`
and the password you created earlier
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/27.jpeg" />

Approve
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/28.jpeg" />

Go to 'VPN settings', set it to be as it's defined in the screenshot, and save the changes.

<image-responsive imageURL="blog/private-vpn-on-aws/29.jpeg" />

A notification will pop up at the top of the page, press on the `update running servers` to update the currently running services.

 Now the server is ready to use 🚀🚀🚀

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/31.jpeg" />

<br>
<br>
<br>

If the server is not in use you can delete the machine any time

<image-responsive imageURL="blog/private-vpn-on-aws/40.jpeg" />

<br>
<br>
<br>
<br>
<br>
<br>
<br>


## Connecting Windows to the VPN server
Enter the URL to the address bar again but this time without the additional
`admin`
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/30.jpeg" />

Enter a username and password as before
And select the VPN client you want to download

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/32.jpeg" />

Downloading and install the windows client.

After the installation is finished, a new icon will appear on your desktop, double  press on it.

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/33.jpeg" />

Let's get out from the tips popup (or not ...)

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/34.jpeg" />

Approve all

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/35.jpeg" />
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/36.jpeg" />

Start the connection

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/37.jpeg" />

Enter the `openvpn` username and password as before.

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/38.jpeg" />

And... the IP address is from Ireland (the selected host region)!!!

<image-responsive class="center" imageURL="blog/private-vpn-on-aws/39.jpeg" />

<br>
<br>
<br>
<br>
<br>
<br>
<br>

## Connecting smartphone to the VPN server
And of course, the VPN
also available for Android OS, to install the app go to
[Google Play](https://play.google.com/store/apps/details?id=net.openvpn.openvpn)
   (You can also download it manually although it's not recommended)

Then install the
`OpenVPN Connect`
app.
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m1.jpg" />

Enter the machine public address
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m2.jpg" />

Approve
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m3.jpg" />

Enter the `openvpn` username and password
(You can also choose auto-connect, but it's not required)
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m4.jpg" />

Start the connection
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m5.jpg" />

Approve the network traffic change access
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m6.jpg" />

And it's ready
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m7.jpg" />

And here we are again in Ireland
<image-responsive class="center" imageURL="blog/private-vpn-on-aws/m8.jpg" />


<br>
<br>
<br>
<br>
<br>

## appendix
### OpenVPN without AMI purchase

Using an OpenVPN AMI's from the AWS marketplace is cost an additional charge, even slightly more than what is paid to AWS itself on the machine hosting.

But it possible to install the OpenVPN on any other free AMI, 
so the cost will be for the machine hosting only.

But it requires manual installation of
OpenVPN

How do that? It is easy.

When selecting AMI ib the AWS dashboard select a free Debian AMI

(Tested with debian-stretch-hvm-x86_64-gp2-2019-04-27-83345)

<image-responsive  imageURL="blog/private-vpn-on-aws/g0.jpg" />


In Security Rules, make sure the following ports are open
* TCP 443, 943, 945
* UDP 1194

<image-responsive  imageURL="blog/private-vpn-on-aws/g1.jpg" />

Connect via SSH (With `admin` as username and the `pkk`  just like before)

And begin the installation itself

Update the system
```
sudo apt update
```

Install the net-tolls
```
sudo apt install net-tools
```

Download OpenVPN
```
curl -O http://swupdate.openvpn.org/as/openvpn-as-2.5.2-Debian9.amd_64.deb
```

Install OpenVPN
```
sudo dpkg -i openvpn-as-2.5.2-Debian9.amd_64.deb
```

Run OpenVPN
```
sudo /usr/local/openvpn_as/bin/ovpn-init
```

And if it's required, delete an existing configuration, then press `DELETE`


And from now and on just as with the original AMI.


<br>
<br>