#!/usr/bin/env zx

import { basename, join, resolve } from 'path'
import { dirname } from 'path'

import fsExtra from 'fs-extra'
import { readdir } from 'fs/promises'
import { $ } from 'zx'

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

async function pushLocalComposeImages() {
  const dockerfiles = await getLocalComposeImages()
  for (const file of dockerfiles) {
    const nm = basename(dirname(file)).replace('dish-', '')
    await $`docker tag registry.fly.io/dish-${nm} registry.dishapp.com/dish-${nm}`
    await $`docker push registry.dishapp.com/dish-${nm}`
  }
}

try {
  console.log(await getPackageJsonPaths())
  console.log(await getLocalComposeImages())
  console.log(await pushLocalComposeImages())
} catch (err) {
  console.log(err.message)
}
