/**
 * Edge case: Route that uses ALL HTTP methods
 * Tests: OPTIONS method
 */
import { define } from "@storona/express";

export default define((_req, res) => {
  res.setHeader("Allow", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.status(204).end();
});
