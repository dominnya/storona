import type { RouteStructure } from "storona/adapter";

/**
 * Parse web-friendly endpoint to a bot-friendly command environment.
 * Telegram does not offer subcommand support, so we take the last part of the endpoint as the command.
 * @param structure - Route structure.
 * @returns Route structure.
 */
export function parseCommand(
  structure: RouteStructure,
): RouteStructure {
  if (structure.method === "command") {
    const subcommands = structure.endpoint.split("/");
    const endpoint = `/${subcommands[subcommands.length - 1]}`;
    structure.endpoint = endpoint;
  }

  return structure;
}
