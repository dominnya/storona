import type { Bot } from "grammy";
import type { ParsedImport } from "storona/adapter";
import type { Callbacks, Events, H, M, R } from "@/types";
import { CALLBACKS } from "./assert";

/**
 * Register a bot callback or event.
 * It does not utilize composing due to strict return type of createRouter.
 * @param bot - The bot instance.
 * @param importData - The parsed import data.
 */
export function registerCommand(
  bot: Bot,
  importData: ParsedImport<H, M, R>,
) {
  if (
    !Array.isArray(importData.method) &&
    CALLBACKS.includes(importData.method as Callbacks)
  ) {
    const method = importData.method as Callbacks;
    const route =
      typeof importData.route === "string"
        ? importData.route.toString().substring(1)
        : importData.route;

    bot[method](route as string, importData.handler);
  } else {
    bot.on(importData.method as Events, importData.handler);
  }
}
