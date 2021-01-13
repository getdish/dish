import 'trace-unhandled/register'
import '@dish/helpers/polyfill'
import 'isomorphic-unfetch'

process.env.TARGET = process.env.TARGET || 'node'
