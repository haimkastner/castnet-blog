---
name: 'units-in-system'
title: Simplifying Unit Handling in Software Systems
year: April 4th, 2023
color: '#8e7964'
id: 'units-in-system'
trans: 'units-in-system'
description: Best practices for handling different units in software systems.
---

> Update on January 30th, 2025

On September 23, 1999, communication was lost with the Mars Climate Orbiter probe, resulting in the loss of a project worth 327 million USD. An investigation revealed that the [cause of the crash was due to incorrect unit conversion](https://en.wikipedia.org/wiki/Mars_Climate_Orbiter). 

One system transmitted data in USCS *(United States customary units)* while the other system interpreted it as SI *(International System of Units)*.

Similar problems occur frequently in software development, although they usually don't result in billion-dollar losses.

Developers frequently encounter challenges when transferring data, as they need to ensure that both the producer and consumer are aligned with the same unit system. If the units do not match, developers must take the necessary steps to convert the data, often multiple times.


Unfortunately, this process is prone to errors, and mistakes are all too common.

To address this issue, a classic approach is to improve variable naming conventions, add helpful comments, and make sure to well document the APIs.

Although these solutions can be helpful, they are not infallible. Even experienced developers can miss important details and misunderstand differences between units, such as the distinction between miles and nautical miles.

Especially when working with external APIs, it can be difficult to ensure that conversions are performed correctly, without introducing mistakes.


In this article, we'll explore the issue in-depth and present a solution to simplify the process of handling units in software systems.

Handling units in software systems can be a tricky task. The challenges includes:

- Identifying the unit system in use
- Very lengthy variables and methods names that includes unit information
- Many conversions all across the system
- Understanding how to convert between different units
- Choosing a unit system for the system & APIs


Let's take a look at some examples to illustrate these difficulties:

This example shows how it can be difficult to understand what unit system is being used.

```typescript
function getCurrentPosition(lastPosition: number, 
                            speed: number, 
                            timePassed: number) {
  return lastPosition + ((speed / 60) * (timePassed / 1000 / 60));
}

const platformPosition = 100;
const platformSpeed = 1;
const timePassedFromLastUpdate = 500;

const newPlatformPosition = getCurrentPosition(platformPosition, platformSpeed, timePassedFromLastUpdate);

console.log(newPlatformPosition);
// Can you understand what is the unit system in 'getCurrentPosition' API? and what is the speed = 1 means?
```

<br>
<br>
<br>

In this example, you can see how variables become longer as we try to specify the unit system and avoid mistakers.

```typescript
function nextPositionFormula(positionInMeters: number, 
                             speedInMeterPerMinutes: number, 
                             timePassedInMinutes: number) {
  return positionInMeters + (speedInMeterPerMinutes * timePassedInMinutes);
}

function getCurrentPosition(positionInMeters: number, 
                            speedInMeterPerHour: number, 
                            timePassedInMilliseconds: number) {
  const speedInMeterPerMinutes = speedInMeterPerHour / 60; 
  const timePassedInMinutes = timePassedInMilliseconds / 1000 / 60; 
  return nextPositionFormula(positionInMeters, 
                             speedInMeterPerMinutes, 
                             timePassedInMinutes);
}

const platformPositionInMeters = 100;
const speedInMeterPerHour = 1;
const timePassedInMilliseconds = 500;

const newPlatformPositionInMeters = getCurrentPosition(platformPositionInMeters, speedInMeterPerHour, timePassedInMilliseconds);

console.log(newPlatformPositionInMeters);
// Now you can understand the API, but the names? so long and not easy to read.
```

<br>
<br>
<br>

This example highlights the challenge of dealing with multiple unit conversions that cannot be avoided, 
but without a good reason to do so from the first place.

```typescript
function nextPositionFormula(positionInMeters: number, 
                              speedInMeterPerMinutes: number, 
                              timePassedInMinutes: number) {
  return positionInMeters + (speedInMeterPerMinutes * timePassedInMinutes);
}

function getCurrentPosition(positionInMeters: number, 
                            speedInMeterPerHour: number, 
                            timePassedInMilliseconds: number) {
  const speedInMeterPerMinutes = speedInMeterPerHour / 60; 
  const timePassedInMinutes = timePassedInMilliseconds / 1000 / 60; 
  return nextPositionFormula(positionInMeters, 
                             speedInMeterPerMinutes, 
                             timePassedInMinutes);
}

const platformPositionInMeters = 100;
const speedInMeterPerMinutes = 1;
const timePassedInMilliseconds = 500;

const newPlatformPositionInMeters = getCurrentPosition(platformPositionInMeters,
                                                       speedInMeterPerMinutes * 60,
                                                       timePassedInMilliseconds);

console.log(newPlatformPositionInMeters);
// Did you notice that the 'speedInMeterPerMinutes' converted to 'PerHour' 
// just to convert back to 'PerMinutes' for the formula API?
```

<br>
<br>
<br>

Well, who would want to know how to convert from decimeters to nautical miles?

```typescript
function nextPositionFormula(positionInMeters: number, 
                              speedInMeterPerMinutes: number, 
                              timePassedInMinutes: number) {
  return positionInMeters + (speedInMeterPerMinutes * timePassedInMinutes);
}

function getCurrentPosition(positionInDecimeter: number, 
                            speedInMeterPerHour: number, 
                            timePassedInMilliseconds: number) {
  const speedInMeterPerMinutes = speedInMeterPerHour / 60; 
  const timePassedInMinutes = timePassedInMilliseconds / 1000 / 60; 
  const positionInMeters = positionInDecimeter / 10;
  return nextPositionFormula(positionInMeters, 
                             speedInMeterPerMinutes, 
                             timePassedInMinutes);
}

const platformPositionInNauticalMiles = 15;
const speedInMeterPerMinutes = 1;
const timePassedInMilliseconds = 500;

const  platformPositionInDecimeter = platformPositionInNauticalMiles / 0.0000539956803455724;

const newPlatformPositionInMeters = getCurrentPosition(platformPositionInDecimeter,
                                                       speedInMeterPerMinutes * 60, 
                                                       timePassedInMilliseconds);

const newPlatformPositionInNauticalMiles = newPlatformPositionInMeters * 0.000539956803455724;

console.log(newPlatformPositionInNauticalMiles);
// Did you know that 1 decimeter is 0.0000539956803455724 nautical-miles?
```

<br>
<br>
<br>

This example demonstrates the awkwardness of having to use yards in a metric system.

```typescript
function nextPositionFormula(positionInYards: number, 
                             speedInYardsPerMinutes: number, 
                             timePassedInMinutes: number) {
  return positionInYards + (speedInYardsPerMinutes * timePassedInMinutes);
}

function getCurrentPosition(positionInYards: number,
                            speedInYardsPerMinutes: number, 
                            timePassedInMinutes: number) {
  return nextPositionFormula(positionInYards, 
                             speedInYardsPerMinutes, 
                             timePassedInMinutes);
}

const platformPositionInMeters = 15;
const speedInMeterPerMinutes = 1;
const timePassedInMinutes = 500;

const positionInYards = platformPositionInMeters / 0.9144;
const speedInYardsPerMinutes = speedInMeterPerMinutes / 0.9144;
    
const newPlatformPositionInYards = getCurrentPosition(positionInYards,
                                                      speedInYardsPerMinutes,
                                                      timePassedInMinutes);

const newPlatformPositionInMeters = newPlatformPositionInYards * 0.9144;

console.log(newPlatformPositionInMeters);
// Here we use the meters system, so why the 'getCurrentPosition' force to convert to yards units? 
```
<br>
<br>
<br>
<br>

## The solution

The [UnitsNET](https://github.com/angularsen/UnitsNet) library - the ultimate solution to unit conversion woes.


The awesome UnitsNet library provides a structure for units that's independent of the system. For instance, it offers a `Length` object that has properties for all unit variants such as meters, yards, and more.

Instead of using different variable names across the system, only the `Length` object is used, making it easier to manage conversions when it does required. 

When a specific unit system is required, such as when sending data to another system using an API, it's simple to obtain the correct value in the required unit system, and make it easy to understand later what is the system used for sending.


Let's take a look at some code examples:

```cs

var distanceFromUser = Length.FromMeters(1000)

void PrintDistance(Length distance)
{
  console.Writeline("The distance is " + distance.Kilometers + " km") // 1
}

PrintDistance(distanceFromUser);

``` 

UnitsNet's developers have done a remarkable job by using JSON-formatted declaration files to define units, making it easy for contributors to expand and enhance the library without hard-coding units in the code.

Because the developers of UnitsNet kept the definition files fully separate from the rest of the code, similar library can be generated for any ecosystem, not just the .Net ecosystem for which it was originally created.


Since many developers, including myself, use JS/TS and Python as their primary development ecosystems, I took on the challenge of building a similar library for TypeScript, Python, and now Go (30/01/25) based on the unit definitions provided by UnitsNet.


The [unitsnet-js](https://github.com/haimkastner/unitsnet-js) library available on NPM registry at [https://www.npmjs.com/package/unitsnet-js](https://www.npmjs.com/package/unitsnet-js)

The [unitsnet-py](https://github.com/haimkastner/unitsnet-py) library available on PyPi registry at [https://pypi.org/project/unitsnet-py](https://pypi.org/project/unitsnet-py)


The [unitsnet-go](https://github.com/haimkastner/unitsnet-go) library available on Go's package registry at [https://pkg.go.dev/github.com/haimkastner/unitsnet-go](https://pkg.go.dev/github.com/haimkastner/unitsnet-go).

All of these libraries use the Units.Net [unit definitions](https://github.com/angularsen/UnitsNet/tree/master/Common/UnitDefinitions) to generate the library units systems.


Once using the new approach for units, see how clear and simple it becomes:

In TypeScript:

```typescript
import { Length, Speed, Duration } from 'unitsnet-js';

function nextPositionFormula(position: Length, 
                             speed: Speed, 
                             timePassed: Duration) {
  return Length.FromMeters(position.Meters + (speed.MetersPerSecond * timePassed.Seconds));
}

function getCurrentPosition(position: Length, 
                            speed: Speed, 
                            timePassed: Duration) {
  return nextPositionFormula(position, speed, timePassed);
}

const platformPosition = Length.FromMeters(100);
const platformSpeed = Speed.FromMetersPerMinutes(1);
const timePassed = Duration.FromMicroseconds(500);

const newPlatform = getCurrentPosition(platformPosition, 
                                       platformSpeed, 
                                       timePassed);

console.log(newPlatform.Meters);
// Can you see that this is a way way better then before?
// All the code is clean and readable, and there are conversions only when it's necessary
```

And same in Python:

```python
from unitsnet_py import Length, Speed, Duration


def next_position_formula(position: Length, speed: Speed, timePassed: Duration):
    return Length.from_meters(
        position.meters + (speed.meters_per_second * timePassed.seconds)
    )


def get_current_position(position: Length, speed: Speed, timePassed: Duration):
    return next_position_formula(position, speed, timePassed)


platform_position = Length.from_meters(100)
platform_speed = Speed.from_meters_per_minutes(1)
time_passed = Duration.from_microseconds(500)
new_platform = get_current_position(platform_position, platform_speed, time_passed)

print(new_platform.meters)
```

And Go:
```go
package main

import (
    "fmt"
    "github.com/haimkastner/unitsnet-go/units"
)

func nextPositionFormula(position *units.Length, speed *units.Speed, timePassed *units.Duration) *units.Length {
	lf := units.LengthFactory{}
	next, _ := lf.FromMeters(position.Meters() + (speed.MetersPerSecond() * timePassed.Seconds()))
	return next
}

func getCurrentPosition(position *units.Length, speed *units.Speed, timePassed *units.Duration) *units.Length {
	return nextPositionFormula(position, speed, timePassed)
}

func main() {
	lf := units.LengthFactory{}
	sf := units.SpeedFactory{}
	df := units.DurationFactory{}
	platformPosition, _ := lf.FromMeters(100)
	platformSpeed, _ := sf.FromMetersPerMinutes(1)
	timePassed, _ := df.FromMicroseconds(500)
	newPlatform := getCurrentPosition(platformPosition, platformSpeed, timePassed)

	fmt.Println(newPlatform.Meters())
}
```

Enjoy!
