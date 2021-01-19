import {
  Handler as ExpressHandler,
  NextFunction,
  Request,
  Response,
} from 'express'

import { Handler, RouteExit, RouteNext } from './index'

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
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const handlerRes = fn(req, res, next) as any
      if (handlerRes instanceof Promise) {
        await handlerRes
      }
    } catch (err) {
      if (err instanceof RouteNext) {
        return next()
      }
      if (err instanceof RouteExit) {
        return
      }
      res.sendStatus(500)
      console.error(`Route error: ${err}`)
    }
  }
}
