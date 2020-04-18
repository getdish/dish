import { x } from './xy'

console.log(1 + 1 + x)

function swap([a, b]: number[]) {
  return [b, a]
}
function sort([a, b]) {
  return a > b ? [a, b] : swap([a, b])
}
const a = [1, 2]
const b = swap(a)
console.log(sort([1, b]))

// // preload imports
// import './bootstrapEnv'
// import './base.css'

// import { createOvermind } from 'overmind'
// // // import here
// import React from 'react'
// import { hydrate, render } from 'react-dom'
// import { AppRegistry } from 'react-native'

// import {
//   OVERMIND_MUTATIONS,
//   isPreact,
//   isSSR,
//   isWorker,
// } from '../shared/constants'
// import { config } from '../shared/state/om'
// import { App } from '../shared/views/App'
// import { x } from './xy'

// console.log(1 + 1 + x)

// //
// // NOTE: import order is important here DONT USE `import`
// //       add require to the part that says "import here"
// // NOTE: nothing should import this file! its the root!
// //

// // register root component
// AppRegistry.registerComponent('dish', () => App)

// window['React'] = React

// // // exports
// if (isSSR) {
//   exports.App = require('../shared/views/App').App
//   exports.config = config
//   exports.ReactDOMServer = require('react-dom/server')
// }
// if (!isWorker) {
//   exports.Helmet = require('react-helmet')
// }

// let rootEl = document.getElementById('root')

// async function start() {
//   if (!isWorker) {
//     require('./mapkit')
//     await startMapKit()
//     console.log('started mapkit')
//   }

//   const om = createOvermind(config, {
//     devtools: `localhost:3032`,
//     logProxies: true,
//     hotReloading: true,
//   })
//   window['om'] = om

//   // can render splash here

//   await om.initialized

//   if (OVERMIND_MUTATIONS) {
//     hydrate(<App overmind={om} />, document.getElementById('root'))
//   } else {
//     // for worker
//     if (isWorker) {
//       rootEl = document.createElement('div')
//       document.body.appendChild(rootEl)
//     }
//     render(<App overmind={om} />, rootEl)
//   }
// }

// if (!window['IS_SSR_RENDERING'] && !window['STARTED']) {
//   window['STARTED'] = true
//   console.log('Starting from index')
//   start()
// }

// async function startMapKit() {
//   const token = `eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkwzQ1RLNTYzUlQifQ.eyJpYXQiOjE1ODQ0MDU5MzYuMjAxLCJpc3MiOiIzOTlXWThYOUhZIn0.wAw2qtwuJkcL6T6aI-nLZlVuwJZnlCNg2em6V1uopx9hkUgWZE1ISAWePMoRttzH_NPOem4mQfrpmSTRCkh2bg`
//   // init mapkit
//   // @ts-ignore
//   mapkit.init({
//     authorizationCallback: (done) => {
//       done(token)
//     },
//   })
// }

// if (module['hot']) {
//   module['hot'].accept(() => {
//     console.log('hmr root')
//   })
// }
