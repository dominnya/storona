import { readFileSync, readdirSync } from "fs";
import { isAbsolute, join, normalize, relative, resolve } from "path";
import { build } from "tsup";
import { createAdapter, type RouteStructure } from "@/adapter";
import type { RouterOptions } from "@/types";
import { assertMethod } from "@/validate";

export const BUILD_DIR = resolve("node_modules/.cache/storona");

/**
 * Check if code is running in bun environment.
 * @see {@link https://bun.sh/guides/util/detect-bun | Detect Bun}
 * @returns True if running in bun.
 */
export function isBun(): boolean {
  return !!process.versions.bun;
}

/**
 * Get files in directory.
 * @param dir - Path to directory.
 * @returns File path.
 * @example
 * ```js
 * getFiles("routes") == ["routes/some/route.get.js", "routes/some/very/nested/endpoint.post.js"]
 * ```
 */
export function* getFiles(dir: string): Generator<string> {
  const files = readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const yieldValue = join(dir, file.name);

    if (file.isDirectory()) {
      yield* getFiles(yieldValue);
    } else {
      yield yieldValue;
    }
  }
}

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
 * Get project format from package.json.
 * @returns Project format. "cjs" or "esm".
 */
export function getProjectFormat(): "cjs" | "esm" {
  if (packageJson === undefined) {
    packageJson = getPackageJson();
  }

  if (!packageJson) return "cjs";

  return "type" in packageJson &&
    typeof packageJson.type === "string" &&
    packageJson.type === "module"
    ? "esm"
    : "cjs";
}

/**
 * Get structure from file path.
 * @param path - Path to file.
 * @example
 * dist/routes/some/route.get.ts == endpoint: "/some/route", method: "get"
 * dist/routes/some/very/nested/endpoint.post.js == endpoint: "/some/very/nested/endpoint", method: "post"
 * dist/routes/index.put.jsx == endpoint: "/", method: "put"
 */
export function getStructure(
  options: Required<RouterOptions>,
  path: string,
): RouteStructure {
  path = path.replace(/\\/g, "/");

  const pathParts = path.split(".");
  // Remove extension
  pathParts.pop();

  if (pathParts.length === 1) {
    throw new Error("Method is not provided");
  }

  const method = pathParts.pop();

  assertMethod(method);
  if (pathParts[pathParts.length - 1].endsWith("/")) {
    throw new Error("Route names should not start with a dot");
  }

  const endpoint = pathParts.join(".");

  const directoryPrefix = `${normalize(options.directory)
    .replace(/\\/g, "/")
    .replace(/\/$/, "")}/`;

  // Remove directory prepend as well as replace \ with / (windows)
  const normalizedEndpoint = endpoint
    .replace(/\[(.*?)\]/g, ":$1")
    .replace(directoryPrefix, "")
    // Remap some/nested/index to some/nested
    // And some/nested/:index to some/nested/:index
    .replace(/(?<!:)index$/g, "")
    .replace(/\/$/g, "");

  return {
    endpoint: `/${normalizedEndpoint}`,
    method,
  };
}

/**
 * Transpile routes to cjs in node_modules/.cache/storona.
 * @param options - Required router options.
 */
export async function buildRouter(options: Required<RouterOptions>) {
  // Don't transpile when running in bun
  if (isBun()) return;
  const format = getProjectFormat();
  const isEsm = format === "esm";
  const esmPrefix = isEsm ? "m" : "";

  const entryDir = join(process.cwd(), options.directory).replace(
    /\\/g,
    "/",
  );

  await build({
    entry: [entryDir],
    outDir: join(BUILD_DIR, options.directory),
    splitting: true,
    esbuildOptions: esOptions => {
      esOptions.outbase = entryDir;
    },
    format,
    silent: true,
    bundle: true,
    outExtension: () => ({
      js: `.${esmPrefix}js`,
      dts: ".d.ts",
    }),
    dts: false,
    clean: true,
  });
}

export const undefinedAdapter = createAdapter((i, _o) => ({
  version: "1.0.0",
  on: {
    register: () => {},
  },
}));

export function defineOptions(
  router?: RouterOptions | string,
): RouterOptions {
  const options =
    typeof router === "string"
      ? { directory: router }
      : (router ?? {});

  if (options.directory)
    options.directory = isAbsolute(options.directory)
      ? relative(process.cwd(), options.directory)
      : options.directory;

  return options;
}

export function fallbackOptions(
  options: RouterOptions,
): Required<RouterOptions> {
  return {
    directory: "routes",
    quiet: false,
    ignoreWarnings: false,
    adapter: undefinedAdapter(),
    ...options,
  };
}
