import { version } from "package.json";
import { expect, test } from "vitest";
import { fallbackOptions, getStructure } from "@/utils";

test("getStructure() correctly handles wildcard", () => {
  const options = fallbackOptions({
    directory: "skiprouterreplace",
  });

  expect(
    getStructure(options, "route/with/[wildcard]/route.put.ts"),
  ).toStrictEqual({
    endpoint: "/route/with/:wildcard/route",
    method: "put",
  });
  expect(
    getStructure(options, "route/with/[wildcard]/[route].put.ts"),
  ).toStrictEqual({
    endpoint: "/route/with/:wildcard/:route",
    method: "put",
  });
  expect(
    getStructure(options, "route/with/[wildcard]/[index].put.ts"),
  ).toStrictEqual({
    endpoint: "/route/with/:wildcard/:index",
    method: "put",
  });
});

test("getStructure() correctly returns method", () => {
  const options = fallbackOptions({
    directory: "skiprouterreplace",
  });

  expect(
    getStructure(options, "route/with/some/weird.methodAAA.ts"),
  ).toStrictEqual({
    endpoint: "/route/with/some/weird",
    method: "methodAAA",
  });
  expect(
    getStructure(options, "routes/with/nonlatin/alphabet.привет.ts"),
  ).toStrictEqual({
    endpoint: "/routes/with/nonlatin/alphabet",
    method: "привет",
  });
});

test("getStructure() correctly returns index", () => {
  const options = fallbackOptions({
    directory: "skiprouterreplace",
  });

  expect(
    getStructure(options, "nested/route/index.put.ts"),
  ).toStrictEqual({
    endpoint: "/nested/route",
    method: "put",
  });

  expect(getStructure(options, "index.put.jsx")).toStrictEqual({
    endpoint: "/",
    method: "put",
  });
});

test("getStructure() correctly replaces slashes for windows", () => {
  const options = fallbackOptions({
    directory: "skiprouterreplace",
  });

  expect(
    getStructure(options, "nested\\route\\with\\backslashes.put.ts"),
  ).toStrictEqual({
    endpoint: "/nested/route/with/backslashes",
    method: "put",
  });
});

test("getStructure() correctly replaces prefix directory", () => {
  const options = fallbackOptions({
    directory: "src/route",
  });

  expect(
    getStructure(options, "src/routes/nested/route.get.ts"),
  ).toStrictEqual({
    endpoint: "/src/routes/nested/route",
    method: "get",
  });

  expect(
    getStructure(options, "src/route/nested/route.get.ts"),
  ).toStrictEqual({
    endpoint: "/nested/route",
    method: "get",
  });

  const wrongOptions = fallbackOptions({
    directory: "src/route/",
  });

  expect(
    getStructure(wrongOptions, "src/routes/nested/route.get.ts"),
  ).toStrictEqual({
    endpoint: "/src/routes/nested/route",
    method: "get",
  });

  expect(
    getStructure(wrongOptions, "src/route/nested/route.get.ts"),
  ).toStrictEqual({
    endpoint: "/nested/route",
    method: "get",
  });
});

// test("getStructure() correctly prefixes version", () => {
//   const options = fallbackOptions({
//     directory: "skiprouterreplace",
//     prefix: true,
//   });

//   expect(getStructure(options, "nested/route.put.ts")).toStrictEqual({
//     endpoint: `/v${version.split(".")[0]}/nested/route`,
//     method: "put",
//   });

//   expect(getStructure(options, "index.put.ts")).toStrictEqual({
//     endpoint: `/v${version.split(".")[0]}`,
//     method: "put",
//   });
// });

test("getStructure() only takes last suffix", () => {
  const options = fallbackOptions({
    directory: "skiprouterreplace",
  });

  expect(
    getStructure(options, "nested/route.put.someother.get.ts"),
  ).toStrictEqual({
    endpoint: "/nested/route.put.someother",
    method: "get",
  });
});
