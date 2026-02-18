/**
 * Edge case: POST with same nested index route (POST /api/users)
 * Tests: Multiple HTTP methods on same path
 */
import { define } from "@storona/express";
import { createResponse, generateId } from "@utils/response";
import type { User } from "@shared/constants";

export default define((req, res) => {
  const { name, email } = req.body as { name: string; email: string };

  const newUser: User = {
    id: generateId(),
    name,
    email,
  };

  res
    .status(201)
    .json(createResponse(newUser, "User created successfully"));
});
