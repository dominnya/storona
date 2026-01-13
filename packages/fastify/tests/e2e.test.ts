import { expect, test } from "vitest";
import { createRouter, debug } from "storona";
import { adapter } from "@/adapter";
import fastify from "fastify";

const app = fastify();

await createRouter(app, {
  adapter: adapter(),
  directory: "tests/routes",
});

test("Handles wrong method in path", () => {
  expect([
    "Failed to register tests\\routes\\nested\\wrong-method.pet.ts: Method must be one of: get, post, put, delete, patch, options, head",
    "Failed to register tests/routes/nested/wrong-method.pet.ts: Method must be one of: get, post, put, delete, patch, options, head",
  ]).toContain(debug.logs[13]);
});

test("Handles wrong method in export", () => {
  expect(debug.logs[12]).toBe(
    "Failed to register /nested/wrong-method-overr.ide: Exported method must be one of: get, post, put, delete, patch, options, head",
  );
  expect(debug.logs[11]).toBe(
    'Files with overriden routes should start with "!", rename the file to tests/routes/nested/!wrong-method-overr.ide.get.ts',
  );
});

test("Throws a warning when overriden file name does not start with !", () => {
  expect(debug.logs[10]).toBe("Registered POST /nested/renamed-2");
  expect(debug.logs[9]).toBe(
    'Files with overriden routes should start with "!", rename the file to tests/routes/nested/!renamed.put.ts',
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
    "Failed to register tests\\routes\\nested\\no-export.get.ts: No default export found",
    "Failed to register tests/routes/nested/no-export.get.ts: No default export found",
  ]).toContain(debug.logs[7]);
});

test("Throws an error when override is of different type", () => {
  expect(debug.logs[6]).toBe(
    "Failed to register [object Object]: Exported route must be string",
  );
  expect(debug.logs[5]).toBe(
    "Failed to register /nested/nested/!wrong-method: Exported method must be one of: get, post, put, delete, patch, options, head",
  );
});

test("Throws a warning when overriden route does not start with /", () => {
  expect(debug.logs[4]).toBe(
    "Registered GET /nested/nested/warning-override",
  );
  expect(debug.logs[3]).toBe(
    'Route "nested/nested/warning-override" should start with a slash, automatically remapping',
  );
});

test("Correctly registers routes", () => {
  expect(debug.logs[2]).toBe("Registered POST /nested");
  expect(debug.logs[1]).toBe("Registered GET /nested/renamed-3");
  expect(debug.logs[0]).toBe("Registered GET /");
});
