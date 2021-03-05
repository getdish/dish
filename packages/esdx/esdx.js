#!/usr/bin/env node

const exec = require('execa')
const fs = require('fs')
const { build } = require('esbuild')
const fg = require('fast-glob')
const { emitFlatDts } = require('@dish/rollup-plugin-flat-dts/api')

const legacy = process.argv.reverse()[0] === 'legacy'

async function go() {
  const x = Date.now()
  if (process.env.NO_CHECK) {
    console.log('skip typecheck')
  } else {
    fs.existsSync('tsconfig.tsbuildinfo') && fs.rmSync('tsconfig.tsbuildinfo')
    fs.existsSync('_') && fs.rmdirSync('_', { recursive: true })
    fs.existsSync('dist') && fs.rmdirSync('dist', { recursive: true })
  }

  async function buildTsc() {
    if (process.env.JS_ONLY) return
    if (legacy) {
      await exec('tsc', ['--emitDeclarationOnly'])
    } else {
      await exec('tsc', ['--emitDeclarationOnly'])
      const dts = await emitFlatDts({
        file: 'src/_types.d.ts',
      })
      if (dts.diagnostics.length) {
        console.log(dts.formatDiagnostics())
      }
      dts.writeOut('.')
    }
  }

  let files = (await fg(['src/**/*.ts', 'src/**/*.tsx'])).filter(
    (x) => !x.includes('.d.ts')
  )
  try {
    await Promise.all([
      buildTsc(),
      build({
        entryPoints: files,
        outdir: 'dist',
        sourcemap: true,
        target: 'node12',
        treeShaking: true,
        format: 'cjs',
        logLevel: 'error',
      }),
      build({
        entryPoints: files,
        outdir: '_',
        sourcemap: true,
        target: 'safari13',
        treeShaking: true,
        format: 'esm',
        logLevel: 'error',
      }),
    ])
  } catch (error) {
    console.log(error.message, error.stack)
  }

  console.log('built in', `${(Date.now() - x) / 1000}s`)
}

go()
