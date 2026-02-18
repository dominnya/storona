/**
 * Edge case: Multiple dynamic params (GET /api/deeply/:category/:item)
 * Tests: Route with multiple dynamic segments
 */
import { define } from "@storona/express";
import { createResponse } from "@utils/response";

export default define((req, res) => {
  const { category, item } = req.params as {
    category: string;
    item: string;
  };

  res.json(
    createResponse({
      category,
      item,
      message: `Looking at ${item} in category ${category}`,
    }),
  );
});
