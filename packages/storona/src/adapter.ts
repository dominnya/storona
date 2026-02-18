export type EndpointInfo =
  | {
      path: string;
      endpoint: string | RegExp;
      method: string;
      registered: true;
      data: Record<string, unknown>;
    }
  | {
      path: string;
      registered: false;
      error: Error;
    };

type IsUppercase<C extends string> =
  C extends Uppercase<C>
    ? C extends Lowercase<C>
      ? false
      : true
    : false;

type ReplaceAll<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer Head}${From}${infer Tail}`
  ? `${Head}${To}${ReplaceAll<Tail, From, To>}`
  : S;

type CamelToSnake<
  S extends string,
  PrevLower extends boolean = false,
> = S extends `${infer C}${infer Rest}`
  ? C extends "_"
    ? `_${CamelToSnake<Rest, false>}`
    : IsUppercase<C> extends true
      ? `${PrevLower extends true ? "_" : ""}${Lowercase<C>}${CamelToSnake<Rest, false>}`
      : `${Lowercase<C>}${CamelToSnake<Rest, true>}`
  : S;

type PascalToSnake<S extends string> =
  S extends `${infer C}${infer Rest}`
    ? `${Lowercase<C>}${CamelToSnake<Rest, false>}`
    : S;

type UpperToSnake<S extends string> = Lowercase<
  ReplaceAll<S, "__", "_">
>;

type KebabToSnake<S extends string> = Lowercase<
  ReplaceAll<S, "-", "_">
>;

type SentenceToSnake<S extends string> = Lowercase<
  ReplaceAll<S, " ", "_">
>;

type SnakeToSnake<S extends string> = Lowercase<
  ReplaceAll<S, "__", "_">
>;

export namespace SnakeCaseFrom {
  export type Camel<S extends string> = CamelToSnake<S>;
  export type Pascal<S extends string> = PascalToSnake<S>;
  export type Upper<S extends string> = UpperToSnake<S>;
  export type Kebab<S extends string> = KebabToSnake<S>;
  export type Sentence<S extends string> = SentenceToSnake<S>;
  export type Snake<S extends string> = SnakeToSnake<S>;
}

interface ImportOrigin<H, M, R> {
  default: H;
  method?: M;
  route?: R;
}

export interface RouteStructure {
  endpoint: string;
  method: string;
}

export interface CorrectImport<H, M, R> extends Omit<
  ImportOrigin<H, M, R>,
  "default"
> {
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
