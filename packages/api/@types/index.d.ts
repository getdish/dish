declare module "interfaces" {
    import { Request, Response } from 'express';
    export type Handler = (req: Request, res: Response) => Promise<void> | void;
    export type Req = Request;
    export type Res = Response;
    export class RouteNext extends Error {
    }
    export class RouteExit extends Error {
        status: number;
        static errors: {
            unauthorized: number;
            forbidden: number;
            broken: number;
        };
        constructor(status: number, message?: string | null);
    }
}
declare module "route" {
    import bodyParser from 'body-parser';
    import { Handler as ExpressHandler, Request, Response } from 'express';
    import { Handler } from "interfaces";
    export function route(fn: Handler): (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void>;
    type BodyParseOpts = BodyParseOptsRaw | BodyParseOptsJSON | BodyParseOptsText | BodyParseOptsURLEncoded;
    type BodyParseOptsRaw = {
        raw: bodyParser.Options | undefined;
    };
    type BodyParseOptsJSON = {
        json: bodyParser.OptionsJson | undefined;
    };
    type BodyParseOptsText = {
        text: bodyParser.OptionsText | undefined;
    };
    type BodyParseOptsURLEncoded = {
        urlEncoded: bodyParser.OptionsUrlencoded | undefined;
    };
    export function useRouteBodyParser(req: Request, res: Response, opts: BodyParseOpts): Promise<unknown>;
    export function bodyParsedRoute(fn: Handler, opts?: BodyParseOpts): (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<void>;
    export const jsonRoute: (fn: Handler, opts?: BodyParseOptsJSON['json']) => (req: Request, res: Response) => Promise<void>;
    export const rawRoute: (fn: Handler, opts?: BodyParseOptsRaw['raw']) => (req: Request, res: Response) => Promise<void>;
    export const textRoute: (fn: Handler, opts?: BodyParseOptsText['text']) => (req: Request, res: Response) => Promise<void>;
    export const urlEncodedRoute: (fn: Handler, opts?: BodyParseOptsURLEncoded['urlEncoded']) => (req: Request, res: Response) => Promise<void>;
    export function handleErrors(fn: Handler): (req: Request, res: Response) => Promise<void>;
    export function runMiddleware(req: Request, res: Response, fn: ExpressHandler): Promise<unknown>;
}
declare module "@dish/api" {
    export * from "route";
    export * from "interfaces";
}
