/**
 * Edge case: JSX with body data
 * Tests: JSX file handling with request body
 */
import { define } from "@storona/express";

export default define((req, res) => {
  const { data } = req.body ?? {};
  res.json({
    app: "express-edge-cases",
    received: data,
    fileType: ".jsx",
    success: true,
  });
});
