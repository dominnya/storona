/**
 * Edge case: TSX file with actual JSX XML syntax and TypeScript
 * Tests: .tsx file with generics and XML elements transpiled by jiti + babel
 */
import { define } from "@storona/express";

type Format = ".tsx";

interface Props {
  title: string;
  count: number;
}

interface FormatResponse<T extends string> {
  format: T;
  hasJsxSyntax: boolean;
  componentType: JSX.Element;
  supportsGenerics: boolean;
}

const TsxComponent = ({ title, count }: Props) => (
  <div className="tsx-test">
    <h1>{title}</h1>
    <span>Count: {count}</span>
  </div>
);

export default define((_req, res) => {
  const response: FormatResponse<Format> = {
    format: ".tsx",
    hasJsxSyntax: true,
    componentType: <TsxComponent title="TSX Test" count={123} />,
    supportsGenerics: true,
  };

  res.json(response);
});
