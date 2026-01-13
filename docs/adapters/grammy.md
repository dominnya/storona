# grammY

## Overview

grammY is a modern framework for building Telegram bots. It is designed to be simple to use, efficient in performance, and easy to extend.

## Installation

To use grammY with Storona, you need to install `grammy` & `@storona/grammy` packages:

::: code-group

```sh [npm]
$ npm install grammy storona @storona/grammy
```

```sh [yarn]
$ yarn add grammy storona @storona/grammy
```

```sh [pnpm]
$ pnpm add grammy storona @storona/grammy
```

```sh [bun]
$ bun add grammy storona @storona/grammy
```

:::

## Usage

In order to setup router, you need to initialize a bot and pass it to the `createRouter` function:

```ts twoslash
import { Bot } from "grammy";
import { createRouter } from "storona";
import { adapter } from "@storona/grammy";

const bot = new Bot("[YOUR TOKEN]");

// Await router first, before starting the bot
await createRouter(bot, {
  directory: "src/routes",
  adapter: adapter({
    // Set to false, if you want storona to not register command list
    setMyCommands: true,
  }),
  quiet: false,
});

bot.start();
```

This will look for routes in the `src/routes` directory and create routes based on the file structure.

### Result

> [!WARNING]
> Since telegram does not support subcommands, commands will be registered based on the file name rather than the file structure.
>
> For example, the file `src/routes/directory/help.command.ts` will be registered as `/help` command.

```
.
└─ src
   ├─ routes
   │  ├─ directory
   │  │  ├─ help.command.ts          --> COMMAND  /help
   │  │  └─ index.inline_query.mjs   --> INLINE_QUERY
   │  ├─ apple.message.js            --> MESSAGE
   │  └─ index.hears.jsx             --> HEARS
   └─ index.ts
```

Note that the routes can use any file extension, but the file structure must be consistent with the method and route.

## Example

For an example of `@storona/grammy` usage in a real-world application, see following repositories:

- The list is empty for now...

> [!NOTE]
> You can add your project to this list by submitting a pull request to the official repository!

## Supported Methods

Adapter supports `command` and `hears` filter as well as all [L1 queries](https://grammy.dev/guide/filter-queries#the-query-language):

- `message` e.g. `src/routes/index.message.ts`
- `edited_message` e.g. `src/routes/index.edited_message.ts`
- `channel_post` e.g. `src/routes/index.channel_post.ts`
- `edited_channel_post` e.g. `src/routes/index.edited_channel_post.ts`
- `business_connection` e.g. `src/routes/index.business_connection.ts`
- `business_message` e.g. `src/routes/index.business_message.ts`
- `edited_business_message` e.g. `src/routes/index.edited_business_message.ts`
- `deleted_business_messages` e.g. `src/routes/index.deleted_business_messages.ts`
- `message_reaction` e.g. `src/routes/index.message_reaction.ts`
- `message_reaction_count` e.g. `src/routes/index.message_reaction_count.ts`
- `inline_query` e.g. `src/routes/index.inline_query.ts`
- `chosen_inline_result` e.g. `src/routes/index.chosen_inline_result.ts`
- `callback_query` e.g. `src/routes/index.callback_query.ts`
- `shipping_query` e.g. `src/routes/index.shipping_query.ts`
- `pre_checkout_query` e.g. `src/routes/index.pre_checkout_query.ts`
- `poll` e.g. `src/routes/index.poll.ts`
- `poll_answer` e.g. `src/routes/index.poll_answer.ts`
- `my_chat_member` e.g. `src/routes/index.my_chat_member.ts`
- `chat_member` e.g. `src/routes/index.chat_member.ts`
- `chat_join_request` e.g. `src/routes/index.chat_join_request.ts`
- `chat_boost` e.g. `src/routes/index.chat_boost.ts`
- `removed_chat_boost` e.g. `src/routes/index.removed_chat_boost.ts`
- `purchased_paid_media` e.g. `src/routes/index.purchased_paid_media.ts`

## Signature Function

In order to declare a route, you need to export a function with the following signature:

```ts twoslash
import { define } from "@storona/grammy";

export default define(ctx => {
  ctx.reply("Hello, World!");
});
```

The `define` function is a wrapper around the grammY route handler. It provides a way to define a route handler in a more declarative way.

In case you want to strictly type the context object, you can use the supported generic parameter of the `define` function:

::: code-group

```ts twoslash [Typed Query]
import { define } from "@storona/grammy";

// Explicitly define the query type
export default define<"edited_message">(ctx => {
  ctx.update.edited_message; // not undefined
});
```

```ts twoslash [Default]
import { define } from "@storona/grammy";

export default define(ctx => {
  ctx.update.edited_message; // can be undefined
});
```

```ts twoslash [L2/L3 Query]
import { define } from "@storona/grammy";

export default define<"message:entities:mention">(ctx => {
  ctx.update.message.entities; // not undefined
});
```

```ts twoslash [Multiple Queries]
import { define } from "@storona/grammy";

export const method = ["channel_post", ":forward_origin"];

export default define<"channel_post" | ":forward_origin">(ctx => {
  ctx.update.channel_post; // not undefined
  ctx.update.message?.forward_origin; // not undefined
});
```

:::

## Overrides

grammY adapter allows overriding both of the variables - `route` and `method`.

For more information on how to override these variables, check [Export Overrides](/learning/export-overrides) documentation:

```ts twoslash
import { define } from "@storona/grammy";

export const route = "/hello";
export const method = "command";

export default define(ctx => {
  ctx.reply("Hello, World!");
});
```

### Command Requisites

In case you want to register commands via `setMyCommands`, grammY adapter supports defining command requisites:

::: code-group

```ts twoslash [src/routes/en/hello.command.ts]
import { define } from "@storona/grammy";

export const description = "Greets the user";
export const scope = "all_private_chats";

export default define(ctx => {
  ctx.reply("Hello!");
});
```

:::

This way you can set the command description and scope, which will be used when registering the command via `setMyCommands`.

#### Scope Values

Besides the default scope values, you can use the following values:

- `default` - The default scope value, accessible in all chats
- `all_private_chats` - The command is available in all private chats
- `all_group_chats` - The command is available in all group chats
- `all_chat_administrators` - The command is available to all chat administrators
- `chat:[number or @string]` - The command is available in the specified chat
  - `chat:123456789`
  - `chat:@chatname`
- `chat_administrators:[number or @string]` - The command is available to chat administrators in the specified chat
  - `chat_administrators:123456789`
  - `chat_administrators:@chatname`
- `chat_member:[number or @string]:[number]` - The command is available to the specified chat member in the specified chat
  - `chat_member:123456789:987654321` - Chat member with the ID `987654321` in the chat with the ID `123456789`
  - `chat_member:@chatname:987654321` - Chat member with the ID `987654321` in the chat with the tag `@chatname`

## Options

### setMyCommands

You can register a command list based on the [command exported variables](#command-requisites). This is done by setting the `setMyCommands` option to `true`:

```ts twoslash
import { Bot } from "grammy";
import { createRouter } from "storona";
import { adapter } from "@storona/grammy";

const bot = new Bot("[YOUR TOKEN]");

// Await router first, before starting the bot
await createRouter(bot, {
  directory: "src/routes",
  adapter: adapter({
    // Default value is true
    setMyCommands: true,
  }),
  quiet: false,
});

bot.start();
```
