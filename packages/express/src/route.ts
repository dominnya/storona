import { readFileSync } from "fs";
import { join } from "path";
import type { RouteStructure } from "storona/adapter";

let packageJson: Record<string, unknown> | null | undefined;

/**
 * Get package.json.
 * @returns Package.json content. Null if not found.
 */
export function getPackageJson(): Record<string, unknown> | null {
  try {
    return JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf-8"),
    );
  } catch {
    return null;
  }
}

/**
 * Get package version from package.json.
 * @returns Package version.
 * @example
 * ```js
 * getPackageVersion() == "1.6.7" // If package.json has version 1.6.7
 * getPackageVersion() == "1.0.0" // If there is no version in package.json or package.json is not found
 * ```
 */
export function getPackageVersion(): string {
  if (packageJson === undefined) {
    packageJson = getPackageJson();
  }

  if (!packageJson) return "1.0.0";

  return "version" in packageJson &&
    typeof packageJson.version === "string"
    ? packageJson.version
    : "1.0.0";
}

export function getPrefix(prefix: `/${string}` | true): string {
  return typeof prefix === "string"
    ? prefix
    : `/v${getPackageVersion().split(".")[0]}`;
}

/**
 * Prepend given prefix to route structure.
 * @param structure - Route structure.
 * @returns Route structure.
 */
export function prependPrefix(
  structure: RouteStructure,
  prefix: string,
): RouteStructure {
  structure.endpoint = `${prefix}${structure.endpoint}`;
  structure.endpoint = structure.endpoint.replace(/\/$/g, "");
  if (structure.endpoint === "") structure.endpoint = "/";
  return structure;
}
