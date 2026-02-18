/**
 * Edge case: File starting with exclamation (should work with route override)
 * Tests: Special character handling with ! prefix
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";

// Override is required for files starting with !
export const route = "/api/special/exclamation";

export default define((_req, res) => {
  res.json(
    createResponse({
      message: "Route starting with ! character",
      note: "This requires a route override",
    }),
  );
});
