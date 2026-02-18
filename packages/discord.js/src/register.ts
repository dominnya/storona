import {
  ApplicationCommandOptionType,
  type ApplicationCommandDataResolvable,
  type ApplicationCommandOptionData,
  type ApplicationCommandSubCommandData,
  type Client,
} from "discord.js";
import type { ParsedImport } from "storona/adapter";
import type {
  CommandExports,
  CommandHandler,
  CommandMethod,
  Events,
  H,
  M,
  R,
} from "@/types";
import { getEventName } from "@/assert";

interface SubcommandEntry {
  name: string;
  description?: string;
  options?: ApplicationCommandSubCommandData["options"];
  handler: CommandHandler;
}

interface CommandEntry {
  name: string;
  description?: string;
  options?: ApplicationCommandSubCommandData["options"];
  defaultMemberPermissions?: CommandExports["defaultMemberPermissions"];
  dmPermission?: boolean;
  nsfw?: boolean;
  guildOnly?: string[];
  handler?: CommandHandler;
  subcommands: Map<string, SubcommandEntry>;
}

export interface CommandRegistry {
  commands: Map<string, CommandEntry>;
  handlerRegistered: boolean;
}

export function createCommandRegistry(): CommandRegistry {
  return {
    commands: new Map(),
    handlerRegistered: false,
  };
}

const normalizeCommandPath = (route: string): string[] => {
  const parts = route.replace(/\\/g, "/").split("/").filter(Boolean);

  if (parts.length === 0) {
    throw new Error("Command name is not provided");
  }

  if (parts.length > 2) {
    throw new Error(
      "Cannot register subcommand with depth over 2 keywords",
    );
  }

  return parts;
};

const getOrCreateCommandEntry = (
  registry: CommandRegistry,
  name: string,
): CommandEntry => {
  const existing = registry.commands.get(name);

  if (existing) return existing;

  const entry: CommandEntry = {
    name,
    subcommands: new Map(),
  };

  registry.commands.set(name, entry);

  return entry;
};

const mergeGuilds = (
  current: string[] | undefined,
  next: string[],
): string[] => {
  const merged = new Set<string>(current ?? []);
  for (const guild of next) {
    if (guild) merged.add(guild);
  }

  return [...merged];
};

const isCommandMethod = (method: M): method is CommandMethod =>
  method === "command";

export function registerRoute(
  client: Client,
  importData: ParsedImport<H, M, R>,
  registry: CommandRegistry,
) {
  if (isCommandMethod(importData.method)) {
    registerCommand(registry, importData);
  } else {
    registerEvent(client, importData as ParsedImport<H, Events, R>);
  }
}

export function setupCommandHandler(
  client: Client,
  registry: CommandRegistry,
) {
  if (registry.handlerRegistered) return;

  registry.handlerRegistered = true;

  client.on("interactionCreate", interaction => {
    if (!interaction.isChatInputCommand()) return;

    const entry = registry.commands.get(interaction.commandName);

    if (!entry) return;

    const subcommand =
      interaction.options.getSubcommand(false) ?? undefined;

    const handler = subcommand
      ? entry.subcommands.get(subcommand)?.handler
      : entry.handler;

    if (handler) {
      handler(interaction);
    }
  });
}

