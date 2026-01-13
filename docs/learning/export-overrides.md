# Export Overrides

## Overview

All of the storona adapters follow the same rules for exporting routes. Storona API exposes 2 variables that can be overriden in order to add missing functionality or to change the default behavior.

These variables are `route` and `method`.

> [!IMPORTANT]
> Files with overriden variables must start with `!` to indicate that the route is overriden. For more information, see [Route Overriding](/learning/rules-of-architecture#route-overriding).

## Overriding Route

[In some cases](/guide/introduction#limitations) developer may want to override the route of the file-based routing. This can be done by exporting a `route` variable in the route file:

::: code-group

```ts [routes/other-fruits/!apple.get.ts]
import { define } from "@storona/express";

export const route = "/banana";

export default define((_req, res) => {
  res.send("Hello world!");
});
```

:::

In the above example, the route of the file is `/banana` instead of `/other-fruits/apple`.

Sometimes overriding a route is necessary to catch multiple routes or a similar pattern. For example `@storona/express` adapter allows developers to define a regular expression as a route:

::: code-group

```ts [routes/!catch-foobar.get.ts]
import { define } from "@storona/express";

export const route = /foo|bar/;

export default define((_req, res) => {
  res.send("Caught foobar!");
});
```

:::

## Overriding Method

Some adapters allow developers to use multiple methods in a single handler. For example, `@storona/grammy` adapter allows developers to define an array of methods to catch multiple events:

::: code-group

```ts [routes/!catch-foobar.message.ts]
import { define } from "@storona/grammy";

export const method = ["message", "edited_message"];

export default define(ctx => {
  if (/foo|bar/.test(ctx.msg?.text ?? "")) {
    ctx.reply("Caught foobar!");
  }
});
```

:::

In the above example, the handler will be called for both `message` and `edited_message` events.
