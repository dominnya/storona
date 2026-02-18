/**
 * Edge case: Dynamic post with slug parameter (GET /api/posts/:slug)
 * Tests: Different parameter name
 */
import { define } from "@storona/express";
import { createResponse, createErrorResponse } from "@utils/response";
import type { Post } from "@shared/constants";

const posts: Post[] = [
  {
    id: "hello-world",
    title: "Hello World",
    content: "First post!",
    authorId: "1",
  },
];

export default define((req, res) => {
  const slug = req.params?.slug;
  const post = posts.find(p => p.id === slug);

  if (!post) {
    res
      .status(404)
      .json(createErrorResponse(`Post "${slug}" not found`, 404));
    return;
  }

  res.json(createResponse(post));
});
