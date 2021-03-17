#!/usr/bin/env node

const exec = require('execa')
const fs = require('fs-extra')
const { build } = require('esbuild')
const fg = require('fast-glob')
const { emitFlatDts } = require('rollup-plugin-flat-dts/api')

const legacy = process.argv.reverse()[0] === 'legacy'

async function go() {
  const x = Date.now()

  if (process.env.NO_CLEAN) {
    console.log('skip typecheck')
  } else {
    fs.existsSync('tsconfig.tsbuildinfo') && fs.rmSync('tsconfig.tsbuildinfo')
    fs.existsSync('_') && fs.rmdirSync('_', { recursive: true })
    fs.existsSync('dist') && fs.rmdirSync('dist', { recursive: true })
  }

  async function buildTsc() {
    if (process.env.JS_ONLY) return
    await exec('tsc', ['--emitDeclarationOnly', '--declarationMap'])
    const dts = await emitFlatDts({
      file: 'types.d.ts',
      compilerOptions: {
        declarationMap: true,
      },
    })
    if (dts.diagnostics.length) {
      console.log(dts.formatDiagnostics())
    }
    dts.writeOut('.')
  }

  let files = (await fg(['src/**/*.ts', 'src/**/*.tsx'])).filter(
    (x) => !x.includes('.d.ts')
  )

  try {
    if (legacy) {
      await exec('tsc', ['--emitDeclarationOnly', '--declarationMap'])
      await fs.copy('_', 'dist')
    }
    await Promise.all([
      legacy ? null : buildTsc(),
      build({
        entryPoints: files,
        outdir: 'dist',
        sourcemap: true,
        target: 'node12',
        treeShaking: true,
        format: 'cjs',
        logLevel: 'error',
      }).then(() => {
        console.log('built dist')
      }),
      build({
        entryPoints: files,
        outdir: '_',
        sourcemap: true,
        target: 'safari13',
        treeShaking: true,
        format: 'esm',
        logLevel: 'error',
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
