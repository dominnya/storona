import type { Options } from "@/types";

export function fallbackOptions(options: Options): Required<Options> {
  return {
    registerCommands: false,
    ...options,
  };
}
