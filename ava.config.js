module.exports = {
  extensions: ['ts', 'tsx'],
  require: ['esbuild-register', 'esm'],
  timeout: '20s',
  serial: true,
  failFast: false,
  environmentVariables: {
    NODE_ENV: 'test',
  },
}
