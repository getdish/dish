module.exports = {
  extensions: ['ts', 'tsx'],
  require: ['ts-node/register', 'tsconfig-paths/register', 'esm'],
  timeout: '30s',
  serial: true,
  failFast: false,
}
