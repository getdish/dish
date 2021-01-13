import { Request, RequestHandler, Response } from 'express'

export type Req = Request
export type Res = Response

export function route(fn: RequestHandler) {
  return fn
}
