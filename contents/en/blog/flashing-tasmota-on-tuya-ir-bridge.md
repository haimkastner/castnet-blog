---
name: 'flashing-tasmota-on-tuya-ir-bridge'
title: Flashing Tasmota on Tuya IR bridge
year: 29 August 2019
color: '#8e7964'
trans: 'flashing-tasmota-on-tuya-ir-bridge'
id: 'flashing-tuya-ir'
description: Flashing Tasmota firmware on Tuya IR Trasmitter/Recevier manual
---

# Flashing manual for Tuya IR bridge (model UFO-R1).

### Or as an alternative title: The best and cheapest universal remote ever. 

## The device pictures


<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-1.jpg"  alt="Device"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-2.jpg"  alt="Device"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-3.jpg"  alt="Device"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-4.gif"  alt="Device"/>


## Flashing equipment

I must say, this is the tools I used, you can buy from other sellers or similar tools.

### Hardware equipment

1. [IR device (transmitter and receiver)](https://www.aliexpress.com/item/33004692351.html?spm=a2g0s.9042311.0.0.2e4d4c4dKvphql)
1. [Soldering iron and tin](https://www.aliexpress.com/item/924260113.html?spm=a2g0s.9042311.0.0.27424c4doJgn8c)
1. [Board (not must)](https://www.aliexpress.com/item/32701019904.html?spm=a2g0s.9042311.0.0.27424c4doJgn8c)
1. [Male wires](https://www.aliexpress.com/item/32701019904.html?spm=a2g0s.9042311.0.0.27424c4doJgn8c)
1. [Female Wires](https://www.aliexpress.com/item/32636873838.html?spm=a2g0s.9042311.0.0.27424c4dLBkmSl)
1. [USB to TTL serial](https://www.aliexpress.com/item/32969146794.html?spm=a2g0s.9042311.0.0.27424c4dLBkmSl)


<image-responsive class="center" imageURL="blog/flashing-tuya-ir/hardware.jpg"  alt="Hardware"/>

All the equipment cost about 10$ and the device about 11$.

### Software to use

1. PC with Windows 10 OS.
1. download `esptool` flashing tool from [here](/assets/esptool.exe) or directly from the official [repo](https://github.com/espressif/esptool) at GitHub.
1. Tasmota firmware from [here](/assets/tasmota.bin) (version 6.5.0-release-sonoff) or directly from the official [repo](https://github.com/arendst/Sonoff-Tasmota/releases) at GitHub.

## Flashing the firmware

# THE FLASHING PROCESS IS VERY DANGEROUS! BE AWARE, USING THE MANUAL IS ON YOUR OWN RISK!!!

## Software settings

Create a folder and copy to it the downloaded files
`tasmota.bin` and `e sptool.exe`.

Let assume the folder is `C:\flasing`

Connect the `USB to Serial` converter to the PC.
wait until drivers automatically installed by Windows.
(if its not work automatic go [here](http://www.prolific.com.tw/US/ShowProduct.aspx?p_id=225&pcid=41) or [here](https://answers.microsoft.com/en-us/windows/forum/windows_10-hardware/prolific-usb-to-serial-comm-port-windows-10/0a4f8e48-7135-4434-9d10-349c9ce87fcf?auth=1))

In Windows search look for `device manager`
and select the first results, or press `Windows Key` + `R` and in the input insert `devmgmt.msc`.

In the device manager look for the device serial port `COMX`.

We will need it in the next step. In my case, it was `COM6`.

<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-manager.png"  alt="Device manager"/>

Open the command line in the directory `C:\flasing`.

(If you don't know-how, look [here](https://www.thewindowsclub.com/how-to-open-command-prompt-from-right-click-menu))

On the command line write the following command:

```bash
  esptool.exe -vv -cb 115200 -cp COM6 -ca 0x00000 -bz 1M -bm dout -cf tasmota.bin
```

Note that the `COM6` should be replaced by your device port from earlier.

*Do not press 'Enter' yet, keep the command ready to use for the next step*

Disconnect the `USB to Serial` converter from the PC.

Now move to the next step:

## Hardware settings

### Opening the device

*First of all, unplug the device from the power, and do not connect it until flashing process finished*

The device consists of two parts, the bottom to which the chip is attached with screws, 
and the glossy lid that is not attached with screws.

<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-equator.jpg"  alt="Device equator"/>

Remove the cover gently, you can use a screwdriver but open it slowly and carefully because it is very fragile.

At the end the device should look like this:

<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-opend.jpg"  alt="Device opend"/>

### Soldering

We need to connect the device (while not connected to power!!!) to the PC via the converter.

The connection diagram is:

* port `v3v` of the device to the `v3v` of the converter.
* port `TXD` of the device to the `RXD` of the converter.
* port `RXD` of the device to the `TXD` of the converter.
* port `GND` of the device to the `GND` of the converter.
* port `IO0` of the device to the `GND` of the converter.

the connections need to be like shown in the following pictures:

<image-responsive class="center" imageURL="blog/flashing-tuya-ir/full-wiring.jpg"  alt="Full wiring"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/converter-wiring.jpg"  alt="Converter wiring"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/board-wiring.jpg"  alt="Board wiring"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-wiring-1.jpg"  alt="Device wiring"/>
<image-responsive class="center" imageURL="blog/flashing-tuya-ir/device-wiring-2.jpg"  alt="Device wiring"/>

### Connect to the PC

Make sure again that all wires are well connected.

Now the flashing is ready.

Connect the USB to Serial converter to the PC, then in the command line press 'Enter'.

The command line and the converter shuld look like this:

<iframe width="560" height="315" src="https://www.youtube.com/embed/oJWv0eCkdLA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Assuming all worked properly and `flush complete` displayed on the command line,
remove the converter from the PC, remove the wires from the device, and return the device cover.

The flashing is finished!

## Setting the device

Make sure that all wires removed, and the cover is in his place, then connect device to the power.

Wait a few seconds and then should be a new network named `sonoff-xxxx` in the WiFi list on PC or smartphone.

<image-responsive class="center" imageURL="blog/flashing-tuya-ir/networks.jpg"  alt="networks"/>

Connect to the new network.

Open the browser and open `192.168.4.1`. 

Enter your home SSID and the password (Tasmota support two networks)

And then press 'Save'

<image-responsive class="center" imageURL="blog/flashing-tuya-ir/ssid-config.jpg"  alt="ssid config"/>

The device should reboot and connect to your home network.

Connect back to the home network, enter to the home router to get the new device IP address.

Each router has a different UI but all should have somewhere a table of network devices IPs.  

In my router (ASUS RT-xxxxxx) its look like this: 

<image-responsive class="center" imageURL="blog/flashing-tuya-ir/dhcp-ips.jpg"  alt="DHCP IPs"/>

After you know the new device IP (in my case `192.168.1.36`)
Open the browser and press the IP in the URL bar.

Then in the Web interface press `Configuration` and then `Configure Other`.

Replace the 'Template' content with:

```
{"NAME":"YTF IR Bridge","GPIO":[255,255,255,255,56,51,0,0,0,17,8,0,0],"FLAG":0,"BASE":62}
```

(From the template project, [IR Bridge page](https://blakadder.github.io/templates/ytf_ir_bridge.html))

And press on the 'Activate' checkbox to be 'V'.

Then press 'Save'.

The device should reboot again.

And that is it. you finished.

Now you can use the device.

I recomand to see the Tasmota IR documentation [here](https://github.com/arendst/Sonoff-Tasmota/wiki/Commands#irremote) and [here](https://github.com/arendst/Sonoff-Tasmota/issues/2116#issuecomment-440716483).

### Have fun!

----

Photo by <a href="https://burst.shopify.com/@enisa97?utm_campaign=photo_credit&amp;utm_content=Free+Stock+Photo+of+Red+Abstract+Street+Lights+%E2%80%94+HD+Images&amp;utm_medium=referral&amp;utm_source=credit">Enisa Abazaj</a> from <a href="https://burst.shopify.com/red?utm_campaign=photo_credit&amp;utm_content=Free+Stock+Photo+of+Red+Abstract+Street+Lights+%E2%80%94+HD+Images&amp;utm_medium=referral&amp;utm_source=credit">Burst</a>
