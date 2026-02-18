import type { ParsedImport } from "storona/adapter";
import { Events as DiscordEvents } from "discord.js";
import type {
  CommandExports,
  CommandMethod,
  Events,
  H,
  M,
  R,
} from "@/types";

const toSnakeCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .replace(/__+/g, "_")
    .toLowerCase();

const EVENT_MAP = new Map(
  (Object.values(DiscordEvents) as string[]).map(event => [
    toSnakeCase(event),
    event,
  ]),
);

export const EVENTS = [...EVENT_MAP.keys()] as Events[];

export const COMMANDS: CommandMethod[] = ["command"];

export const METHODS: M[] = [...COMMANDS, ...EVENTS];

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

  if ("method" in route && typeof route.method !== "string") {
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

  if (
    "method" in route &&
    route.method === "command" &&
    "route" in route &&
    route.route instanceof RegExp
  ) {
    throw new Error("Command route must be a string");
  }
}

export function assertCommandData(route: ParsedImport<H, M, R>) {
  if (route.method !== "command") return;

  const data = route.data as CommandExports;

  if (typeof data.description !== "string" || !data.description) {
    throw new Error("Command description is required");
  }

  if (
    "options" in data &&
    data.options !== undefined &&
    !Array.isArray(data.options)
  ) {
    throw new Error("Command options must be an array");
  }

  if (
    "dmPermission" in data &&
    data.dmPermission !== undefined &&
    typeof data.dmPermission !== "boolean"
  ) {
    throw new Error("Command dmPermission must be a boolean");
  }

  if (
    "nsfw" in data &&
    data.nsfw !== undefined &&
    typeof data.nsfw !== "boolean"
  ) {
    throw new Error("Command nsfw must be a boolean");
  }

  if ("guildOnly" in data && data.guildOnly !== undefined) {
    if (
      !Array.isArray(data.guildOnly) ||
      data.guildOnly.some(guild => typeof guild !== "string")
    ) {
      throw new Error("Command guildOnly must be a string array");
    }
  }
}

export function getEventName(method: Events): string {
  return EVENT_MAP.get(method) ?? method;
}
