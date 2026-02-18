/**
 * Edge case: MJS file extension
 * Tests: ES Module file handling with .mjs extension
 */

// MJS files use ES module syntax natively
export default function handler(_req, res) {
  res.json({
    route: "/api/mjs-test",
    method: "GET",
    fileType: ".mjs",
    success: true,
  });
}
