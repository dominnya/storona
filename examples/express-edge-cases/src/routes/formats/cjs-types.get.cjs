/**
 * Edge case: CommonJS module file
 * Tests: CommonJS .cjs file handling
 */

module.exports = function handler(_req, res) {
  res.json({
    format: ".cjs",
    moduleType: "CommonJS",
    note: "CommonJS module.exports syntax",
  });
};
