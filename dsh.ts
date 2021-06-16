#!/usr/bin/env zx

import { dirname, join, resolve } from 'path'
import { Transform } from 'stream'

import fsExtra from 'fs-extra'
import { readdir } from 'fs/promises'
import { basename } from 'node:path'
import { $, cd } from 'zx'

const { readFile, readJSON } = fsExtra

async function getFiles(
  dir: string,
  opts?: {
    excludeDir?: RegExp
    filter?: RegExp
  }
) {
  const dirents = await readdir(dir, { withFileTypes: true })
  let final: string[] = []
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      if (opts?.excludeDir && opts.excludeDir.test(res)) {
        continue
      }
      final = [...final, ...(await getFiles(res, opts))]
    } else {
      if (!opts?.filter || opts.filter.test(res)) {
        final.push(res)
      }
    }
  }
  return final
}

async function getPackageJsonPaths() {
  return await getFiles('.', {
    excludeDir: /node_modules|data/,
    filter: /package.json$/,
  })
}

type Package = {
  path: string
  contents: Record<string, any>
}

async function getPackageJsonContents() {
  return await Promise.all(
    (
      await getPackageJsonPaths()
    ).map(
      async (path) =>
        ({
          path,
          contents: await readJSON(path),
        } as Package)
    )
  )
}

async function getTestablePackageJsons() {
  return (await getPackageJsonContents()).filter((x) => {
    return (
      !x.contents['workspaces'] &&
      x.contents['scripts']['test'] &&
      x.contents['scripts']['test'] !== 'true'
    )
  })
}

async function getDockerfilePaths() {
  return await getFiles('.', {
    excludeDir: /node_modules|data/,
    filter: /Dockerfile$/,
  })
}

async function getLocalComposeImages() {
  const paths = await getDockerfilePaths()
  return (
    await Promise.allSettled(
      paths.map((p) =>
        readFile(join(dirname(p), 'Dockerfile'), 'utf8').then((x) =>
          x?.includes('registry.dishapp.com') ? p : null
        )
      )
    )
  ).flatMap((x) => (x.status === 'fulfilled' && x.value ? x.value : []))
}

const isParallelizableTestPackageJson = (x) => {
  return !!x.contents.tests?.parallel
}

async function runAllTests() {
  const dirs = await getTestablePackageJsons()
  const [parallel, serial] = [
    dirs.filter(isParallelizableTestPackageJson),
    dirs.filter((x) => !isParallelizableTestPackageJson(x)),
  ]

  console.log(`Running tests: ${parallel.length} parallel, ${serial.length} serial`)

  async function runTest({ path }: Package) {
    const dir = dirname(path)
    const name = basename(dir)
    const prefixer = new PrefixStream(`${name}:`.padStart(16))
    console.log(`> testing ${name} in ${dir}`)
    $.verbose = false
    cd(dir)
    await $`npm test`.pipe(prefixer)
    $.verbose = true
  }

  async function runParallel() {
    await Promise.all(parallel.map(runTest))
  }

  async function runSerial() {
    for (const pkg of serial) {
      await runTest(pkg)
    }
  }

  await Promise.all([
    // run all at once
    runSerial(),
    runParallel(),
  ])
}

// hacky because i cant get pipe working normally
class PrefixStream extends Transform {
  constructor(public prefix: string) {
    super()
  }
  _transform(chunk, encoding, done) {
    const out = encoding === 'utf8' ? chunk : chunk.toString()
    process.stdout.write(this.prefix + out)
    done(null, '')
  }
}

// async function pushLocalComposeImages() {
//   const dockerfiles = await getLocalComposeImages()
//   for (const file of dockerfiles) {
//     const nm = basename(dirname(file))
//     await $`docker tag registry.fly.io/dish-${nm} registry.dishapp.com/dish-${nm}`
//     await $`docker push registry.dishapp.com/dish-${nm}`
//   }
// }

try {
  await runAllTests()
  // console.log(await getPackageJsonPaths())
  // console.log(await getLocalComposeImages())
} catch (err) {
  console.log(err.message)
}
