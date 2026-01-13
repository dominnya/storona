import { join, resolve } from "path";
import { pathToFileURL } from "url";
import { BUILD_DIR, getProjectFormat, isBun } from "@/utils";

export function getImport(filePath: string): Promise<unknown> {
  if (isBun()) {
    /**
     * Import src/routes/index.get.ts directly instead of
     * importing transpiled node_modules/.cache/storona/src/routes/index.get.js
     * @see {@link file://./utils.ts buildRouter}
     */
    return import(resolve(filePath));
  }

  const isEsm = getProjectFormat() === "esm";

  const fileParts = filePath.split(".");
  fileParts[fileParts.length - 1] = `${isEsm ? "m" : ""}js`;

  const outFile = join(BUILD_DIR, fileParts.join("."));

  return import(pathToFileURL(outFile).toString());
}

export function getHandler(importData: any): () => unknown {
  const defaultType = typeof importData.default;

  if (defaultType === "function") {
    return importData.default;
  }

  if (defaultType === "object") {
    return importData.default.default;
  }

  return () => {};
}

export function getMethod(importData: any): any | undefined {
  if ("method" in importData.default) {
    return importData.default.method;
  }

  return importData.method;
}

export function getRoute(importData: any): any | undefined {
  if ("route" in importData.default) {
    return importData.default.route;
  }

  return importData.route;
}

export function flattenExports(
  importData: any,
): Record<string, unknown> {
  if (typeof importData.default === "object") {
    return importData.default;
  }

  return importData;
}