export async function registerCommands(
  client: Client,
  registry: CommandRegistry,
) {
  const commands: ApplicationCommandDataResolvable[] = [
    ...registry.commands.values(),
  ].map(entry => {
    if (entry.subcommands.size > 0) {
      if (!entry.description) {
        throw new Error(
          `Command description is required for "/${entry.name}"`,
        );
      }

      const options: ApplicationCommandOptionData[] = [
        ...entry.subcommands.values(),
      ].map(subcommand => {
        if (!subcommand.description) {
          throw new Error(
            `Command description is required for "/${entry.name} ${subcommand.name}"`,
          );
        }

        return {
          type: ApplicationCommandOptionType.Subcommand as const,
          name: subcommand.name,
          description: subcommand.description,
          options: subcommand.options,
        };
      });

      return {
        name: entry.name,
        description: entry.description,
        options,
        defaultMemberPermissions: entry.defaultMemberPermissions,
        dmPermission: entry.dmPermission,
        nsfw: entry.nsfw,
      };
    }

    if (!entry.description) {
      throw new Error(
        `Command description is required for "/${entry.name}"`,
      );
    }

    return {
      name: entry.name,
      description: entry.description,
      options: entry.options,
      defaultMemberPermissions: entry.defaultMemberPermissions,
      dmPermission: entry.dmPermission,
      nsfw: entry.nsfw,
    };
  });

  const commandsByName = new Map(
    commands
      .filter(command => "name" in command)
      .map(command => [command.name, command]),
  );

  const globalCommands: ApplicationCommandDataResolvable[] = [];
  const guildCommands = new Map<
    string,
    ApplicationCommandDataResolvable[]
  >();

  for (const entry of registry.commands.values()) {
    const targetGuilds = entry.guildOnly?.filter(Boolean) ?? [];
    const targetCommand = commandsByName.get(entry.name);

    if (!targetCommand) continue;

    if (targetGuilds.length === 0) {
      globalCommands.push(targetCommand);
      continue;
    }

    for (const guildId of targetGuilds) {
      const list = guildCommands.get(guildId) ?? [];
      list.push(targetCommand);
      guildCommands.set(guildId, list);
    }
  }

  await client.application?.fetch();
  const application = client.application;

  if (application) {
    await application.commands.set(globalCommands);
  }

  for (const [guildId, list] of guildCommands) {
    const guild = await client.guilds.fetch(guildId);
    await guild.commands.set(list);
  }
}

export function registerCommand(
  registry: CommandRegistry,
  importData: ParsedImport<H, M, R>,
) {
  if (!isCommandMethod(importData.method)) return;

  if (typeof importData.route !== "string") {
    throw new Error("Command route must be a string");
  }

  const [name, subcommand] = normalizeCommandPath(importData.route);
  const data = importData.data as CommandExports;
  const entry = getOrCreateCommandEntry(registry, name);

  if (subcommand) {
    if (entry.handler) {
      throw new Error(
        `Command "${name}" already registered without subcommands`,
      );
    }

    if (entry.subcommands.has(subcommand)) {
      throw new Error(
        `Command "${name} ${subcommand}" already registered`,
      );
    }

    entry.subcommands.set(subcommand, {
      name: subcommand,
      description: data.description,
      options: data.options,
      handler: importData.handler as CommandHandler,
    });

    if (data.guildOnly?.length) {
      entry.guildOnly = mergeGuilds(entry.guildOnly, data.guildOnly);
    }

    return;
  }

  if (entry.subcommands.size > 0) {
    throw new Error(
      `Command "${name}" already registered with subcommands`,
    );
  }

  if (entry.handler) {
    throw new Error(`Command "${name}" already registered`);
  }

  entry.handler = importData.handler as CommandHandler;

  if (data.description !== undefined) {
    entry.description = data.description;
  }

  if (data.options !== undefined) {
    entry.options = data.options;
  }

  if (data.defaultMemberPermissions !== undefined) {
    entry.defaultMemberPermissions = data.defaultMemberPermissions;
  }

  if (data.dmPermission !== undefined) {
    entry.dmPermission = data.dmPermission;
  }

  if (data.nsfw !== undefined) {
    entry.nsfw = data.nsfw;
  }

  if (data.guildOnly?.length) {
    entry.guildOnly = mergeGuilds(entry.guildOnly, data.guildOnly);
  }
}

/**
 * Register a client event.
 * It does not utilize composing due to strict return type of createRouter.
 * @param client - The client instance.
 * @param importData - The parsed import data.
 */
export function registerEvent(
  client: Client,
  importData: ParsedImport<H, Events, R>,
) {
  const handler = importData.handler as (...args: any[]) => any;
  client.on(getEventName(importData.method), handler);
}
