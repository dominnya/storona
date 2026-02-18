/**
 * Edge case: JSX file extension
 * Tests: JSX file handling with .jsx extension
 */
import { define } from "@storona/express";

export default define((_req, res) => {
  res.json({
    route: "/api/jsx-test",
    method: "GET",
    fileType: ".jsx",
    success: true,
  });
});
