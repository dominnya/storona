import { expect, test } from "vitest";
import { createRouter, debug } from "storona";
import { adapter } from "@/adapter";
import { METHODS } from "@/assert";
import { Client } from "discord.js";

const client = new Client({ intents: [] });

await createRouter(client, {
  adapter: adapter({
    registerCommands: false,
  }),
  directory: "tests/routes",
});

const wrongMethodMessage = `Event must be one of:\n${METHODS.join(", ")}\nReceived: evt`;

test("Handles wrong method in path", () => {
  expect([
    `Failed to register tests\\routes\\nested\\wrong-method.evt.ts: ${wrongMethodMessage}`,
    `Failed to register tests/routes/nested/wrong-method.evt.ts: ${wrongMethodMessage}`,
  ]).toContain(debug.logs[13]);
});

test("Throws a warning when overriden file name does not start with !", () => {
  expect(debug.logs[12]).toBe(
    "Registered INTERACTION_CREATE /nested/renamed-2",
  );
  expect(debug.logs[11]).toBe(
    'Files with overriden routes should start with "!", rename the file to tests/routes/nested/!renamed.message_create.ts',
  );
});

test("Throws an error when no method defined in file name", () => {
  expect([
    "Failed to register tests\\routes\\nested\\no-method.ts: Method is not provided",
    "Failed to register tests/routes/nested/no-method.ts: Method is not provided",
  ]).toContain(debug.logs[10]);
});

test("Throws an error when no default export found", () => {
  expect([
    "Failed to register tests\\routes\\nested\\no-export.message_create.ts: No default export found",
    "Failed to register tests/routes/nested/no-export.message_create.ts: No default export found",
  ]).toContain(debug.logs[9]);
});

test("Throws an error when command depth is too deep", () => {
  expect([
    "Failed to register tests\\routes\\nested\\nested\\nested.command.ts: Cannot register subcommand with depth over 2 keywords",
    "Failed to register tests/routes/nested/nested/nested.command.ts: Cannot register subcommand with depth over 2 keywords",
  ]).toContain(debug.logs[8]);
});

test("Throws an error when override is of different type", () => {
  expect(debug.logs[6]).toBe(
    "Failed to register [object Object]: Exported route must be either string or regex",
  );
  expect(debug.logs[5]).toBe(
    "Failed to register /nested/nested/!wrong-method: Event must be of type string\nReceived: 123",
  );
});

test("Throws a warning when overriden route does not start with /", () => {
  expect(debug.logs[4]).toBe(
    "Registered INTERACTION_CREATE /nested/nested/warning-override",
  );
  expect(debug.logs[3]).toBe(
    'Route "nested/nested/warning-override" should start with a slash, automatically remapping',
  );
});

test("Correctly registers routes", () => {
  expect(debug.logs[7]).toBe("Registered COMMAND /nested/nested");
  expect(debug.logs[2]).toBe("Registered MESSAGE_CREATE /nested");
  expect(debug.logs[1]).toBe(
    "Registered INTERACTION_CREATE /nested/renamed-3",
  );
  expect(debug.logs[0]).toBe("Registered INTERACTION_CREATE /");
});
