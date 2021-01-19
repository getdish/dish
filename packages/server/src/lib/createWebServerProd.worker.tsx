import * as Path from 'path'
import { parentPort, workerData } from 'worker_threads'

import { client } from '@dish/graph'
import { ChunkExtractor } from '@loadable/server'
import { matchesUA } from 'browserslist-useragent'
import express from 'express'
import { existsSync, pathExists, readFileSync, renameSync } from 'fs-extra'
import React from 'react'
import { Helmet } from 'react-helmet'

import { ServerConfigNormal } from '../types'
import { buildApp } from './buildApp'
import { createWebServerDev } from './createWebServerDev'
import { getWebpackConfigBuilder } from './getWebpackConfigBuilder'
import { shimBrowser } from './shimBrowser'

const jsdom = shimBrowser()

const config = workerData as ServerConfigNormal
const { rootDir, port } = config
const app = express()
const createConfig = getWebpackConfigBuilder({ rootDir })

createWebServerProd(app, {
  ...config,
  createConfig,
})

async function createWebServerProd(app: any, config: ServerConfigNormal) {
  try {
    const {
      clean,
      watch,
      createConfig,
      rootDir,
      buildDir,
      webpackConfig,
    } = config
    if (watch) {
      createWebServerDev(app, config)
      app.listen(port)
      parentPort?.postMessage('done')
      return
    } else {
      console.log(' [web] building...')
      await buildApp({
        clean,
        createConfig,
        webpackConfig,
      })
    }

    const ssrDir = Path.join(buildDir, 'ssr')

    if (!(await pathExists(ssrDir))) {
      console.error(`No path exists: ${ssrDir}`)
      process.exit(1)
    }

    const statsFile = Path.resolve(Path.join(ssrDir, 'loadable-stats.json'))
    const extractor = new ChunkExtractor({ statsFile })

    global['React'] = React
    global['__DEV__'] = process.env.NODE_ENV === 'development'
    global['requestIdleCallback'] = global['requestIdleCallback'] || setTimeout

    const ssrPath = Path.join(
      ssrDir,
      `static/js/app.ssr.${process.env.NODE_ENV ?? 'production'}.js`
    )
    const userApp = require(ssrPath)
    const { App, ReactDOMServer } = userApp

    if (!App || !ReactDOMServer) {
      console.error(`\nError: Bad exported bundle`, {
        path: ssrPath,
        App,
        ReactDOMServer,
      })
      process.exit()
    }

    // static assets
    // const indexFile = Path.join(ssrDir, 'index.html')
    const clientBuildPath = Path.join(buildDir, 'modern')
    const clientBuildLegacyPath = Path.join(buildDir, 'legacy')

    // move index.html to backup location so we dont serve via express.static
    const [clientHTMLModern, clientHTMLLegacy] = [
      Path.join(clientBuildPath, 'index.html'),
      Path.join(clientBuildLegacyPath, 'index.html'),
    ].map((path) => {
      const outPath = Path.join(Path.dirname(path), 'index-original.html')
      if (existsSync(path)) {
        renameSync(path, outPath)
      }
      return readFileSync(outPath, 'utf8')
    })

    app.use('/', express.static(clientBuildPath))
    app.use('/', express.static(clientBuildLegacyPath))

    app.get('*', async (req, res) => {
      console.log('req', req.hostname, req.path)
      const htmlPath = Path.join(rootDir, 'src', 'index.html')
      const template = readFileSync(htmlPath, 'utf8')
      jsdom.reconfigure({
        url: 'http://dishapp.com' + req.path,
      })
      const app = <App />

      delete client.cache.query

      try {
        ReactDOMServer.renderToString(app)
      } catch (err) {
        console.warn('error', err)
      }

      await client.scheduler.resolving?.promise
      const cacheSnapshot = JSON.stringify(client.cache)

      // const { cacheSnapshot } = await prepareReactRender(app)
      // async suspense rendering
      // await ssrPrepass(app)
      const jsx = extractor.collectChunks(<App cacheSnapshot={cacheSnapshot} />)

      console.log('scripts are', extractor.getScriptTags())

      const appHtml = ReactDOMServer.renderToString(jsx)

      // need to fool helmet back into thinking were in the node
      // @ts-ignore
      const helmet = Helmet.renderStatic()

      const useragent = req.get('User-Agent')
      const isModernUser = matchesUA(useragent, {
        // safari doesnt have requestidlecallback
        browsers: ['Chrome >= 61', 'Firefox >= 73'],
        env: 'modern',
        allowHigherVersions: true,
      })

      const clientHTML = isModernUser ? clientHTMLModern : clientHTMLLegacy
      const clientScripts =
        clientHTML.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gm) ?? []
      const clientLinks = clientHTML.match(/<link\b[^>]*>/gm) ?? []

      let out = ''
      for (const line of template.split('\n')) {
        if (line.includes('<!-- app -->')) {
          out += appHtml
          continue
        }
        if (line.includes('<!-- head -->')) {
          out += `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
  `
          continue
        }
        if (line.indexOf('<!-- scripts -->') >= 0) {
          out += `
        <script>
          window.__CACHE_SNAPSHOT = "${cacheSnapshot}"
        </script>
        ${clientScripts.join('\n')}\n`
          continue
        }
        if (line.indexOf('<!-- links -->') >= 0) {
          out += `
        ${clientLinks.join('\n')}\n`
          continue
        }
        out += line
      }

      if (process.env.DEBUG) {
        console.log('debug', { isModernUser, helmet, appHtml, out })
      }

      console.log('resolve', req.hostname, req.path, out.length)
      res.send(out)
    })

    app.listen(port)
    parentPort?.postMessage('done')
  } catch (err) {
    parentPort?.postMessage(err)
  }
}
