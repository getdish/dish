import { SEARCH_DOMAIN_INTERNAL } from '@dish/graph'
import proxy from 'express-http-proxy'

export default proxy(SEARCH_DOMAIN_INTERNAL)
