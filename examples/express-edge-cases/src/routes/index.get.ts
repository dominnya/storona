/**
 * Edge case: Basic index route (GET /)
 * Tests: Basic route handling, tsconfig path alias @utils/*
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";
import { APP_NAME, VERSION } from "@shared/constants";

export default define((_req, res) => {
  res.json(
    createResponse({
      name: APP_NAME,
      version: VERSION,
      endpoints: [
        "GET /",
        "GET /api/users",
        "GET /api/users/:id",
        "POST /api/users",
        "PUT /api/users/:id",
        "DELETE /api/users/:id",
        "GET /api/posts",
        "POST /api/posts",
        "GET /health",
        "GET /api/deeply/nested/route",
      ],
    }),
  );
});
