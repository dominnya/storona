import type { H, M, R, Options } from "@/types";
import { assertExportedVariables, assertMethod } from "@/assert";
import { createAdapter } from "storona/adapter";
import { fallbackOptions } from "@/options";
import { getPrefix, prependPrefix } from "@/route";
import { registerRoute } from "@/register";
import type { FastifyInstance, RouteGenericInterface } from "fastify";

/**
 * Fastify adapter for Storona. Let's you define endpoints in route files.
 *
 * @see {@link https://fastify.dev/ | Fastify Documentation}
 * @see {@link https://storona.domin.zip/ | Storona Documentation}
 * @see {@link https://storona.domin.zip/adapters/fastify | @storona/fastify Documentation}
 */
export const adapter = createAdapter<
  H,
  M,
  R,
  FastifyInstance,
  Options
>((instance, opts = {}) => {
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
});

/**
 * Function to define route in route files. Should be exported as default.
 *
 * @param handler - Route handler method.
 * @returns Route handler method.
 * @example
 * ```js
 * // routes/!hello.get.mjs
 * import { define } from "@storona/fastify";
 *
 * // Optional overrides
 * export const method = "post";
 * export const route = "/valid/:route";
 *
 * export default define((_request, reply) => {
 *   reply.send("Hello world!");
 * });
 * ```
 * @example
 * ```ts
 * // routes/my-fruit.post.ts
 * import { define } from "@storona/fastify";
 *
 * interface ReqBody {
 *   fruit: string;
 * }
 *
 * export default define<{
 *   Body: ReqBody;
 * }>((request, reply) => {
 *   const { fruit } = request.body;
 *   reply.send(`My fruit is ${fruit}!`);
 * });
 * ```
 */
export function define<RouteGeneric extends RouteGenericInterface>(
  handler: H<RouteGeneric>,
): H<RouteGeneric> {
  return handler;
}
