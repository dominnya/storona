import { logger } from "@/router";

/**
 * Additional steps to normalize given manual set route to a correct format.
 * @param route - Route to normalize.
 * @returns Normalized route used to register the endpoint.
 * @example
 * ```js
 * normalizeManualRoute("/some/route") == "/some/route"
 * normalizeManualRoute("some/route") == "/some/route"
 * normalizeManualRoute(/someregex/) == /someregex/
 * normalizeManualRoute(undefined) == undefined
 * ```
 */
export function normalizeManualRoute(
  route: string | RegExp | undefined,
): string | RegExp | undefined {
  // RegExp or undefined do not have any normalization steps
  if (typeof route !== "string") return route;

  if (!route.startsWith("/")) {
    logger?.warn(
      "Route",
      `"${route}"`,
      "should start with a slash, automatically remapping",
    );
    return `/${route}`;
  }

  return route;
}
