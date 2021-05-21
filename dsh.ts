import { resolve } from 'path'

import { readJSON } from 'fs-extra'
import { readdir } from 'fs/promises'

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
    excludeDir: /node_modules/,
    filter: /package.json$/,
  })
}

async function getPackageJsonContents() {
  return await Promise.all(
    (
      await getPackageJsonPaths()
    ).map(async (path) => ({
      path,
      contents: await readJSON(path),
    }))
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

async function run() {
  console.log(await getTestablePackageJsons())
}

run()
