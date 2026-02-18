import { expect, test } from "vitest";
import { getHandler, getImport, getMethod, getRoute } from "@/import";

test("getImport() correctly handles extensions", async () => {
  // With jiti, we can directly import JS files without pre-building
  const module = (await getImport("tests/dummy/common.js")) as any;

  // Verify the structure has the expected properties
  expect(module.default).toBeDefined();
  expect(module.default.method).toEqual("get");
  expect(module.default.route).toEqual("/some/nested/route");
  expect(typeof module.default.default).toEqual("function");
});

test("getHandler() correctly returns function", async () => {
  const module = await getImport("tests/dummy/common.js");
  const handler = getHandler(module);

  expect(handler).toBeTypeOf("function");
});

test("getMethod() correctly returns manually set method", async () => {
  const module = await getImport("tests/dummy/common.js");
  const method = getMethod(module);

  expect(method).toEqual("get");
});

test("getRoute() correctly returns manually set route", async () => {
  const module = await getImport("tests/dummy/common.js");
  const route = getRoute(module);

  expect(route).toEqual("/some/nested/route");
});
