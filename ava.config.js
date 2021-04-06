module.exports = {
  extensions: ['ts', 'tsx'],
  require: ['@dish/esbuild-register', 'esm'],
  timeout: '20s',
  serial: true,
  failFast: false,
}
