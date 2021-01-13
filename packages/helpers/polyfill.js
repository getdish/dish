delete require.cache[require.resolve('./_/polyfill-localStorage')]
console.log('requiring...', require.resolve('./_/polyfill-localStorage'))
require('./_/polyfill-localStorage')
