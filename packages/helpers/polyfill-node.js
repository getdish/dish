const fetch = require('undici').fetch
globalThis['fetch'] = globalThis['fetch'] || fetch
