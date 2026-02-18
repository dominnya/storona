/**
 * Edge case: CJS file extension
 * Tests: CommonJS file handling with .cjs extension
 */

// CJS files use CommonJS syntax
module.exports = function handler(_req, res) {
  res.json({
    route: "/api/cjs-test",
    method: "GET",
    fileType: ".cjs",
    success: true,
  });
};
