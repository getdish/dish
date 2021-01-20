import { Handler as ExpressHandler, Request, Response } from 'express'

export type Handler = (req: Request, res: Response) => Promise<void> | void
export type Req = Request
export type Res = Response

export class RouteNext extends Error {}
export class RouteExit extends Error {}

export * from './route'
