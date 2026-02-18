import type { ParsedImport } from "storona/adapter";
import type { Express } from "express";
import type { M, H, R } from "./types";

export function registerRoute(
  instance: Express,
  importData: ParsedImport<H, M, R>,
): void {
  instance[importData.method as keyof Express](
    importData.route,
    // Suppress type mismatch error
    importData.handler as any,
  );
}
