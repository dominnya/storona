/**
 * Edge case: Dynamic route with DELETE method (DELETE /api/users/:id)
 * Tests: Dynamic params with DELETE
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";

export default define((req, res) => {
  const id = req.params?.id;

  res.json(
    createResponse({ deletedId: id }, "User deleted successfully"),
  );
});
