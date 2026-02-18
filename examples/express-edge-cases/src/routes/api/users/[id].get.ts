/**
 * Edge case: Dynamic route parameter (GET /api/users/:id)
 * Tests: Square bracket parameter syntax [id]
 */
import { define } from "@storona/express";
import { createResponse, createErrorResponse } from "@utils/response";
import type { User } from "@shared/constants";

const users: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
];

export default define((req, res) => {
  const id = req.params?.id;
  const user = users.find(u => u.id === id);

  if (!user) {
    res
      .status(404)
      .json(createErrorResponse(`User ${id} not found`, 404));
    return;
  }

  res.json(createResponse(user));
});
