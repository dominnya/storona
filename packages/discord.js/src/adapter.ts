import type { MethodType, H, M, R, Options } from "@/types";
import {
  assertCommandData,
  assertExportedVariables,
  assertMethod,
} from "@/assert";
import type { Client } from "discord.js";
import { createAdapter } from "storona/adapter";
import { fallbackOptions } from "@/options";
import {
  createCommandRegistry,
  registerCommands,
  registerRoute,
  setupCommandHandler,
} from "@/register";

const assertCommandDepth = (endpoint: string) => {
  const parts = endpoint
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean);

  if (parts.length === 0) {
    throw new Error("Command name is not provided");
  }

  if (parts.length > 2) {
    throw new Error(
      "Cannot register subcommand with depth over 2 keywords",
    );
  }
};

/**
 * Discord.js adapter for Storona. Let's you define events in route files.
 *
 * @see {@link https://discord.js.org/ | Discord.js Documentation}
 * @see {@link https://storona.domin.zip/ | Storona Documentation}
 * @see {@link https://storona.domin.zip/adapters/discord.js | @storona/discord.js Documentation}
 */
export const adapter = createAdapter<H, M, R, Client, Options>(
  (client, opts = {}) => {
    // Fallback to default option set
    opts = fallbackOptions(opts);
    const registry = createCommandRegistry();

    return {
      // This is the version of the adapter API. It is used to ensure compatibility.
      // If the adapter API changes, the version should be bumped along with the necessary changes.
      version: "1.0.0",
      on: {
        init() {
          setupCommandHandler(client, registry);
        },
        route(structure) {
          assertMethod(structure.method);

          if (structure.method === "command") {
            assertCommandDepth(structure.endpoint);
          }

          return structure;
        },
        register(importData) {
          assertExportedVariables(importData);

          if (opts.registerCommands) {
            assertCommandData(importData);
          }

          registerRoute(client, importData, registry);
        },
        ready() {
          if (!opts.registerCommands) return;

          const run = () => {
            void registerCommands(client, registry);
          };

          // Fix: race condition when commands are registered before client is ready
          if (client.isReady()) {
            run();
            return;
          }

          client.once("clientReady", run);
        },
      },
    };
  },
);

/**
 * Function to define route in route files for type-safe DX. Should be exported as default.
 *
 * @param handler - Route handler method.
 * @returns Route handler method.
 * @example
 * ```ts
 * // routes/!hello.message_create.ts
 * import { define } from "@storona/discord.js";
 *
 * // Optional overrides
 * export const method = "message_create";
 *
 * export default define<"message_create">((message) => {
 *   message.reply("Hello world!");
 * });
 * ```
 * @example
 * ```js
 * // routes/ready.client_ready.mjs
 * import { define } from "@storona/discord.js";
 *
 * export default define((client) => {
 *   client.user?.setActivity("Hello world!");
 * });
 * ```
 * @example
 * ```js
 * // routes/ready.client_ready.js
 * const { define } = require("@storona/discord.js");
 *
 * module.exports = {
 *   default: define((client) => {
 *     client.user?.setActivity("Hello world!");
 *   }),
 * }
 * ```
 */
export function define<Q extends MethodType = MethodType>(
  cb: H<Q>,
): H<Q> {
  return cb;
}
