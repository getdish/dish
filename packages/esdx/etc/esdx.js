#!/usr/bin/env node

const exec = require('execa')
const fs = require('fs')
const { build } = require('esbuild')
const fg = require('fast-glob')

async function go() {
  const x = Date.now()
  if (process.env.NO_CHECK) {
    console.log('skip typecheck')
  } else {
    fs.existsSync('tsconfig.tsbuildinfo') && fs.rmSync('tsconfig.tsbuildinfo')
    fs.existsSync('_') && fs.rmdirSync('_', { recursive: true })
    fs.existsSync('dist') && fs.rmdirSync('dist', { recursive: true })
  }

  let files = await fg(['src/**/*.ts', 'src/**/*.tsx'])

  try {
    await Promise.all([
      exec(`tsc`, ['--emitDeclarationOnly']),
      build({
        entryPoints: files,
        outdir: '_',
        sourcemap: true,
        target: 'safari13',
        treeShaking: true,
      }),
      build({
        entryPoints: files,
        outdir: 'dist',
        sourcemap: true,
        target: 'node12',
        treeShaking: true,
        format: 'cjs',
      }),
    ])
  } catch (error) {
    console.log(error.stack)
  }

  // stupid ts have to hack this
  const name = JSON.parse(fs.readFileSync('package.json')).name
  const types = '@types/index.d.ts'
  if (fs.existsSync(types)) {
    const out = fs.readFileSync(types, 'utf-8')
    fs.writeFileSync(
      types,
      out.replace(`declare module "index" {`, `declare module "${name}" {`)
    )
  }

  console.log('built in', `${(Date.now() - x) / 1000}s`)
}

go()
