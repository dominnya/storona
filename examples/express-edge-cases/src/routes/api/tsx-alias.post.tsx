/**
 * Edge case: TSX with tsconfig path aliases
 * Tests: TypeScript JSX with @utils/* alias
 */
import { define } from "@storona/express";
import { createResponse, generateId } from "@utils/response";

interface CreatePayload {
  name: string;
  type: string;
}

export default define((req, res) => {
  const body = req.body as CreatePayload;
  res.json(
    createResponse({
      id: generateId(),
      name: body?.name ?? "unnamed",
      type: body?.type ?? "tsx",
      fileExtension: ".tsx",
    }),
  );
});
