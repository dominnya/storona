import type { AdapterCallback } from "@/adapter";

export interface RouterOptions {
  /**
   * Directory to look for routes.
   * @see {@link https://storona.domin.zip/reference/config#directory}
   * @default "routes"
   */
  directory?: string;

  /**
   * Silence all logs.
   * @see {@link https://storona.domin.zip/reference/config#quiet}
   * @default false
   */
  quiet?: boolean;

  /**
   * Ignore (silence) all warnings.
   * @see {@link https://storona.domin.zip/reference/config#ignore-warnings}
   * @default false
   */
  ignoreWarnings?: boolean;

  /**
   * Custom provided adapter to fetch from.
   * @see {@link https://storona.domin.zip/reference/config#adapter}
   */
  adapter?: AdapterCallback<any, any, any, any>;
}

interface ValidEndpoint {
  /** Path to the route file. */
  path: string;
  /** Registered endpoint. */
  endpoint: string | RegExp;
  /** Registered method. */
  method: string;
  /** Whether endpoint was registered or not. */
  registered: true;
  /** Other import data. */
  data: Record<string, unknown>;
}

interface InvalidEndpoint {
  /** Path to the route file. */
  path: string;
  /** Whether endpoint was registered or not. */
  registered: false;
  /** Error instance for the failing route. */
  error: Error;
}

export type EndpointInfo = ValidEndpoint | InvalidEndpoint;
