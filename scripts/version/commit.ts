import { $ } from "bun";
import {
  Logger,
  createLogger,
} from "../../packages/storona/src/logger";
import { changeVersions } from "./switch";
import {
  getArgvVersion,
  getPackageJsons,
  verifyUnchangedGitFiles,
} from "./utils";

if (import.meta.main) {
  await pushGitVersion();
}

export async function pushGitVersion(
  logger: Logger = createLogger({
    quiet: false,
  }),
) {
  const version = getArgvVersion();
  const files = await getPackageJsons();

  await verifyUnchangedGitFiles(files, logger);
  await changeVersions(logger, version, files);

  await $`git add ${files}`.quiet();
  await $`git commit -m "chore: release v${version}"`.quiet();
  logger.info(`Committed "chore: release v${version}"`);
}
