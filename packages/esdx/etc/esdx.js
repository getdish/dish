#!/usr/bin/env node

const exec = require('execa')
const fs = require('fs')
const { build } = require('esbuild')
const fg = require('fast-glob')

async function go() {
  if (process.env.NO_CHECK) {
    console.log('skip typecheck')
  } else {
    fs.existsSync('tsconfig.tsbuildinfo') && fs.rmSync('tsconfig.tsbuildinfo')
    fs.existsSync('_') && fs.rmdirSync('_', { recursive: true })
    fs.existsSync('dist') && fs.rmdirSync('dist', { recursive: true })
    await exec(`tsc`, ['-b'])
    await exec(`cp`, `-r _ dist`.split(' '))
  }

  let files = await fg(['src/**/*.ts', 'src/**/*.tsx'])

  await Promise.all([
    build({
      entryPoints: files,
      outdir: '_',
      sourcemap: true,
      target: 'safari13',
    }),
    build({
      entryPoints: files,
      outdir: 'dist',
      sourcemap: true,
      target: 'node12.19.0',
    }),
  ])
}

go()
