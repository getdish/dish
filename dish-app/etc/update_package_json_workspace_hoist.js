const package = require('../package.json')

const hoists = {
  '@dish/gqless-react': true,
  '@dish/gqless-utils': true,
  '@dish/gqless': true,
  snackui: true,
  '@snackui/babel-plugin': true,
  '@snackui/static': true,
  bcryptjs: true,
  'react-query': true,
  lodash: true,
  immer: true,
  recyclerlistview: true,
  'react-use': true,
  'react-hook-form': true,
  multer: true,
  uuid: true,
  '@sendgrid/mail': true,
}

const noHoists = [
  // dev deps that no hoist
  'babel-plugin-transform-inline-environment-variables',
  ...Object.keys(package.dependencies).filter(
    (x) => !hoists[x] && !x.startsWith('@dish/')
  ),
]
  .map((k) => [k, `${k}/**`])
  // @ts-ignore
  .flat()

package.workspaces.nohoist = noHoists

const fs = require('fs')
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2), 'utf8')

console.log('updated hoists')
