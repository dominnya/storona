/**
 * Edge case: Deeply nested route (GET /api/deeply/nested/route)
 * Tests: Multiple levels of nesting
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";

export default define((_req, res) => {
  res.json(
    createResponse({
      depth: 4,
      path: ["api", "deeply", "nested", "route"],
      message: "You reached a deeply nested route!",
    }),
  );
});
