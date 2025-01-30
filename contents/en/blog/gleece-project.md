---
name: 'gleece-project'
title: Gleece - Rest API Development in Go
year: January 30th, 2025
color: '#8e7964'
id: 'gleece-project'
# trans: 'units-in-system'
description: The all-in-one Go framework for building, documenting, validating and securing REST APIs through code-first development
---

Gleece - REST API Development in GO

Following the recent articles about building and coding an I/S with [Services API](/en/blog/perfect-api-server-part-a), [Frontend](/en/blog/perfect-api-server-part-b), [SDK](/en/blog/perfect-api-server-part-d-sdk), etc.

The key point demonstrated was the high importance of enabling developers to easily write their own controllers as functions, define annotations, and have the build and CI/CD processes generate the specification standards, routing, validations, APIs, and SDKs from the source code itself - maintaining a single source of truth.

In the [previous articles](/en/blog/perfect-api-server-part-a), I have demonstrated how to achieve this using [TSOA](https://github.com/lukeautry/tsoa) for TypeScript with OpenAPI schema and tools.

The most amazing aspect of `TSOA`, from my point of view, is that unlike other frameworks, it focuses on the API development itself, and *FROM* it generates whatever is necessary (such as OpenAPI), instead of adjusting the API development structure to align with OpenAPI specifications.

Recently, we started working with Go, an amazing and well-designed programming language (unlike JS... XD), and we wanted to integrate it with our I/S and CI/CD processes.

However, despite there being great tools and frameworks to generate OpenAPI specs from code, validate payloads, and manage security, there was no tool that combined ALL these features together in a consolidated solution like `TSOA` offers for TypeScript.

Therefore, we decided to implement such a solution to provide the Golang community with the same powerful API development capabilities we had in the TypeScript ecosystem.

Our design considers the following:
- **Focus on ease of development** - create simple functions, add annotations, and you're ready to go
- **Easy & fault-safe security mechanism** - allows default policies, aborts & fails builds for missing route security, and one, unified simple function to be called with HTTP object and security checks to do authorization check.
- **Support for Go's standard validation with custom validation** - easily validate every aspect of the request, path, query, header, and struct content in API body
- **Generate specifications from the code** - supports OpenAPI specification 3.0 & 3.1 with an interface to add future versions
- **Effortless integration with common routes** - supports Gin & Echo routers for new and existing services, with easy ways to add support for other widely used router frameworks and allow customized router templates for any needed purpose
- **Easy error handling behavior** - uses [RFC7807](https://datatracker.ietf.org/doc/html/rfc7807) by default while allowing custom errors
- **Clean and clear route and HTTP properties declaration** - while allowing advanced usage with access to the HTTP context, set headers, status, etc.

We incorporated all these requirements into the `Gleece` project.

Gleece is designed to provide Go developers with all these capabilities.

How does it work? Let's GO:

**1 -** Create a Gin/Echo service in Go

**2 -** Write your controllers and structs, set annotations with all required info (HTTP request, response, headers, validations, documentation, security, etc.)

**3 -** Implement your security check function

**4 -** Define your Gleece configuration (OpenAPI version, router engine, security function package, output path, etc.)

**5 -** Run Gleece CLI to generate routes & API specifications

**6 -** Import generated routes and register them into your engine's router of choice

**7 -** Run your server


That's all.

Sounds good?

Go ahead and check out the [Gleece Repository](https://github.com/gopher-fleece/gleece) our [Step By Step](https://github.com/gopher-fleece/gleece/blob/main/docs/STEPBYSTEP.md) documentation and our complete [Gleece Service Example](https://github.com/gopher-fleece/gleecexample)

> 💡 Pro Tip: Install our [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=haim-kastner.gleece-extension) for a full coding viability support!

---
Special thanks to my colleague and friend [Yuval Pomerchik](https://github.com/yuval-po) for the initiative and massive contribution to this project.

