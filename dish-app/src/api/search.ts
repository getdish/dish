import { SEARCH_DOMAIN_INTERNAL } from '@dish/graph'
import proxy from 'express-http-proxy'

console.log('proxy is', proxy)

export default proxy(SEARCH_DOMAIN_INTERNAL)
