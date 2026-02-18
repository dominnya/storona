/**
 * Edge case: Nested index route (GET /api/users)
 * Tests: Nested folders, index file handling
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";
import type { User } from "@shared/constants";

const users: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
];

export default define((_req, res) => {
  res.json(createResponse(users, "Users retrieved successfully"));
});
