/**
 * Edge case: JSX file extension test
 * Tests: .jsx file handling without actual XML syntax
 * Note: jiti's jsx option only supports .tsx files, not .jsx
 *       For .jsx with actual JSX syntax, users need @babel/preset-react
 */
import { define } from "@storona/express";

export default define((_req, res) => {
  res.json({
    format: ".jsx",
    extension: "JavaScript XML",
    note: ".jsx files work, but JSX XML syntax requires babel config",
  });
});
