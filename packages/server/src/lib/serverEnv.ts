Error.stackTraceLimit = Infinity

process.env.TARGET = process.env.TARGET || 'node'

require('@dish/helpers/polyfill')
require('@dish/helpers/polyfill-node')
