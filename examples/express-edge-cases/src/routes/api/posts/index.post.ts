/**
 * Edge case: POST with typed body (POST /api/posts)
 * Tests: Request body handling
 */
import { define } from "@storona/express";
import { createResponse, generateId } from "@utils/response";
import type { Post } from "@shared/constants";

export default define((req, res) => {
  const { title, content, authorId } = req.body as Partial<Post>;

  const newPost: Post = {
    id: generateId(),
    title: title || "Untitled",
    content: content || "",
    authorId: authorId || "anonymous",
  };

  res
    .status(201)
    .json(createResponse(newPost, "Post created successfully"));
});
