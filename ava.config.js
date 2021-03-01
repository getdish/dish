module.exports = {
  extensions: ['ts', 'tsx'],
  require: ['esbuild-register', 'esm', 'tsconfig-paths/register'],
  timeout: '30s',
  serial: true,
  failFast: false,
}
