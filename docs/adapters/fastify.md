# Fastify

## Overview

Fastify is a web framework highly focused on providing the best developer experience with the least overhead and a powerful plugin architecture. It is inspired by Hapi and Express and is one of the fastest web frameworks for Node.js.

## Installation

To use Fastify with Storona, you need to install `fastify` & `@storona/fastify` packages:

::: code-group

```sh [npm]
$ npm install fastify storona @storona/fastify
```

```sh [yarn]
$ yarn add fastify storona @storona/fastify
```

```sh [pnpm]
$ pnpm add fastify storona @storona/fastify
```

```sh [bun]
$ bun add fastify storona @storona/fastify
```

:::

## Usage

In order to setup router, you need to create a Fastify app and pass it to the `createRouter` function:

```ts twoslash
import Fastify from "fastify";
import { createRouter } from "storona";
import { adapter } from "@storona/fastify";

const app = Fastify();

createRouter(app, {
  directory: "src/routes",
  adapter: adapter({
    // Set to true to use the package version. 1.0.0 -> /v1
    prefix: "/v1/api",
  }),
  quiet: false,
});

app.listen(
  {
    port: 3000,
  },
  () => {
    console.info("API running on port 3000");
  },
);
```

This will look for routes in the `src/routes` directory and create routes based on the file structure.

### Result

```
.
└─ src
   ├─ routes
   │  ├─ directory
   │  │  ├─ [fruit].get.js   --> GET  /v1/api/directory/:fruit
   │  │  └─ index.put.mjs    --> PUT  /v1/api/directory
   │  ├─ apple.post.ts       --> POST /v1/api/apple
   │  └─ index.get.jsx       --> GET  /v1/api
   └─ index.ts
```

Note that the routes can use any file extension, but the file structure must be consistent with the method and route.

## Example

For an example of `@storona/fastify` usage in a real-world application, see following repositories:

- The list is empty for now...

> [!NOTE]
> You can add your project to this list by submitting a pull request to the official repository!

## Supported Methods

Similar to Fastify, `@storona/fastify` supports all HTTP methods that Fastify instance app does:

- `GET` e.g. `src/routes/index.get.ts`
- `POST` e.g. `src/routes/index.post.ts`
- `PUT` e.g. `src/routes/index.put.ts`
- `DELETE` e.g. `src/routes/index.delete.ts`
- `PATCH` e.g. `src/routes/index.patch.ts`
- `OPTIONS` e.g. `src/routes/index.options.ts`
- `HEAD` e.g. `src/routes/index.head.ts`

## Signature Function

In order to declare a route, you need to export a function with the following signature:

```ts twoslash
import { define } from "@storona/fastify";

export default define((_request, reply) => {
  reply.send("Hello, World!");
});
```

The `define` function is a wrapper around the Fastify route handler. It provides a way to define a route handler in a more declarative way.

In case you want to strictly type the request and response objects, you can use the supported generic parameter of the `define` function:

```ts twoslash
import { define } from "@storona/fastify";

export default define<{
  Body: { name: string };
  Querystring: { id: string };
  Params: { id: string };
  Headers: { authorization: string };
  Reply: { message: string };
}>((request, reply) => {
  request.body.name; // string
  request.query.id; // string
  request.params.id; // string
  request.headers.authorization; // string
  reply.send({
    message: "Hello, World!",
  });
});
```

## Overrides

Fastify adapter allows overriding both of the variables - `route` and `method`.

For more information on how to override these variables, check [Export Overrides](/learning/export-overrides) documentation:

```ts twoslash
import { define } from "@storona/fastify";

export const route = "/hello";
export const method = "post";

export default define((_request, reply) => {
  reply.send("Hello, World!");
});
```

## Options

### Prefix

You can add a dynamic prefix to all routes by setting the `prefix` option:

```ts twoslash
import Fastify from "fastify";
import { createRouter } from "storona";
import { adapter } from "@storona/fastify";

const app = Fastify();

createRouter(app, {
  adapter: adapter({
    // prefix: false, // Default
    prefix: "/v2",
  }),
});
```

> [!TIP]
> Setting the `prefix` option to `true` will use the package.json's major version as a prefix. I.e. if the package.json version is `1.2.3`, the prefix will be `/v1`. This is a convenient way to version your API.
