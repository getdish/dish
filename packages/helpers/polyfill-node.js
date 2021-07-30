const fetch = require('node-fetch')
console.log('fetch is', fetch)
globalThis['fetch'] = globalThis['fetch'] || fetch
