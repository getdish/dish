#!/usr/bin/env node

const exec = require('execa')
const fs = require('fs-extra')
const { build } = require('esbuild')
const fg = require('fast-glob')
const { emitFlatDts } = require('rollup-plugin-flat-dts/api')

async function go({ legacy, skipTypes }) {
  const x = Date.now()

  if (process.env.NO_CLEAN) {
    console.log('skip typecheck')
  } else {
    fs.existsSync('tsconfig.tsbuildinfo') && fs.rmSync('tsconfig.tsbuildinfo')
  }

  async function buildTsc() {
    if (process.env.JS_ONLY || skipTypes) return

    if (legacy) {
      await exec('npx', [
        'tsc',
        '--emitDeclarationOnly',
        '--declarationMap',
        '--declarationDir',
        'types',
      ])
      return
    }

    await exec('npx', ['tsc', '--emitDeclarationOnly', '--declarationMap'])

    // if its already a single-file we need to handle it diff
    if (await fs.pathExists('index.d.ts')) {
      await fs.remove('types.d.ts')
      await fs.remove('types.d.ts.map')
      await fs.move('index.d.ts', 'types.d.ts')
      await fs.move('index.d.ts.map', 'types.d.ts.map')
      const contents = await fs.readFile('types.d.ts', 'utf8')
      await fs.writeFile(
        'types.d.ts',
        contents.replace(
          '//# sourceMappingURL=index.d.ts.map',
          '//# sourceMappingURL=types.d.ts.map'
        )
      )
    } else {
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

exports.go = go

if (!process.env.DISABLE_AUTORUN) {
  process.on('uncaughtException', console.log.bind(console))
  process.on('unhandledRejection', console.log.bind(console))
  const legacy = process.argv.includes('legacy')
  const skipTypes = process.argv.includes('skip-types')
  go({ legacy, skipTypes })
}
