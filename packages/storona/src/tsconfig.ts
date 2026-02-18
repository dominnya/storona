import { existsSync, readFileSync } from "fs";
import { dirname, join, resolve } from "path";

export type JitiAlias = Record<string, string>;

/**
 * Strips JSON comments while preserving string contents.
 * Uses character-by-character processing to correctly handle
 * comment markers inside string literals.
 */
export const stripJsonComments = (json: string): string => {
  const chars = [...json];

  const initialState = {
    insideString: false,
    stringDelimiter: "",
    result: [] as string[],
    index: 0,
  };

  const skipComment = (
    type: "single" | "multi",
    startIndex: number,
  ): number => {
    if (type === "single") {
      const end = chars.slice(startIndex).findIndex(c => c === "\n");
      return end === -1 ? chars.length : startIndex + end;
    }

    const rest = chars.slice(startIndex + 2);
    const end = rest.findIndex(
      (c, i) => c === "*" && rest[i + 1] === "/",
    );
    return end === -1 ? chars.length : startIndex + 2 + end + 2;
  };

  const processState = (
    state: typeof initialState,
    index: number,
  ) => {
    const char = chars[index];
    const next = chars[index + 1];

    if (state.insideString) {
      return processInsideString(state, char, next, index);
    }

    return processOutsideString(state, char, next, index);
  };

  const processInsideString = (
    state: typeof initialState,
    char: string,
    next: string,
    index: number,
  ) => {
    const isEscaped = char === "\\" && next !== undefined;
    const isStringEnd = !isEscaped && char === state.stringDelimiter;

    if (isEscaped) {
      return {
        insideString: true,
        stringDelimiter: state.stringDelimiter,
        result: [...state.result, char, next],
        index: index + 2,
      };
    }

    return {
      insideString: !isStringEnd,
      stringDelimiter: isStringEnd ? "" : state.stringDelimiter,
      result: [...state.result, char],
      index: index + 1,
    };
  };

  const processOutsideString = (
    state: typeof initialState,
    char: string,
    next: string,
    index: number,
  ) => {
    const isStringStart = char === '"' || char === "'";
    const isSingleLineComment = char === "/" && next === "/";
    const isMultiLineComment = char === "/" && next === "*";

    if (isStringStart) {
      return {
        insideString: true,
        stringDelimiter: char,
        result: [...state.result, char],
        index: index + 1,
      };
    }

    if (isSingleLineComment) {
      return { ...state, index: skipComment("single", index) };
    }

    if (isMultiLineComment) {
      return { ...state, index: skipComment("multi", index) };
    }

    return {
      ...state,
      result: [...state.result, char],
      index: index + 1,
    };
  };

  const { result } = chars.reduce((state, _, index) => {
    return index < state.index ? state : processState(state, index);
  }, initialState);

  return result.join("");
};

/** Reads tsconfig.json with extends resolution. */
export const readTsConfig = (
  configPath: string,
): Record<string, unknown> | null => {
  if (!existsSync(configPath)) return null;

  try {
    const content = readFileSync(configPath, "utf-8");
    const config = JSON.parse(stripJsonComments(content)) as Record<
      string,
      unknown
    >;

    const extendsValue = config.extends;
    const extendsList = Array.isArray(extendsValue)
      ? extendsValue
      : extendsValue
        ? [extendsValue]
        : [];

    const relativeExtends = extendsList.filter(
      (ext): ext is string =>
        typeof ext === "string" && ext.startsWith("."),
    );

    for (const ext of relativeExtends) {
      const extPath = resolve(
        dirname(configPath),
        ext.endsWith(".json") ? ext : `${ext}.json`,
      );
      const baseConfig = readTsConfig(extPath);

      if (
        baseConfig?.compilerOptions &&
        typeof baseConfig.compilerOptions === "object"
      ) {
        config.compilerOptions = {
          ...(baseConfig.compilerOptions as object),
          ...(config.compilerOptions as object),
        };
      }
    }

    return config;
  } catch {
    return null;
  }
};

/** Converts tsconfig paths to jiti aliases. */
export const convertPathsToAliases = (
  paths: Record<string, string[]>,
  baseUrl: string,
  configDir: string,
): JitiAlias => {
  const baseDir = resolve(configDir, baseUrl);

  const removeWildcard = (str: string) => str.replace(/\*$/, "");

  return Object.fromEntries(
    Object.entries(paths)
      .filter(([, targets]) => targets.length > 0)
      .map(([pattern, [firstTarget]]) => [
        removeWildcard(pattern),
        resolve(baseDir, removeWildcard(firstTarget)),
      ]),
  );
};

/** Loads tsconfig paths as jiti aliases from cwd. */
export const loadTsConfigAliases = (): JitiAlias => {
  const cwd = process.cwd();
  const config = readTsConfig(join(cwd, "tsconfig.json"));

  if (!config?.compilerOptions) return {};

  const { paths, baseUrl = "." } = config.compilerOptions as {
    paths?: Record<string, string[]>;
    baseUrl?: string;
  };

  return paths ? convertPathsToAliases(paths, baseUrl, cwd) : {};
};
