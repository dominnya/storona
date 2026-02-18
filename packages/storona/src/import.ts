import { resolve } from "path";
import { createJiti } from "jiti";
import { isBun } from "@/utils";
import { loadTsConfigAliases } from "@/tsconfig";

type JitiInstance = ReturnType<typeof createJiti>;
type ModuleExports = Record<string, unknown>;

let jitiInstance: JitiInstance | null = null;

const getJiti = (): JitiInstance =>
  (jitiInstance ??= createJiti(import.meta.url, {
    fsCache: true,
    interopDefault: true,
    alias: loadTsConfigAliases(),
    jsx: { runtime: "classic", pragma: "h" },
  }));

export const getImport = (filePath: string): Promise<unknown> =>
  isBun()
    ? import(resolve(filePath))
    : getJiti().import(resolve(filePath), {});

export const getHandler = (moduleData: unknown): (() => unknown) => {
  const exports = moduleData as ModuleExports;
  const defaultExport = exports.default;

  if (typeof defaultExport === "function") {
    return defaultExport as () => unknown;
  }

  // Handle double-default pattern (CJS interop)
  const nestedDefault = (defaultExport as ModuleExports | null)
    ?.default;
  if (typeof nestedDefault === "function") {
    return nestedDefault as () => unknown;
  }

  return () => {};
};

export const getMethod = (
  moduleData: unknown,
): string | undefined => {
  const exports = moduleData as ModuleExports;
  const defaultExport = exports.default as ModuleExports | undefined;

  return (defaultExport?.method ?? exports.method) as
    | string
    | undefined;
};

export const getRoute = (
  moduleData: unknown,
): string | RegExp | undefined => {
  const exports = moduleData as ModuleExports;
  const defaultExport = exports.default as ModuleExports | undefined;

  return (defaultExport?.route ?? exports.route) as
    | string
    | RegExp
    | undefined;
};

export const flattenExports = (
  moduleData: unknown,
): ModuleExports => {
  const exports = moduleData as ModuleExports;

  return typeof exports.default === "object" &&
    exports.default !== null
    ? (exports.default as ModuleExports)
    : exports;
};
