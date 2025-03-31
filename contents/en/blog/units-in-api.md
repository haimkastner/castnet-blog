---
name: 'units-in-api'
title: API, Units, and Quantities
year: March 30th, 2025
color: '#8e7964'
id: 'units-in-api'
description: "API, Units, and Quantities: Building Unit-Agnostic Integrations."
---

Anyone who has ever designed an API involving units of measurement has faced the same dilemma: which unit of measurement should we choose?

It may seem trivial, but it isn’t.

When two components communicate via an API, one using the metric system and the other using the imperial system, what unit should the API adopt? Should we enforce a standard? (Do we even want one?) And where should we handle all the necessary conversions?

This issue extends beyond just API conventions, it affects the API schema itself. For example, naming a field `theDistanceInKilometers` feels awkward, we want to simply call it `theDistance`. But if we do, we risk the consumer misunderstanding our intent. Relying solely on documentation for such a fundamental aspect of our API is far from ideal.

We want our API to express distances clearly, without being concerned about whether the value is in meters or miles. Distance is distance, and the same principle applies to other units. We want to work with angles, not degrees, and speeds, not kilometers per hour. But... don’t we have to choose a specific unit?

What if I told you that you don’t?

You don’t need to convert anything, and each service doesn’t need to know or assume how the other operates, all while keeping the API readable and easy to use.

How? Let's dive deeper into this "problem."

### The Problem Goes Beyond APIs

This issue isn’t limited to APIs, it affects our codebase logic as well.

When we calculate distances, we use formulas that don’t inherently depend on specific units. However, because formulas are usually defined once and used in multiple places (or in external libraries), their APIs are often written with a specific measurement in mind (e.g., requiring an integer representing meters). As a result, we must deal with frequent unit conversions. We need to specify whether a variable’s value is in meters, kilometers, miles, or knots and perform conversions as necessary.

This makes development clunky and error-prone.

Instead of simply declaring a `distance` variable, we often end up with `distanceInMeters`, `distanceInMiles`, etc. Otherwise, there’s no way to determine what unit a function expects or returns.

As a result, different parts of the codebase use different units, leading to a tangled mess of endless conversions. Even if we standardize our measurement system, integrating external libraries still forces us to convert values back and forth, making our code unnecessarily complex at best and introducing hard-to-detect conversion bugs at worst (you end up with garbage values, and who can track down exactly where the conversion went wrong or was performed incorrectly?)

And that’s all assuming everything is well-documented and well-named.

Unfortunately, this isn’t always the case. When documentation is lacking, troubleshooting and debugging become even harder.

### What Do We Really Want?

We want to treat units as abstract types rather than specific representations.

Just as we use integers without worrying about whether they’re little or big endian in the memory, we should be able to work with `Length`, `Angle`, `Speed`, and other unit types in a similar manner.

Internally, our code should only interact with these abstract unit types. The specific representation should be determined only when interacting with external systems. For example, when calling a third-party library, we can "expose" the specific measurement value from the unit. Similarly, when receiving data, we should immediately "import" it into our internal unit representation.

This approach eliminates the need for manual conversions, making our codebase cleaner, more readable, easier to debug and most important can be trusted.

## Meet the UnitsNet Project

