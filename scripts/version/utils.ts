import { $, Glob } from "bun";
import { Logger } from "../../packages/storona/src/logger";

export type SemVer = `${number}.${number}.${number}`;

/**
 * Verify there are no changes to certain files before modifying them using scripts.
 * Throws an error if changes found.
 * @param files - Files to check for changes.
 * @param logger - An instance of logger to log errors.
 */
export async function verifyUnchangedGitFiles(
  files: string[],
  logger?: Logger,
) {
  // Check changes for unstaged and staged files
  const unstaged = await $`git diff --quiet ${files}`.nothrow();
  const staged =
    await $`git diff --cached --quiet ${files}`.nothrow();

  const changes = !!staged.exitCode || !!unstaged.exitCode;

  if (changes) {
    logger?.error(
      `There were found ${staged.exitCode ? "staged" : "unstaged"} changes. Commit them before modifying using scripts.`,
    );
    process.exit(1);
  }
}

/**
 * Fetches all package.json files in repository.
 * @returns package.json paths.
 */
export async function getPackageJsons(): Promise<string[]> {
  // workspaces key from package.json is not needed.
  const glob = new Glob("**/package.json");
  const packageJsons: string[] = [];

  for await (const path of glob.scan(".")) {
    if (path.includes("node_modules")) continue;
    packageJsons.push(path);
  }

  return packageJsons;
}

/**
 * Get's first argv from command as semver.
 * @param logger - An instance of logger to log errors.
 * @returns SemVer string.
 */
export function getArgvVersion(logger?: Logger): SemVer {
  const version = process.argv[2];

  if (!version) {
    logger?.error(
      `Version as argument not provided. Try \`bun run ${process.argv[1]} 1.1.1\``,
    );
    process.exit(1);
  }

  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    logger?.error(
      `Wrong version format provided.\n- Expected: 1.0.0\n- Received: ${version}`,
    );
    process.exit(1);
  }

  return version as SemVer;
}
