import * as extensions from '../extensions'

export type Extension<
  TName extends string
> = TName extends keyof typeof extensions ? typeof extensions[TName] : any
