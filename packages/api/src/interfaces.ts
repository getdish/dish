import { Request, Response } from 'express'

export type Handler = (req: Request, res: Response, next?: any) => Promise<void> | void
export type Req = Request
export type Res = Response

export class RouteNext extends Error {}
export class RouteExit extends Error {
  static errors = {
    unauthorized: 401, // just auth
    forbidden: 403, // incorrect access
    broken: 500,
  }

  constructor(public status: number, message?: string | null) {
    super(message ?? '')
  }
}
