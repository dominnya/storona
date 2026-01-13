import { logger } from "@/router";
import type { RouterOptions } from "@/types";

export function assertFileName(
  fileName: string | undefined,
): asserts fileName is string {
  if (!fileName) {
    throw new Error("File name is not provided");
  }
}

export function assertMethod(
  method: string | undefined,
): asserts method is string {
  if (!method) {
    throw new Error("Method is not provided");
  }
}

export function assertOverrideArchitecturePath(
  options: Required<RouterOptions>,
  path: string,
  importData: Record<string, unknown>,
): void {
  const pathParts = path.replace(/\\/g, "/").split("/");
  const fileName = pathParts.pop();
  const breaksRule = "route" in importData || "method" in importData;

  if (
    !options.ignoreWarnings &&
    breaksRule &&
    !fileName?.startsWith("!")
  ) {
    logger.warn(
      'Files with overriden routes should start with "!", rename the file to',
      `${pathParts.join("/")}/!${fileName}`,
    );
  }
}

export function assertHandler(route: unknown) {
  if (typeof route !== "object" || route === null) {
    throw new Error("No exports found");
  }

  if (!("default" in route)) {
    throw new Error("No default export found");
  }

  if (
    typeof route.default !== "function" &&
    typeof route.default !== "object"
  ) {
    throw new Error("Invalid transpiled default export");
  }

  if (
    typeof route.default === "object" &&
    route.default !== null &&
    !("default" in route.default)
  ) {
    throw new Error("Invalid default export route handler");
  }

  if (
    typeof route.default === "object" &&
    typeof route.default?.default !== "function"
  ) {
    throw new Error(
      "Default export should be defined with defineRoute",
    );
  }
}
