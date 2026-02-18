/**
 * Edge case: File with no method in filename (should error)
 * Tests: Error handling for invalid route files
 */
import { define } from "@storona/express";

export default define((_req, res) => {
  res.json({ message: "This should not work" });
});
