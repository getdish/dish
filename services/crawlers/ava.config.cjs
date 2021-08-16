module.exports = {
  ...require('../../ava.config'),
  serial: true,
  timeout: '60s',
  environmentVariables: {
    "NODE_ENV": "test"
  }
}
