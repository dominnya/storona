/**
 * Edge case: HEAD request
 * Tests: HEAD method
 */
import { define } from "@storona/express";

export default define((_req, res) => {
  res.setHeader("X-Custom-Header", "head-test");
  res.setHeader("Content-Length", "42");
  res.status(200).end();
});
