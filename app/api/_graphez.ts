import { Handler } from '@dish/api'
import { Request, Response } from 'express'
import {
  AppOptions,
  BaseAppBuilder,
  BuildAppOptions,
  EZAppFactoryType,
  GetEnvelopedFn,
  InternalAppBuildContext,
  InternalAppBuildContextKey,
  InternalAppBuildIntegrationContext,
  LazyPromise,
  ProcessRequestOptions,
  createEZAppFactory,
  handleRequest,
} from 'graphql-ez'

import { EZCors, handleCors } from './_cors'

export interface NextHandlerContext {
  handlers: Array<
    (
      req: Request,
      res: Response
    ) => Promise<
      | {
          stop?: true
        }
      | undefined
    >
  >
}

export interface DishAppOptions extends AppOptions {
  processRequestOptions?: (req: Request, res: Response) => ProcessRequestOptions
  cors?: EZCors
  path?: string
}

export interface EZApp {
  readonly apiHandler: Handler
  readonly getEnveloped: Promise<GetEnvelopedFn<unknown>>

  readonly ready: Promise<void>

  [InternalAppBuildContextKey]: InternalAppBuildContext
}

export interface EZAppBuilder extends BaseAppBuilder {
  readonly buildApp: (options?: BuildAppOptions) => EZApp
}

export function CreateApp(config: DishAppOptions = {}): EZAppBuilder {
  const appConfig = { ...config }

  appConfig.path ||= '/api/graphql'

  let ezApp: EZAppFactoryType

  try {
    ezApp = createEZAppFactory(
      {
        integrationName: 'nextjs',
      },
      appConfig
    )
  } catch (err) {
    err instanceof Error && Error.captureStackTrace(err, CreateApp)
    throw err
  }

  const { appBuilder, onIntegrationRegister, ...commonApp } = ezApp

  const buildApp: EZAppBuilder['buildApp'] = function buildApp(buildOptions = {}) {
    const { buildContext, onAppRegister, processRequestOptions, cors } = appConfig

    let appHandler: Handler
    const appPromise = Promise.allSettled([
      appBuilder(buildOptions, async ({ ctx, getEnveloped }) => {
        const nextHandlers: NextHandlerContext['handlers'] = []
        const integration: InternalAppBuildIntegrationContext = {
          nextjs: {
            handlers: nextHandlers,
          },
        }

        if (onAppRegister) await onAppRegister({ ctx, integration, getEnveloped })

        await onIntegrationRegister(integration)

        const corsMiddleware = await handleCors(cors)

        const {
          preProcessRequest,
          options: { customHandleRequest },
        } = ctx

        const requestHandler = customHandleRequest || handleRequest

        const EZHandler: Handler = async function EZHandler(req, res) {
          if (nextHandlers.length) {
            const result = await Promise.all(nextHandlers.map((cb) => cb(req, res)))

            if (result.some((v) => v?.stop)) return
          }

          // res.header('Access-Control-Allow-Origin', '*')
          // res.header('Access-Control-Allow-Credentials', 'true')
          // res.header('Access-Control-Allow-Headers', '*')
          // res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,DELETE,OPTIONS')

          corsMiddleware && (await corsMiddleware(req, res))

          const request = {
            body: req.body,
            headers: req.headers,
            method: req.method!,
            query: req.query,
          }
          return requestHandler({
            req,
            request,
            getEnveloped,
            baseOptions: appConfig,
            contextArgs() {
              return {
                req,
                next: {
                  req,
                  res,
                },
              }
            },
            buildContext,
            onResponse(result) {
              for (const { name, value } of result.headers) {
                console.log('setting header', name, value)
                res.setHeader(name, value)
              }
              res.status(result.status).json(result.payload)
            },
            onMultiPartResponse(result, defaultHandle) {
              return defaultHandle(req, res, result)
            },
            onPushResponse(result, defaultHandle) {
              return defaultHandle(req, res, result)
            },
            processRequestOptions: processRequestOptions && (() => processRequestOptions(req, res)),
            preProcessRequest,
          })
        }

        return (appHandler = EZHandler)
      }),
    ]).then((v) => v[0])

    return {
      apiHandler: async function handler(req, res) {
        if (appHandler) {
          await appHandler(req, res)
        } else {
          const result = await appPromise
          if (result.status === 'rejected')
            throw Error(
              process.env.NODE_ENV === 'development'
                ? 'Error while building EZ App: ' +
                    (result.reason?.message || JSON.stringify(result.reason))
                : 'Unexpected Error'
            )

          await (
            await result.value.app
          )(req, res)
        }
      },
      getEnveloped: LazyPromise(async () => {
        const result = await appPromise
        if (result.status === 'rejected') throw result.reason
        return result.value.getEnveloped
      }),
      ready: LazyPromise(async () => {
        const result = await appPromise
        if (result.status === 'rejected') throw result.reason
      }),
      [InternalAppBuildContextKey]: commonApp[InternalAppBuildContextKey],
    }
  }

  return {
    ...commonApp,
    buildApp,
  }
}
