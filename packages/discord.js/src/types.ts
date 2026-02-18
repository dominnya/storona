import type {
  ApplicationCommandOptionData,
  ApplicationCommandSubCommandData,
  ChatInputCommandInteraction,
  ClientEvents,
  PermissionResolvable,
} from "discord.js";
import type { SnakeCaseFrom } from "storona/adapter";

type SnakeEvents = {
  [K in keyof ClientEvents as SnakeCaseFrom.Camel<K>]: ClientEvents[K];
};

export type Events = keyof SnakeEvents;

export type CommandMethod = "command";

export type MethodType = Events | CommandMethod;

type EventHandlers = {
  [K in Events]: (...args: SnakeEvents[K]) => any | Promise<any>;
};

export type CommandHandler = (
  interaction: ChatInputCommandInteraction,
) => any | Promise<any>;

export type H<Q extends MethodType = MethodType> =
  Q extends CommandMethod
    ? CommandHandler
    : Q extends Events
      ? EventHandlers[Q]
      : never;

export type M = MethodType;

export type R = string;

export interface CommandExports {
  /**
   * Command description displayed in the command list.
   * Required when registerCommands is enabled.
   */
  description?: string;
  /**
   * Command option definitions for slash commands.
   */
  options?: ApplicationCommandSubCommandData["options"];
  /**
   * Permissions required to use the command.
   */
  defaultMemberPermissions?: PermissionResolvable;
  /**
   * Whether the command is available in DMs.
   */
  dmPermission?: boolean;
  /**
   * Whether the command is marked as NSFW.
   */
  nsfw?: boolean;
  /**
   * Guild IDs where the command should be registered.
   * When provided, the command is registered only in these guilds.
   */
  guildOnly?: string[];
}

export interface Options {
  /**
   * Automatically register slash commands after routes are loaded.
   * When enabled, command routes must include description and optional metadata.
   * @default false
   */
  registerCommands?: boolean;
}
