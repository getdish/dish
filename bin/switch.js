#!/bin/node

const path = require('path')

const rootDir = path.join(__dirname, '..')
const pkgPath = path.join(rootDir, 'package.json')
const dishAppPath = path.join(rootDir, 'dish-app')

const pkg = require(pkgPath)
const execa = require('execa')
const fs = require('fs-extra')

// switches between react-native dev or not

const exec = (cmd, args, opts) => {
  console.log(`$ ${cmd} ${args.join(' ')}`)
  const p = execa(cmd, args, opts)
  p.stdout.pipe(process.stdout)
  p.stderr.pipe(process.stderr)
  return p
}

async function main() {
  if (pkg.resolutions['react-native'] === '0.0.0') {
    console.log('ENABLE react-native')
    pkg.resolutions['react-native'] = pkg.scripts['react-native-version'] ?? '0.64.0'
    fs.writeJSONSync(pkgPath, pkg, {
      spaces: 2,
    })
    await exec('yarn', ['install'], {
      cwd: rootDir,
    })
    await exec('yarn', ['postinstall'], {
      cwd: rootDir,
    })
    await exec('arch', ['-x86_64', 'pod', 'install'], {
      cwd: path.join(dishAppPath, 'ios'),
    })
  } else {
    console.log('DISABLE react-native')
    pkg.resolutions['react-native'] = '0.0.0'
    fs.writeJSONSync(pkgPath, pkg, {
      spaces: 2,
    })
    await exec('yarn', ['install'], {
      cwd: rootDir,
    })
    await exec('yarn', ['postinstall'], {
      cwd: rootDir,
    })
  }
}

main()
