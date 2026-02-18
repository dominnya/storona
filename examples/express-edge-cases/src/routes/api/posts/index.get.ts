/**
 * Edge case: Posts index route (GET /api/posts)
 * Tests: Another nested resource
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";
import type { Post } from "@shared/constants";

const posts: Post[] = [
  {
    id: "1",
    title: "First Post",
    content: "Hello World!",
    authorId: "1",
  },
  {
    id: "2",
    title: "Second Post",
    content: "Testing storona",
    authorId: "2",
  },
];

export default define((_req, res) => {
  res.json(createResponse(posts, "Posts retrieved successfully"));
});
