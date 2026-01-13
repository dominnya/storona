import type { EndpointInfo } from "@/types";
export type { EndpointInfo };

interface ImportOrigin<H, M, R> {
  default: H;
  method?: M;
  route?: R;
}

export interface RouteStructure {
  endpoint: string;
  method: string;
}

export interface CorrectImport<H, M, R>
  extends Omit<ImportOrigin<H, M, R>, "default"> {
  default: ImportOrigin<H, M, R> | H;
}

export interface ParsedImport<H, M, R> {
  /** Callback provided by "define" function of an adapter. */
  handler: H;
  /** Overriden method in case provided. */
  method: M;
  /** Overriden route in case provided. */
  route: R;
  /** Original import data. */
  data: Record<string, unknown>;
}

/**
 * Create an adapter for storona's route handling system.
 * @param adapter - Adapter options.
 * @returns Adapter class that is initialized within createRouter function.
 * @example
 * ```ts
 * import { createAdapter } from "storona/adapter";
 * import type { Express } from "express";
 *
 * export const adapter = createAdapter<
 *   (req, res) => void, // Handler type
 *   "get" | "post", // Method type
 *   string, // Route type
 *   Express, // Instance type
 *   {} // Custom options
 * >((instance, _options = {}) => ({
 *   version: "1.0.0",
 *   on: {
 *     register: (importData) => {
 *       // Dummy example
 *       instance.get("/new-route", importData.handler);
 *     },
 *   },
 * }));
 * ```
 */
export function createAdapter<H, M, R, I, O>(
  adapter: (instance: I, options?: O) => Adapter<H, M, R>,
): (options?: O) => AdapterCallback<H, M, R, I> {
  return (options?: O) => (instance: I) => adapter(instance, options);
}

export type AdapterCallback<H, M, R, I> = (
  instance: I,
) => Adapter<H, M, R>;
export type Adapter<H, M, R> = AdapterV1<H, M, R>;

export interface AdapterV1<H, M, R> {
  /** Adapter API version. */
  version: "1.0.0";
  /** Hooks called within the initialization life cycle. */
  on: {
    /** Called once adapter is initialized by storona itself. */
    init?: () => Promise<any> | any;
    /** Parse route path structure (endpoint + method). */
    route?: (
      structure: RouteStructure,
    ) => Promise<RouteStructure> | RouteStructure;
    /** Registering a route by the provided instance. */
    register: (
      importData: ParsedImport<H, M, R>,
    ) => Promise<any> | any;
    /** Called once all routes were registered. */
    ready?: (status: EndpointInfo[]) => Promise<any> | any;
  };
}
