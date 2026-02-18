/**
 * Edge case: Health check route
 * Tests: Route in root, simple response
 */
import { define } from "@storona/express";

export default define((_req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});
