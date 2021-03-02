#!/usr/bin/env node

const exec = require('execa')
const fs = require('fs')
const { build } = require('esbuild')
const fg = require('fast-glob')

async function go() {
  if (process.env.NO_CHECK) {
    console.log('skip typecheck')
  } else {
    fs.existsSync('tsconfig.tsbuildinfo') &&
      fs.unlinkSync('tsconfig.tsbuildinfo')
    fs.existsSync('_') && fs.unlinkSync('_')
    fs.existsSync('dist') && fs.unlinkSync('dist')
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
