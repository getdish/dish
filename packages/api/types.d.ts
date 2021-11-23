// Generated by dts-bundle-generator v6.1.0

import bodyParser from 'body-parser';
import { Handler as ExpressHandler, Request, Response } from 'express';

export declare type Handler = (req: Request, res: Response, next?: any) => Promise<void> | void;
export declare type Req = Request;
export declare type Res = Response;
export declare class RouteNext extends Error {
}
export declare class RouteExit extends Error {
	status: number;
	static errors: {
		unauthorized: number;
		forbidden: number;
		broken: number;
	};
	constructor(status: number, message?: string | null);
}
export declare const CACHE_KEY_PREFIX = "dish-api-cache-";
export declare function route(fn: Handler): (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: any) => Promise<void>;
export declare type BodyParseOpts = BodyParseOptsRaw | BodyParseOptsJSON | BodyParseOptsText | BodyParseOptsURLEncoded;
export declare type BodyParseOptsRaw = {
	raw: bodyParser.Options | undefined;
};
export declare type BodyParseOptsJSON = {
	json: bodyParser.OptionsJson | undefined;
};
export declare type BodyParseOptsText = {
	text: bodyParser.OptionsText | undefined;
};
export declare type BodyParseOptsURLEncoded = {
	urlEncoded: bodyParser.OptionsUrlencoded | undefined;
};
export declare function useRouteBodyParser(req: Request, res: Response, opts: BodyParseOpts): Promise<unknown>;
export declare function bodyParsedRoute(fn: Handler, opts?: BodyParseOpts): (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: any) => Promise<void>;
export declare const jsonRoute: (fn: Handler, opts?: BodyParseOptsJSON["json"]) => (req: Request, res: Response, next: any) => Promise<void>;
export declare const rawRoute: (fn: Handler, opts?: BodyParseOptsRaw["raw"]) => (req: Request, res: Response, next: any) => Promise<void>;
export declare const textRoute: (fn: Handler, opts?: BodyParseOptsText["text"]) => (req: Request, res: Response, next: any) => Promise<void>;
export declare const urlEncodedRoute: (fn: Handler, opts?: BodyParseOptsURLEncoded["urlEncoded"]) => (req: Request, res: Response, next: any) => Promise<void>;
export declare function handleErrors(fn: Handler): (req: Request, res: Response, next: any) => Promise<void>;
export declare function runMiddleware(req: Request, res: Response, fn: ExpressHandler): Promise<unknown>;

export {};
