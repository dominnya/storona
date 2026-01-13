import type { H, M, R, Options, RouteGeneric } from "@/types";
import { assertExportedVariables, assertMethod } from "@/assert";
import type { Express } from "express";
import { createAdapter } from "storona/adapter";
import { fallbackOptions } from "@/options";
import { getPrefix, prependPrefix } from "@/route";
import { registerRoute } from "@/register";

/**
 * Express.js adapter for Storona. Let's you define endpoints in route files.
 *
 * @see {@link https://expressjs.com/ | Express Documentation}
 * @see {@link https://storona.domin.zip/ | Storona Documentation}
 * @see {@link https://storona.domin.zip/adapters/express | @storona/express Documentation}
 */
export const adapter = createAdapter<H, M, R, Express, Options>(
  (instance, opts = {}) => {
    // Fallback to default option set
    const options = fallbackOptions(opts);
    const prefix =
      options.prefix === false ? "" : getPrefix(options.prefix);

    return {
      // This is the version of the adapter API. It is used to ensure compatibility.
      // If the adapter API changes, the version should be bumped along with the necessary changes.
      version: "1.0.0",
      on: {
        route: structure => {
          assertMethod(structure.method);

          structure = prependPrefix(structure, prefix);

          return structure;
        },
        register: importData => {
          assertExportedVariables(importData);
          return registerRoute(instance, importData);
        },
      },
    };
  },
);

/**
 * Function to define route in route files. Should be exported as default.
 *
 * @param handler - Request handler.
 * @returns Request handler.
 * @example
 * ```js
 * // routes/!hello.get.mjs
 * import { define } from "@storona/express";
 *
 * // Optional overrides
 * export const method = "post";
 * export const route = /someregex/; // Can be a string or regex
 *
 * export default define((_req, res) => {
 *   res.send("Hello world!");
 * });
 * ```
 * @example
 * ```ts
 * // routes/my-fruit.post.ts
 * import { define } from "@storona/express";
 *
 * interface ReqBody {
 *   fruit: string;
 * }
 *
 * export default define<{
 *   ReqBody: ReqBody;
 * }>((req, res) => {
 *   const { fruit } = req.body;
 *   res.send(`My fruit is ${fruit}!`);
 * });
 * ```
 */
export function define<Route extends RouteGeneric = RouteGeneric>(
  handler: H<
    Route["Params"],
    Route["ResBody"],
    Route["ReqBody"],
    Route["ReqQuery"],
    Route["Locals"] & Record<string, any>
  >,
): H<
  Route["Params"],
  Route["ResBody"],
  Route["ReqBody"],
  Route["ReqQuery"],
  Route["Locals"] & Record<string, any>
> {
  return handler;
}
