import {
  RuleConfigSeverity,
  type UserConfig,
} from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      RuleConfigSeverity.Error,
      "always",
      ["express", "fastify", "grammy", "discord.js"],
    ],
    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      [
        "chore",
        "deps",
        "docs",
        "feat",
        "fix",
        "refactor",
        "revert",
        "test",
      ],
    ],
  },
};

export default config;
