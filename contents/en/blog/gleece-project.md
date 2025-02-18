---
name: 'gleece-project'
title: Gleece - Rest API Development in Go
year: January 30th, 2025
color: '#8e7964'
id: 'gleece-project'
# trans: 'units-in-system'
description: The all-in-one Go tool for building, documenting, validating and securing REST APIs through code-first development
---

Following the recent articles about building and coding an I/S with [Services API](/en/blog/perfect-api-server-part-a), [Frontend](/en/blog/perfect-api-server-part-b), [SDK](/en/blog/perfect-api-server-part-d-sdk), etc.

The key point demonstrated was the high importance of enabling developers to easily write their own controllers as functions, define annotations, and have the build and CI/CD processes generate the specification standards, routing, validations, APIs, and SDKs from the source code itself - maintaining a single source of truth.

In the [previous articles](/en/blog/perfect-api-server-part-a), I have demonstrated how to achieve this using [TSOA](https://github.com/lukeautry/tsoa) for TypeScript with OpenAPI schema and tools.

The most amazing aspect of `TSOA`, from my point of view, is that unlike other frameworks, it focuses on the API development itself, and *FROM* it generates whatever is necessary (such as OpenAPI), instead of adjusting the API development structure to align with OpenAPI specifications.

Recently, we started working with Go, an amazing and well-designed programming language (unlike JS... XD), and we wanted to integrate it with our I/S and CI/CD processes.

Coming from the TypeScript ecosystem, we were inspired by frameworks like `TSOA` that handle everything from routing and validation to OpenAPI generation - all from a single source of truth: your code.

And while these core features are amazing, `TSOA`'s true power lies in its flexibility - allowing easy customization for any real-world use-case while allowing bypassing the tool back to the native router when necessary.

Therefore, we decided to implement such a solution to provide the Golang community with the same powerful API development capabilities we had in the TypeScript ecosystem.

Our design considers the following:
- **Focus on ease of development** - create simple functions, add annotations, and you're ready to go
- **Easy & fault-safe security mechanism** - allows default policies, aborts & fails builds for missing route security, and one, unified simple function to be called with HTTP object and security checks to do authorization check.
- **Support for Go's standard validation with custom validation** - easily validate every aspect of the request, path, query, header, and struct content in API body
- **Generate specifications from the code** - supports OpenAPI specification 3.0 & 3.1 with an interface to add future versions
- **Effortless integration with common routers** - Supports all popular Go routers ([Gin](https://github.com/gin-gonic/gin), [Echo v4](https://github.com/labstack/echo), [Gorilla Mux](https://github.com/gorilla/mux), [Chi v5](https://github.com/go-chi/chi), and [Fiber v2](https://github.com/gofiber/fiber)) for both new and existing services. Easily extendable to support additional router frameworks through customizable router templates.
- **Easy error handling behavior** - uses [RFC7807](https://datatracker.ietf.org/doc/html/rfc7807) by default while allowing custom errors
- **Clean and clear route and HTTP properties declaration** - while allowing advanced usage with access to the HTTP context, set headers, status, etc.
- **Built for customization** - Designed to be highly customizable, supporting real-world specific service needs (e.g. integrating telemetry into generated routes with API-declared objects)
- **Extend, don't replace** - While providing powerful features, we ensure developers maintain access to the underlying context and can easily bypass the framework when needed


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

Go ahead and check out the [Gleece Repository](https://github.com/gopher-fleece/gleece) Gleece documentation [docs.gleece.dev](https://docs.gleece.dev/) and the complete [Gleece Service Example](https://github.com/gopher-fleece/gleecexample)

> 💡 Pro Tip: Install our [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=haim-kastner.gleece-extension) for a full coding viability support!

---
Special thanks to my colleague and friend [Yuval Pomerchik](https://github.com/yuval-po) for the initiative and massive contribution to this project.

