// const { readFileSync } = require('fs')

// // webpack

// // const compiler = require('./compiler')
// // const path = require('path')
// // const fs = require('fs-extra')
// // const ClosureCompilerPlugin = require('closure-webpack-plugin')

// // async function run() {
// //   const externDir = path.resolve(
// //     __dirname,
// //     'tmp',
// //     'externs-' + Math.floor(Math.random() * 10)
// //   )
// //   fs.ensureFileSync(path.resolve(externDir, 'externs.js'))

// //   const rules = [
// //     {
// //       test: /\.tsx?$/,
// //       use: {
// //         loader: 'babel-loader',
// //         options: {
// //           presets: ['@babel/preset-typescript'],
// //         },
// //       },
// //     },
// //     {
// //       test: /\.css$/i,
// //       use: ['style-loader', 'css-loader'],
// //     },
// //     {
// //       test: /\.(png|svg|jpg|gif)$/,
// //       use: ['file-loader'],
// //     },
// //   ]

// //   const minimizer = [
// //     new ClosureCompilerPlugin(
// //       {
// //         mode: 'STANDARD',
// //         childCompilations: true,
// //       },
// //       {
// //         externs: [path.resolve(externDir, 'externs.js')],
// //         // language_in: 'ECMASCRIPT6',
// //         jscomp_off: 'es5Strict',
// //         jscompOff: 'es5Strict',
// //         languageOut: 'ECMASCRIPT5',
// //         // strict_mode_input: false,
// //         // debug: true,
// //         compilation_level: 'ADVANCED',
// //       }
// //     ),
// //   ]

// //   try {
// //     const [output, stats, code] = await compiler('./web/index.web.tsx', {
// //       tsconfig: path.resolve(__dirname, 'tsconfig.tscc.json'), // use es2015 modules
// //       mode: 'production',
// //       rules,
// //       minimizer,
// //       externDir,
// //     })
// //     console.log('output', output, stats, code)
// //   } catch (err) {
// //     console.log('error', err, err.toJSON, err.toString)
// //   }
// // }

// // run()

// // tscc

// // const tscc = require('@dish/tscc').default
// // const tsccConfig = JSON.parse(readFileSync('./tscc.spec.json', 'utf8'))
// // tscc(tsccConfig, './tsconfig.tscc.json').then(() => console.log('Done'))

// rollup

// const rollup = require('rollup')
// const tsccPlugin = require('@dish/rollup-plugin-tscc').default

// rollup.rollup(require('./rollup.config')).then((bundle) => {
//   bundle
//     .generate({
//       dir: '.',
//     })
//     .then(({ output }) => {
//       console.log('output', output)
//     })
// })
