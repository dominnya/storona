/**
 * Edge case: ESM module file
 * Tests: Native ES module .mjs handling
 */

export default function handler(_req, res) {
  res.json({
    format: ".mjs",
    moduleType: "ESM",
    note: "Native ES module syntax",
  });
}
