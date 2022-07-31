import { Package, execPromise, getPackageJsonContents } from './utils'
import { basename, dirname } from 'path'

export async function test() {
  const dirs = await getTestablePackageJsons()
  const [parallel, serial] = [
    dirs.filter(isParallelizableTestPackageJson),
    dirs.filter((x) => !isParallelizableTestPackageJson(x)),
  ]

  console.log(`Running tests: ${parallel.length} parallel, ${serial.length} serial`)

  async function runTest({ path }: Package) {
    const dir = dirname(path)
    const name = basename(dir)
    try {
      console.log(`\n\n🏃 run test ${name} in dir ${dir}`)
      const out = await execPromise(`npm test`, {
        cwd: dir,
      })
      console.log(`--- [test] ${dir}`)
      console.log(out)
      // this was buggy, not outputting errors and pipes didnt work right
      // $.verbose = false
      // cd(dir)
      // await $`npm test`.pipe(prefixer)
      // $.verbose = true
    } catch (err) {
      console.log('--- Error running tests for', name, 'exiting')
      console.log(err.message)
      console.log(err.stack)
      process.exit(1)
    } finally {
      console.log(' END test: ', name, '\n\n')
    }
  }

  async function runParallel() {
    await Promise.all(parallel.map(runTest))
  }

  async function runSerial() {
    for (const pkg of serial) {
      await runTest(pkg)
    }
  }

  try {
    await Promise.all([
      // run all at once
      runSerial(),
      runParallel(),
    ])
    console.log('Done with tests')
  } catch (err) {
    console.log('error running tests', err.message, err.stack)
  }
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

const isParallelizableTestPackageJson = (x) => {
  return !!x.contents.tests?.parallel
}
