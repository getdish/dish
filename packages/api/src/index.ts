import { Request, Handler as ExpressHandler, Response } from 'express'

export type Handler = ExpressHandler | ExpressHandler[]
export type Req = Request
export type Res = Response

export class RouteNext extends Error {}
export class RouteExit extends Error {}

export function route(fn: Handler) {
  return wrapRoute(fn, handleErrors)
}

export function wrapRoute(
  fn: Handler,
  wrapper: (fn: ExpressHandler) => ExpressHandler
) {
  return Array.isArray(fn) ? fn.map(wrapper) : wrapper(fn)
}

export function handleErrors(fn: ExpressHandler) {
  return (r, r2, next) => {
    try {
      return fn(r, r2, next)
    } catch (err) {
      if (err instanceof RouteNext) {
        return next()
      }
      if (err instanceof RouteExit) {
        return
      }
      throw err
    }
  }
}
