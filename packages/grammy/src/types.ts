import type {
  CommandContext,
  Context,
  Filter,
  FilterQuery,
  HearsContext,
} from "grammy";
import type { SnakeCaseFrom } from "storona/adapter";

export type MethodType = FilterQuery | Callbacks | void;

export type H<Q extends MethodType = void> = (
  ctx: Ctx<Q>,
) => any | Promise<any>;

type CallbacksContext<T extends MethodType> = T extends "command"
  ? CommandContext<Context>
  : HearsContext<Context>;

type EventsContext<T extends MethodType> = T extends FilterQuery
  ? Filter<Context, T>
  : Context;

type Middleware<T extends MethodType, U, V> = T extends Callbacks
  ? U
  : V;

type Ctx<T extends MethodType> = Middleware<
  T,
  CallbacksContext<T>,
  EventsContext<T>
>;

export type Callbacks = SnakeCaseFrom.Snake<"command" | "hears">;
export type Events = SnakeCaseFrom.Snake<
  | "message"
  | "edited_message"
  | "channel_post"
  | "edited_channel_post"
  | "business_connection"
  | "business_message"
  | "edited_business_message"
  | "deleted_business_messages"
  | "message_reaction"
  | "message_reaction_count"
  | "inline_query"
  | "chosen_inline_result"
  | "callback_query"
  | "shipping_query"
  | "pre_checkout_query"
  | "poll"
  | "poll_answer"
  | "my_chat_member"
  | "chat_member"
  | "chat_join_request"
  | "chat_boost"
  | "removed_chat_boost"
  | "purchased_paid_media"
>;

export type M = Callbacks | Events | Events[];

export type R = string | RegExp;

export interface Options {
  /**
   * Register commands with setMyCommands API.
   * @default true
   */
  setMyCommands?: boolean;
}

export type Scope =
  | "default"
  | "all_private_chats"
  | "all_group_chats"
  | "all_chat_administrators"
  | `chat:${number | `@${string}`}`
  | `chat_administrators:${number | `@${string}`}`
  | `chat_member:${number | `@${string}`}:${number}`;
