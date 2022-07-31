import { ExecOptions, exec } from 'child_process'
import fsExtra from 'fs-extra'
import { readdir } from 'fs/promises'
import { resolve } from 'path'

const { readJSON } = fsExtra

export type Package = {
  path: string
  contents: Record<string, any>
}

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
  console.log('excluding test env broke + crawlers (http api seems down atm)')
  return await getFiles('.', {
    excludeDir: /node_modules|data|crawlers/,
    filter: /package.json$/,
  })
}

export async function getPackageJsonContents() {
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

export async function execPromise(command: string, opts?: ExecOptions) {
  return await new Promise((res, rej) => {
    exec(command, opts, (err, stdout, stderr) => {
      let out = `${stdout}\n`
      if (stderr && stderr !== stdout) {
        out += `stderr: ${stderr}\n`
      }
      if (err) {
        out += `Error in execPromise: ${err.message}\nStack: ${err.stack}\n`
        return rej(new Error(out))
      }
      res(out)
    })
  })
}
