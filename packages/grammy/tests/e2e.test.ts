import { expect, test } from "vitest";
import { createRouter, debug } from "storona";
import { adapter } from "@/adapter";
import { Bot } from "grammy";

const bot = new Bot("somestring");

await createRouter(bot, {
  adapter: adapter({
    setMyCommands: false,
  }),
  directory: "tests/routes",
});

test("Handles wrong method in path", () => {
  expect([
    "Failed to register tests\\routes\\nested\\wrong-method.cmd.ts: Event must be one of:\ncommand, hears, message, edited_message, channel_post, edited_channel_post, business_connection, business_message, edited_business_message, deleted_business_messages, message_reaction, message_reaction_count, inline_query, chosen_inline_result, callback_query, shipping_query, pre_checkout_query, poll, poll_answer, my_chat_member, chat_member, chat_join_request, chat_boost, removed_chat_boost, purchased_paid_media\nReceived: cmd",
    "Failed to register tests/routes/nested/wrong-method.cmd.ts: Event must be one of:\ncommand, hears, message, edited_message, channel_post, edited_channel_post, business_connection, business_message, edited_business_message, deleted_business_messages, message_reaction, message_reaction_count, inline_query, chosen_inline_result, callback_query, shipping_query, pre_checkout_query, poll, poll_answer, my_chat_member, chat_member, chat_join_request, chat_boost, removed_chat_boost, purchased_paid_media\nReceived: cmd",
  ]).toContain(debug.logs[13]);
});

test("Handles wrong method in export", () => {
  expect(debug.logs[12]).toBe(
    "Failed to register /wrong-method-overr.ide: Invalid L1 filter 'cmd' given in 'cmd'. Permitted values are: 'message', 'edited_message', 'channel_post', 'edited_channel_post', 'business_connection', 'business_message', 'edited_business_message', 'deleted_business_messages', 'inline_query', 'chosen_inline_result', 'callback_query', 'shipping_query', 'pre_checkout_query', 'poll', 'poll_answer', 'my_chat_member', 'chat_member', 'chat_join_request', 'message_reaction', 'message_reaction_count', 'chat_boost', 'removed_chat_boost', 'purchased_paid_media'.",
  );
  expect(debug.logs[11]).toBe(
    'Files with overriden routes should start with "!", rename the file to tests/routes/nested/!wrong-method-overr.ide.command.ts',
  );
});

test("Throws a warning when overriden file name does not start with !", () => {
  expect(debug.logs[10]).toBe("Registered HEARS /nested/renamed-2");
  expect(debug.logs[9]).toBe(
    'Files with overriden routes should start with "!", rename the file to tests/routes/nested/!renamed.message.ts',
  );
});

test("Throws an error when no method defined in file name", () => {
  expect([
    "Failed to register tests\\routes\\nested\\no-method.ts: Method is not provided",
    "Failed to register tests/routes/nested/no-method.ts: Method is not provided",
  ]).toContain(debug.logs[8]);
});

test("Throws an error when no default export found", () => {
  expect([
    "Failed to register tests\\routes\\nested\\no-export.message.ts: No default export found",
    "Failed to register tests/routes/nested/no-export.message.ts: No default export found",
  ]).toContain(debug.logs[7]);
});

test("Throws an error when override is of different type", () => {
  expect(debug.logs[6]).toBe(
    "Failed to register [object Object]: Exported route must be either string or regex",
  );
  expect(debug.logs[5]).toBe(
    "Failed to register /nested/nested/!wrong-method: Event must of type string\nReceived: 123",
  );
});

test("Throws a warning when overriden route does not start with /", () => {
  expect(debug.logs[4]).toBe(
    "Registered COMMAND /nested/nested/warning-override",
  );
  expect(debug.logs[3]).toBe(
    'Route "nested/nested/warning-override" should start with a slash, automatically remapping',
  );
});

test("Correctly registers routes", () => {
  expect(debug.logs[2]).toBe("Registered COMMAND /nested");
  expect(debug.logs[1]).toBe("Registered HEARS /nested/renamed-3");
  expect(debug.logs[0]).toBe("Registered COMMAND /");
});
