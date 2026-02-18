/**
 * Edge case: Method override (file says .get.ts but exports method: "post")
 * Tests: Exported method override
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";

export const method = "patch";

export default define((req, res) => {
  res.json(
    createResponse({
      message: "Method was overridden from GET to PATCH!",
      body: req.body,
    }),
  );
});
