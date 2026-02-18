/**
 * Edge case: Dynamic route with PUT method (PUT /api/users/:id)
 * Tests: Dynamic params with different HTTP method
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";
import type { User } from "@shared/constants";

export default define((req, res) => {
  const id = req.params?.id;
  const { name, email } = req.body as Partial<User>;

  // Simulate update
  const updatedUser: User = {
    id: id || "unknown",
    name: name || "Updated User",
    email: email || "updated@example.com",
  };

  res.json(createResponse(updatedUser, "User updated successfully"));
});
