import type { ParsedImport } from "storona/adapter";
import type { Callbacks, Events, H, M, R } from "@/types";
import {
  CHAT_ADMINISTRATORS_SCOPE_REGEX,
  CHAT_MEMBER_SCOPE_REGEX,
  CHAT_SCOPE_REGEX,
} from "@/ready";

export const CALLBACKS: Callbacks[] = ["command", "hears"];
export const EVENTS: Events[] = [
  "message",
  "edited_message",
  "channel_post",
  "edited_channel_post",
  "business_connection",
  "business_message",
  "edited_business_message",
  "deleted_business_messages",
  "message_reaction",
  "message_reaction_count",
  "inline_query",
  "chosen_inline_result",
  "callback_query",
  "shipping_query",
  "pre_checkout_query",
  "poll",
  "poll_answer",
  "my_chat_member",
  "chat_member",
  "chat_join_request",
  "chat_boost",
  "removed_chat_boost",
  "purchased_paid_media",
];

// Allowed methods for Telegram bot updates
export const METHODS: M[] = [...CALLBACKS, ...EVENTS];

export function assertCommandScope(
  importData: ParsedImport<H, M, R>,
) {
  if (
    importData.method !== "command" ||
    !("scope" in importData.data)
  )
    return;

  const { scope } = importData.data;

  if (typeof scope !== "string") {
    throw new Error(
      "Command scope must be a string, check following link to see the scope template: https://storona.domin.zip/adapters/grammy#scope-values",
    );
  }

  if (
    [
      "default",
      "all_private_chats",
      "all_group_chats",
      "all_chat_administrators",
    ].includes(scope)
  ) {
    return;
  }

  if (
    [
      CHAT_SCOPE_REGEX,
      CHAT_ADMINISTRATORS_SCOPE_REGEX,
      CHAT_MEMBER_SCOPE_REGEX,
    ].some(regex => regex.test(scope))
  ) {
    return;
  }

  throw new Error(
    "Invalid command scope, check following link to see the scope template: https://storona.domin.zip/adapters/grammy#scope-values",
  );
}

export function assertCommandDescription(
  importData: ParsedImport<H, M, R>,
) {
  if (
    importData.method === "command" &&
    !("description" in importData.data)
  ) {
    throw new Error("Command description is required");
  }
}

export function assertMethod(method: unknown): asserts method is M {
  if (typeof method !== "string" || !METHODS.includes(method as M)) {
    throw new Error(
      `Event must be one of:\n${METHODS.join(", ")}\nReceived: ${method}`,
    );
  }
}

export function assertExportedVariables(
  route: unknown,
): asserts route is ParsedImport<H, M, R> {
  if (typeof route !== "object" || route === null) {
    throw new Error("No exports found");
  }

  if (
    "method" in route &&
    typeof route.method !== "string" &&
    !Array.isArray(route.method)
  ) {
    // Ignore METHODS check because of L2, L3 levels
    throw new Error(
      `Event must be of type string\nReceived: ${route.method}`,
    );
  }

  if ("route" in route) {
    const typeOfRoute = typeof route.route;

    if (
      typeOfRoute !== "string" &&
      !(route.route instanceof RegExp)
    ) {
      throw new Error(
        "Exported route must be either string or regex",
      );
    }
  }
}
