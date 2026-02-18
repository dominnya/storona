/**
 * Edge case: Route override with manual route definition
 * Tests: Exported route override (should be /custom/override instead of /api/users/override)
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";

export const route = "/custom/override";

export default define((_req, res) => {
  res.json(
    createResponse({
      message: "This route was manually overridden!",
      expectedPath: "/custom/override",
      fileLocation: "src/routes/api/users/override.get.ts",
    }),
  );
});
