/**
 * Edge case: Standard TypeScript
 * Tests: Baseline .ts file for comparison
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";

export default define((_req, res) => {
  res.json(createResponse({ format: ".ts" }));
});
