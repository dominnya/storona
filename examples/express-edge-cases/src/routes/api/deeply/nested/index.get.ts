/**
 * Edge case: Deeply nested index (GET /api/deeply/nested)
 * Tests: Index in deep nesting
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";

export default define((_req, res) => {
  res.json(
    createResponse({
      depth: 3,
      path: ["api", "deeply", "nested"],
      message: "Index at nested level",
    }),
  );
});