The [UnitsNet](https://github.com/angularsen/UnitsNet) project was created to address precisely this problem in software engineering.

It provides an extensive collection of units and quantities, represented as simple objects with a straightforward API. You can create a unit object from any quantity and retrieve its value in any other quantity.

One of the most powerful aspects of UnitsNet is its [definitions JSON](https://github.com/angularsen/UnitsNet/tree/master/Common/UnitDefinitions), which includes almost every imaginable measurement - length, angle, duration, temperature, mass, information, volume-flow-per-area (yes, [really](https://github.com/angularsen/UnitsNet/blob/master/Common/UnitDefinitions/VolumeFlowPerArea.json)), and many more. There are over 100 unit categories, even including [Mars time](https://github.com/angularsen/UnitsNet/blob/a37871a639d85c56d1ae7ef971b83c06728e1097/Common/UnitDefinitions/Duration.json#L159) for durations!

From these definitions, the generators produce unit objects for various programming languages:

- C# - [github.com/angularsen/UnitsNet](https://github.com/angularsen/UnitsNet)
- TypeScript - [github.com/haimkastner/unitsnet-js](https://github.com/haimkastner/unitsnet-js)
- Python - [github.com/haimkastner/unitsnet-py](https://github.com/haimkastner/unitsnet-py)
- Golang - [github.com/haimkastner/unitsnet-go](https://github.com/haimkastner/unitsnet-go)

All implementations share the same definitions and provide a similar API, with minor adjustments to fit each language’s conventions.

For this article, we’ll focus on Golang, though the same concepts apply to other implementations.

### How It Works

```go
func FormulaLogic(angle *units.Angle) *units.Angle {
  // TODO: Perform whatever necessary with the Angle instance
  return angle;
}

func main() {
  // An "Angle" to be used across the codebase 
  var angle *units.Angle

  // Create an angle from a degree number
  angle, _ = units.AngleFactory{}.FromDegrees(180)

  // Use the "Angle" object throughout the codebase
  angle = FormulaLogic(angle)

  // Extract a specific quantity from the Angle when necessary
  log.Println(angle.Radians()) // 3.141592653589793
}

```

As demonstrated, the `Angle` unit is created in a very clear way, no one can miss what the input represents (...) then in the codebase the angle object is only used. 

> The object even supports arithmetic operations and comparisons directly on the unit (see package [docs](https://github.com/haimkastner/unitsnet-go/blob/main/README.md#additional-methods)).

The same clarity applies when exposing a specific quantity - it's loud & clear what the exposed value is.

## The API Solution

Back to API design...

So far, we’ve addressed units handling in code, but what about API design? We still need to specify a concrete unit for numeric values in JSON (or other textual formats). we still have to specify a field like `lengthInMeters` for unit representations.

The solution? A **unit DTO (Data Transfer Object)** that includes both the value and its unit of measurement.

This allows the API to accept and return values in any unit, as long as the unit is explicitly specified.

For example:

```json
{
  "value": 1000,
  "unit": "Meter"
}
```

is equivalent to:

```json
{
  "value": 1,
  "unit": "Kilometer"
}
```

Both representations convey the same distance using the same specification schema, making the API clear, readable, and flexible.

And the best part, using Unitsnet, handling these DTOs is seamless. You can simply call `FromDTO()` to parse raw JSON into a unit object and `ToDTO()` to convert a unit object back into a structured JSON format with even an option to specify the desired representation.

## Integrating UnitsNet with API Routing and Specification

The final step is linking the DTO representation with API routing and specifications.

Once this is set up, developers only need to use DTOs in their API handlers, without worrying about the underlying units.

Let’s see this in action using **unitsnet-go** and **Gleece**.

> [Gleece](https://github.com/gopher-fleece/gleece) is a tool for defining API routes and OpenAPI specifications directly from controller functions maintained by article author [Haim Kastner](https://github.com/haimkastner) & [Yuval Pomerchik](https://github.com/yuval-po).

### Example API: Handling Lengths

In this example, we’ll create an API that accepts a `Length` in the request body and returns a processed `Length`, optionally represented by specified unit via a query parameter.

To achieve this, we simply import **unitsnet-go** and declare the route using **Gleece**.

```go
package controllers

import (
	"github.com/gopher-fleece/runtime"
	"github.com/haimkastner/unitsnet-go/units"
)

// UnitsController
// @Tag(Units) Units Operations
// @Route(/units)
// @Description The Units API Example
type UnitsController struct {
	runtime.GleeceController // Embedding the GleeceController to inherit its methods
}

// The LengthFactory object to create the Length objects
var lf = units.LengthFactory{}

// @Description Post unit API and return the processed unit
// @Method(POST)
// @Route(/post-unit)
// @Body(data) The unit to process
// @Response(200) The response with the processed unit
// @ErrorResponse(500) The error when process failed
func (ec *UnitsController) TestUnit(data units.LengthDto) (units.LengthDto, error) {
	// The unit to be processed
	var unit *units.Length

	// Load the unit from the DTO
	unit, _ = lf.FromDto(data)

	// TODO: Process the unit (logic here)

	// Return the processed unit
	return unit.ToDto(), nil
}
```

As you can see, **zero conversions** are needed, resulting in clean, human-readable code.

The OpenAPI specification generated by Gleece from this controller is clear, easy to understand, and straightforward to both produce and consume. You can simply use whatever unit works best in your API consumers.

```yaml
components:
  schemas:
    LengthDto:
      description: >-
        LengthDto represents a Length measurement with a numerical value and its
        corresponding unit.
      properties:
        unit:
          $ref: '#/components/schemas/LengthUnits'
        value:
          description: Value is the numerical representation of the Length.
          type: number
      required:
        - unit
      title: LengthDto
      type: object
    LengthUnits:
      description: LengthUnits defines various units of Length.
      enum:
        - Meter
        - Mile
        - Yard
        - Foot
        - UsSurveyFoot
        - Inch
        - Mil
        - NauticalMile
        - Fathom
        - Shackle
        - Microinch
        - PrinterPoint
        - DtpPoint
        - PrinterPica
        - DtpPica
        - Twip
        - Hand
        - AstronomicalUnit
        - Parsec
        - LightYear
        - SolarRadius
        - Chain
        - Angstrom
        - DataMile
        - Femtometer
        - Picometer
        - Nanometer
        - Micrometer
        - Millimeter
        - Centimeter
        - Decimeter
        - Decameter
        - Hectometer
        - Kilometer
        - Megameter
        - Gigameter
        - Kiloyard
        - Kilofoot
        - Kiloparsec
        - Megaparsec
        - KilolightYear
        - MegalightYear
      title: LengthUnits
      type: string
    Rfc7807Error:
      description: A standard RFC-7807 error
      properties:
        detail:
          description: >-
            A human-readable explanation specific to this occurrence of the
            problem.
          type: string
        error:
          description: Error message
          type: string
        extensions:
          description: Additional metadata about the error.
          type: object
        instance:
          description: >-
            A URI reference that identifies the specific occurrence of the
            problem.
          type: string
        status:
          description: >-
            The HTTP status code generated by the origin server for this
            occurrence of the problem.
          type: integer
        title:
          description: A short, human-readable summary of the problem type.
          type: string
        type:
          description: A URI reference that identifies the problem type.
          type: string
      required:
        - type
        - title
        - status
      title: Rfc7807Error
      type: object
info:
  contact:
    email: hello@haim-kastner.com
    name: API Support
    url: https://github/haimkastner/go-api-units-example/issues
  description: This is a simple example of a Go API using the Gleece & unitsnet-go packages
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT
  title: Go API Units Example
  version: 1.0.0
openapi: 3.0.0
paths:
  /units/post-unit:
    post:
      description: Post unit API and return the processed unit
      operationId: TestUnit
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LengthDto'
        description: The unit to process
        required: true
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LengthDto'
          description: The response with the processed unit
        '500':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Rfc7807Error'
          description: The error when process failed
        default:
          description: ''
      security: []
      summary: Post unit API and return the processed unit
      tags:
        - Units
servers:
  - url: https://units-api.gleece.dev
```

As we've demonstrated, when using unit DTOs, our code remains fully agnostic to the unit quantities sent by consumers, while the specification is clear and allows sending any data format. 

However, if a consumer isn't using unit DTOs and requires a consistent unit, that's easy to accommodate as well.

Let's see an adjustment to our previous example, adding just one more optional query parameter:

```go
package controllers

import (
	"github.com/gopher-fleece/runtime"
	"github.com/haimkastner/unitsnet-go/units"
)

// UnitsController
// @Tag(Units) Units Operations
// @Route(/units)
// @Description The Units API Example
type UnitsController struct {
	runtime.GleeceController // Embedding the GleeceController to inherit its methods
}

// The LengthFactory object to create the Length objects
var lf = units.LengthFactory{}

// @Description Post unit API and return the processed unit
// @Method(POST)
// @Route(/post-unit)
// @Query(responseQuantity) The unit to be used in response - optional
// @Body(data) The unit to process
// @Response(200) The response with the processed unit
// @ErrorResponse(500) The error when process failed
func (ec *UnitsController) TestUnit(responseQuantity *units.LengthUnits, data units.LengthDto) (units.LengthDto, error) {
	// The unit to be processed
	var unit *units.Length

	// Load the unit from the DTO
	unit, _ = lf.FromDto(data)

	// TODO: Process the unit (logic here)

	// Return the processed unit
	return unit.ToDto(responseQuantity), nil
}
```

In this case, whenever the consumer wants the DTO to use a consistent unit quantity, it's very simple to provide it. Again, without any need for conversions of any kind.

The full example with live demo using OpenAPI 3.0.0 specification, and service implementation of the above code is available at [units-docs.gleece.dev](https://units-docs.gleece.dev/)

Check out also the complete example codebase: [go-api-units-example](https://github.com/haimkastner/go-api-units-example)

## Conclusion

Declaring and handling units in general, and especially in APIs, should not be a hassle. By using tools that follow the basic principle of treating units as abstract entities rather than specific representations, we can greatly simplify our code and APIs allowing readable, clear and easy to work with API.

