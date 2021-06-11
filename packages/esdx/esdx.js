#!/usr/bin/env node

const exec = require('execa')
const fs = require('fs-extra')
const { build } = require('esbuild')
const fg = require('fast-glob')
const { emitFlatDts } = require('rollup-plugin-flat-dts/api')

const legacy = process.argv.includes('legacy')
const skipTypes = process.argv.includes('skip-types')

async function go() {
  const x = Date.now()

  if (process.env.NO_CLEAN) {
    console.log('skip typecheck')
  } else {
    fs.existsSync('tsconfig.tsbuildinfo') && fs.rmSync('tsconfig.tsbuildinfo')
  }

  async function buildTsc() {
    if (process.env.JS_ONLY || skipTypes) return
    if (legacy) {
      await exec('tsc', ['--emitDeclarationOnly', '--declarationMap', '--declarationDir', 'types'])
      return
    }
    await exec('tsc', ['--emitDeclarationOnly', '--declarationMap'])
    const dts = await emitFlatDts({
      file: 'types.d.ts',
      internal: '**/*.native',
      compilerOptions: {
        declarationMap: true,
      },
    })
    if (dts.diagnostics.length) {
      console.log(dts.formatDiagnostics())
    }
    dts.writeOut('.')
  }

  let files = (await fg(['src/**/*.ts', 'src/**/*.tsx'])).filter((x) => !x.includes('.d.ts'))

  try {
    await Promise.all([
      buildTsc(),
      build({
        entryPoints: files,
        outdir: 'dist',
        sourcemap: 'inline',
        target: 'node14',
        keepNames: true,
        format: 'cjs',
        logLevel: 'error',
        minify: false,
        platform: 'neutral',
      }).then(() => {
        console.log('built dist')
      }),
      build({
        entryPoints: files,
        outdir: '_',
        sourcemap: true,
        target: 'es2020',
        keepNames: true,
        format: 'esm',
        logLevel: 'error',
        minify: false,
        platform: 'neutral',
      }).then(() => {
        console.log('built _')
      }),
    ])
  } catch (error) {
    console.log(error)
  } finally {
    console.log('built in', `${(Date.now() - x) / 1000}s`)
  }
}

go()

process.on('uncaughtException', console.log.bind(console))
process.on('unhandledRejection', console.log.bind(console))
