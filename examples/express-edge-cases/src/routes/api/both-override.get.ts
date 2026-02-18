/**
 * Edge case: Route both override route and method
 * Tests: Combined route and method override
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";

export const route = "/completely/custom/path";
export const method = "patch";

export default define((req, res) => {
  res.json(
    createResponse({
      message: "Both route and method were overridden!",
      originalFile: "src/routes/api/both-override.get.ts",
      overriddenTo: "PATCH /completely/custom/path",
    }),
  );
});
