import { normalizeManualRoute } from "@/normalize";
import { expect, test } from "vitest";

test("normalizeManualRoute() correctly handles string", () => {
  expect(normalizeManualRoute("/some/route")).toBe("/some/route");
  expect(normalizeManualRoute("some/route")).toBe("/some/route");
});

test("normalizeManualRoute() correctly handles regex", () => {
  expect(normalizeManualRoute(/someregex/)).toStrictEqual(
    /someregex/,
  );
  expect(normalizeManualRoute(/someregexx/)).toStrictEqual(
    /someregexx/,
  );
});

test("normalizeManualRoute() correctly handles other types", () => {
  expect(normalizeManualRoute(undefined)).toBe(undefined);
});
