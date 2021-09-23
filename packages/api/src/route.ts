import bodyParser from 'body-parser'
import { Handler as ExpressHandler, Request, Response } from 'express'

import { Handler } from './interfaces'

export function route(fn: Handler) {
  return handleErrors(fn)
}

type BodyParseOpts =
  | BodyParseOptsRaw
  | BodyParseOptsJSON
  | BodyParseOptsText
  | BodyParseOptsURLEncoded

type BodyParseOptsRaw = {
  raw: bodyParser.Options | undefined
}
type BodyParseOptsJSON = {
  json: bodyParser.OptionsJson | undefined
}
type BodyParseOptsText = {
  text: bodyParser.OptionsText | undefined
}
type BodyParseOptsURLEncoded = {
  urlEncoded: bodyParser.OptionsUrlencoded | undefined
}

function getBodyParser(opts: BodyParseOpts) {
  const key = opts ? Object.keys(opts)[0] : 'json'
  const finalOpts = opts?.[key] ?? { limit: '2048mb' }
  return bodyParser[key](finalOpts)
}

export async function useRouteBodyParser(req: Request, res: Response, opts: BodyParseOpts) {
  return await runMiddleware(req, res, getBodyParser(opts))
}

export function bodyParsedRoute(fn: Handler, opts?: BodyParseOpts) {
  return handleErrors(async (req, res) => {
    await useRouteBodyParser(req, res, opts ?? { json: { limit: '2048mb' } })
    await fn(req, res)
  })
}

export const jsonRoute = (fn: Handler, opts?: BodyParseOptsJSON['json']) =>
  bodyParsedRoute(fn, { json: opts })

export const rawRoute = (fn: Handler, opts?: BodyParseOptsRaw['raw']) =>
  bodyParsedRoute(fn, { raw: opts })

export const textRoute = (fn: Handler, opts?: BodyParseOptsText['text']) =>
  bodyParsedRoute(fn, { text: opts })

export const urlEncodedRoute = (fn: Handler, opts?: BodyParseOptsURLEncoded['urlEncoded']) =>
  bodyParsedRoute(fn, { urlEncoded: opts })

export function handleErrors(fn: Handler) {
  return async (req: Request, res: Response, next) => {
    try {
      const handlerRes = fn(req, res, next)
      if (handlerRes instanceof Promise) {
        await handlerRes
      }
    } catch (err: any) {
      // TODO theres duplicate versions of @dish/api we need to dedupe
      // then revert this back to instanceof checks
      if (err.name == 'RouteNext') {
        return
      }
      if (err.name !== 'RouteExit') {
        if (err.status) {
          res.status(err.status)
        }
        if (err.message) {
          res.send(err.message)
        }
        return
      }
      res.sendStatus(500)
    }
  }
}

export async function runMiddleware(req: Request, res: Response, fn: ExpressHandler) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}
