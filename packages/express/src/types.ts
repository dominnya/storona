import type { RequestHandler } from "express";

export type M =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

export interface ParsedQs {
  [key: string]:
    | undefined
    | string
    | string[]
    | ParsedQs
    | ParsedQs[];
}

export interface RouteGeneric {
  Params?: Record<string, string>;
  ResBody?: any;
  ReqBody?: any;
  ReqQuery?: ParsedQs;
  Locals?: Record<string, any>;
}

export type H<
  Params = Record<string, string>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
> =
  | RequestHandler<Params, ResBody, ReqBody, ReqQuery, Locals>
  | Promise<
      RequestHandler<Params, ResBody, ReqBody, ReqQuery, Locals>
    >;

export type R = string;

export interface Options {
  /**
   * Prefix all routes with a string or an API version.
   * Set to true to use the package version. 1.0.0 -> /v1
   * Set to a string to use a custom prefix.
   * @see {@link https://storona.domin.zip/adapters/express#prefix}
   * @default false
   */
  prefix?: boolean | `/${string}`;
}
