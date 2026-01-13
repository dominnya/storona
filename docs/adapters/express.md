# Express

## Overview

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It is designed to make the process of building APIs and web applications much simpler and easier.

It's considered to be standard for Node.js applications and is widely used in the industry.

## Installation

To use Express with Storona, you need to install `express` & `@storona/express` packages:

::: code-group

```sh [npm]
$ npm install express storona @storona/express
```

```sh [yarn]
$ yarn add express storona @storona/express
```

```sh [pnpm]
$ pnpm add express storona @storona/express
```

```sh [bun]
$ bun add express storona @storona/express
```

:::

## Usage

In order to setup router, you need to create an Express app and pass it to the `createRouter` function:

```ts twoslash
import express from "express";
import { createRouter } from "storona";
import { adapter } from "@storona/express";

const app = express();

createRouter(app, {
  directory: "src/routes",
  adapter: adapter({
    // Set to true to use the package version. 1.0.0 -> /v1
    prefix: "/v1/api",
  }),
  quiet: false,
});

app.listen(3000, () => {
  console.info("API running on port 3000");
});
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

For an example of `@storona/express` usage in a real-world application, see following repositories:

- [Gym Service API](https://github.com/dominnya/gym-backend)

> [!NOTE]
> You can add your project to this list by submitting a pull request to the official repository!

## Supported Methods

Similar to Express, `@storona/express` supports all HTTP methods that Express instance app does:

- `GET` e.g. `src/routes/index.get.ts`
- `POST` e.g. `src/routes/index.post.ts`
- `PUT` e.g. `src/routes/index.put.ts`
- `DELETE` e.g. `src/routes/index.delete.ts`
- `PATCH` e.g. `src/routes/index.patch.ts`
- `OPTIONS` e.g. `src/routes/index.options.ts`
- `HEAD` e.g. `src/routes/index.head.ts`
- `ALL` e.g. `src/routes/index.all.ts` (matches all HTTP methods)

## Signature Function

In order to declare a route, you need to export a function with the following signature:

```ts twoslash
import { define } from "@storona/express";

export default define((req, res) => {
  res.send("Hello, World!");
});
```

The `define` function is a wrapper around the Express route handler. It provides a way to define a route handler in a more declarative way.

In case you want to strictly type the request and response objects, you can use the supported generic parameter of the `define` function:

```ts twoslash
import { define } from "@storona/express";

export default define<{
  ReqBody: { name: string };
  ReqQuery: { id: string };
  Params: { id: string };
  Locals: { user: string };
  ResBody: { message: string };
}>((req, res) => {
  req.body.name; // string
  req.query.id; // string
  req.params.id; // string
  res.locals.user; // string
  res.json({
    message: "Hello, World!",
  });
});
```

> [!NOTE]
> Such names as `ReqBody`, `ReqQuery`, `Params`, `Locals`, and `ResBody` are inherited from the Express' generic parameters.

## Overrides

Express adapter allows overriding both of the variables - `route` and `method`.

For more information on how to override these variables, check [Export Overrides](/learning/export-overrides) documentation:

```ts twoslash
import { define } from "@storona/express";

export const route = "/hello";
export const method = "post";

export default define((_req, res) => {
  res.send("Hello, World!");
});
```

## Options

### Prefix

You can add a dynamic prefix to all routes by setting the `prefix` option:

```ts twoslash
import express from "express";
import { createRouter } from "storona";
import { adapter } from "@storona/express";

const app = express();

createRouter(app, {
  adapter: adapter({
    // prefix: false, // Default
    prefix: "/v2",
  }),
});
```

> [!TIP]
> Setting the `prefix` option to `true` will use the package.json's major version as a prefix. I.e. if the package.json version is `1.2.3`, the prefix will be `/v1`. This is a convenient way to version your API.
