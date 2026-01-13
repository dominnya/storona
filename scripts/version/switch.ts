import { $ } from "bun";
import {
  Logger,
  createLogger,
} from "../../packages/storona/src/logger";
import { SemVer, getArgvVersion, getPackageJsons } from "./utils";

if (import.meta.main) {
  await changeVersions();
}

/**
 * Changes package.json versions to the one provided.
 * @example
 * ```ts
 * const logger = createLogger({ quiet: false });
 * const files = await changeVersions(logger, "1.2.0"); // { "version": "1.2.0" }
 * files; // ["packages/x/package.json", "package.json"]
 * ```
 * @param logger - An instance of logger to log info.
 * @param version - Semantic Versioning.
 * @param files - `package.json` files to change. Defaults to all package.jsons in repository.
 * @returns Changed file paths.
 */
export async function changeVersions(
  logger: Logger = createLogger({
    quiet: false,
  }),
  version: SemVer = getArgvVersion(logger),
  files?: string[],
): Promise<string[]> {
  // Awaiting is not available in default arg values
  if (!files) files = await getPackageJsons();

  for (const path of files) {
    const file = Bun.file(path);
    const json = await file.json();

    json.version = version;

    await Bun.write(file, JSON.stringify(json, null, 2));

    logger.info(`Bumped version in ${path} to ${version}`);
  }

  // Format these package.json files
  await $`bun x prettier --write ${files.join(" ")}`.quiet();

  return files;
}
