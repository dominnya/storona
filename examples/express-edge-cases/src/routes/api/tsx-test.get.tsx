/**
 * Edge case: TSX file extension
 * Tests: TypeScript JSX file handling with .tsx extension
 */
import { define } from "@storona/express";

interface ResponseData {
  route: string;
  method: string;
  fileType: string;
  success: boolean;
}

export default define((_req, res) => {
  const data: ResponseData = {
    route: "/api/tsx-test",
    method: "GET",
    fileType: ".tsx",
    success: true,
  };
  res.json(data);
});
