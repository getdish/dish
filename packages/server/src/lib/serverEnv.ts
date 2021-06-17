Error.stackTraceLimit = 25

process.env.TARGET = process.env.TARGET || 'node'

require('@dish/helpers/polyfill')
// require('trace-unhandled/register')
require('isomorphic-unfetch')
