# discord.js

## Overview

discord.js is a powerful Node.js module that allows you to interact with the Discord API. It provides a rich set of abstractions for building bots and event-driven integrations.

## Installation

To use discord.js with Storona, you need to install `discord.js` & `@storona/discord.js` packages:

::: code-group

```sh [npm]
$ npm install discord.js storona @storona/discord.js
```

```sh [yarn]
$ yarn add discord.js storona @storona/discord.js
```

```sh [pnpm]
$ pnpm add discord.js storona @storona/discord.js
```

```sh [bun]
$ bun add discord.js storona @storona/discord.js
```

:::

## Usage

In order to setup router, you need to create a Discord client and pass it to the `createRouter` function:

```ts twoslash
import { Client, GatewayIntentBits } from "discord.js";
import { createRouter } from "storona";
import { adapter } from "@storona/discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

await createRouter(client, {
  directory: "src/routes",
  adapter: adapter({
    registerCommands: true,
  }),
  quiet: false,
});

await client.login(process.env.DISCORD_TOKEN);
```

This will look for routes in the `src/routes` directory and create routes based on the file structure.

### Result

```
.
└─ src
   ├─ routes
   │  ├─ admin
   │  │  └─ ban.command.ts           --> COMMAND  /admin ban
   │  ├─ hello.command.ts            --> COMMAND  /hello
   │  ├─ index.client_ready.ts       --> CLIENT_READY
   │  └─ index.message_create.ts     --> MESSAGE_CREATE
   └─ index.ts
```

Note that the routes can use any file extension, but the file structure must be consistent with the method and route.

## Example

For an example of `@storona/discord.js` usage in a real-world application, see following repositories:

- The list is empty for now...

> [!NOTE]
> You can add your project to this list by submitting a pull request to the official repository!

## Supported Methods

Adapter supports `command` and all [discord.js client events](https://discord.js.org/docs/packages/discord.js/14.25.1/Events:Enum) in snake_case.

Some examples:

- `client_ready` e.g. `src/routes/index.client_ready.ts`
- `interaction_create` e.g. `src/routes/index.interaction_create.ts`
- `message_create` e.g. `src/routes/index.message_create.ts`
- `guild_member_add` e.g. `src/routes/index.guild_member_add.ts`
- `guild_member_remove` e.g. `src/routes/index.guild_member_remove.ts`
- `voice_state_update` e.g. `src/routes/index.voice_state_update.ts`

## Signature Function

In order to declare a route, you need to export a function with the following signature:

```ts twoslash
import { define } from "@storona/discord.js";

export default define<"message_create">(message => {
  message.reply("Hello, World!");
});
```

The `define` function is a wrapper around the discord.js event handler. It provides a way to define a route handler in a more declarative way.

In case you want to strictly type the event payload, you can use the supported generic parameter of the `define` function:

```ts twoslash
import { define } from "@storona/discord.js";

export default define<"message_create">(message => {
  message.author;
});
```

> [!NOTE]
> All examples use generics on define to keep payloads typed and avoid implicit any errors in docs builds.

## Overrides

discord.js adapter allows overriding both of the variables - `route` and `method`.

For more information on how to override these variables, check [Export Overrides](/learning/export-overrides) documentation:

```ts twoslash
import { define } from "@storona/discord.js";

export const route = "/hello";
export const method = "interaction_create";

export default define<"interaction_create">(interaction => {
  if (!interaction.isChatInputCommand()) return;
  interaction.reply("Hello, World!");
});
```

## Options

### registerCommands

You can register slash commands automatically by setting the `registerCommands` option:

```ts twoslash
import { Client, GatewayIntentBits } from "discord.js";
import { createRouter } from "storona";
import { adapter } from "@storona/discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

await createRouter(client, {
  adapter: adapter({
    registerCommands: true,
  }),
});
```

## Command Requisites

When `registerCommands` is enabled, command routes must provide description, and can optionally define other command fields:

```ts twoslash
import { define } from "@storona/discord.js";
import { ApplicationCommandOptionType } from "discord.js";

export const description = "Greets the user";
export const options = [
  {
    type: ApplicationCommandOptionType.String,
    name: "name",
    description: "Name to greet",
    required: true,
  },
];
export const dmPermission = true;
export const nsfw = false;

export default define<"command">(interaction => {
  interaction.reply("Hello!");
});
```

### Guild Only Commands

If you want a command to be registered only in specific guilds, provide a list of guild IDs:

```ts twoslash
import { define } from "@storona/discord.js";

export const description = "Greets the user";
export const guildOnly = ["123456789012345678"];

export default define<"command">(interaction => {
  interaction.reply("Hello!");
});
```
