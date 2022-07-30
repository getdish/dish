if (process.env.TAMAGUI_TARGET !== 'web') {
  const fetch = require('undici').fetch
  globalThis['fetch'] = globalThis['fetch'] || fetch
}
