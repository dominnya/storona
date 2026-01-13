# Custom Adapter

## Overview

Custom adapters allow you to extend the functionality of the SDK by adding an ability to interact with certain environments. This guide will walk you through the process of creating a custom adapter.

The adapter is a function that consists of so-called hooks. Each hook is a function that is called at a certain point in the lifecycle of the adapter.

## Creating a Custom Adapter

Storona exports all of the essential types and functions via `storona/adapter` scope.

To create a custom adapter, you need to call `createAdapter` function and pass an object with hooks as an argument:

```ts
import { createAdapter } from "storona/adapter";

export const adapter = createAdapter((instance, opts = {}) => {
  // instance - instance of the adapter e.g. express app
  // opts - options passed to the adapter

  return {
    // Version of Storona API, it is always "1.0.0"
    version: "1.0.0",
    on: {
      // Called once adapter is initialized by storona itself
      init: () => {},
      // Parse route path structure (route + method)
      route: structure => structure,
      // Registering a route by the provided instance
      register: importData => {},
      // Called once all routes were registered
      ready: status => {},
    },
  };
});
```

The `createAdapter` function returns an object with hooks that will be called at a certain point in the lifecycle of the adapter.

> [!TIP]
> It is safe to throw exceptions in the hooks, they will be caught by Storona and logged to the console.

### On Init

The `init` hook is called once the adapter is initialized by Storona itself:

```ts
init: () => {
  // ...
},
```

### On Route

The `route` hook is called to parse/modify the route path structure (route + method):

```ts
route: (structure) => {
  // Do the validation here
  // Always return the modified structure
  return structure;
},
```

### On Register

The `register` hook is called to register a route by the provided instance:

```ts
register: (importData) => {
  // ...
  console.log(importData.route, importData.method, importData.handler);
  // To access all the imports, use importData.data object
},
```

### On Ready

The `ready` hook is called once all routes were registered. It receives a status array with register/unregistered routes:

```ts
ready: (status) => {
  // ...
},
```

For more information regarding status array, see [returned value of createRouter](/reference/config#quiet)

## Defining Types

To define types for the adapter, you can use generic types:

```ts
import { createAdapter } from "storona/adapter";
import type { Express } from "express";

// Handler
type H = () => void;

// Methods
type M = "get" | "post" | "put" | "delete";

// Route
type R = string | RegExp;

// Instance
type I = Express;

// Options
type O = {
  prefix?: string;
};

export const adapter = createAdapter<H, M, R, I, O>(
  (instance, opts = {}) => {
    // ...
  },
);
```

As you can see, you can define types for handler, method, route, instance, and options. These types will be used in various parts of the adapter.

## Defining a Signature Function

You're free to define a signature function however you want, except it should be named `define` for more consistent usage:

```ts
// Handler
type H = () => void;

export function define(cb: H): H {
  return cb;
}
```

Signature function should return the handler type. It is used to define the handler in the route.

## Publishing Adapter Package

If you're willing to publish the adapter as a package, you need to export 2 functions - adapter & define:

```ts
import { createAdapter } from "storona/adapter";

export const adapter = createAdapter((instance, opts = {}) => {
  // ...
});

type H = () => void;

export function define(cb: H): H {
  return cb;
}
```

After that add `storona` as a peer dependency in the `package.json`:

```json
{
  "peerDependencies": {
    "storona": "^1.0.0"
  }
}
```

This is essentially all you need to publish the adapter as a package.

## Using the Custom Adapter

To use a custom adapter, you need to pass it to `adapter` field:

::: code-group

```ts [index.ts]
import { createRouter } from "storona";
import { adapter } from "./adapter";

// Instance of the adapter
const app = {};

await createRouter(app, {
  directory: "routes",
  adapter: adapter({
    // ...opts here
  }),
});
```

```ts [routes/hello.get.ts]
import { define } from "./adapter";

export default define(() => {});
```

:::

## Example

For more detailed information, see the implementation of Express adapter in the [official repository](https://github.com/dominnya/storona/blob/master/packages/express/src/adapter.ts).
