/**
 * Edge case: Route with dot in filename (GET /api/v1.0/status)
 * Tests: Dots in route names
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";

export default define((_req, res) => {
  res.json(
    createResponse({
      version: "1.0",
      status: "operational",
    }),
  );
});
