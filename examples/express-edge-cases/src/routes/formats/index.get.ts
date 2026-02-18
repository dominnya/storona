/**
 * Edge case: Format test index route
 * Tests: Route listing for file format tests
 */
import { define } from "@storona/express";

export default define((_req, res) => {
  res.json({
    route: "/formats",
    description: "File format edge cases",
    formats: [".ts", ".tsx", ".jsx", ".mjs", ".cjs"],
    endpoints: [
      "GET /formats/typescript",
      "GET /formats/tsx-types",
      "GET /formats/jsx-types",
      "GET /formats/esm-types",
      "GET /formats/cjs-types",
    ],
  });
});
