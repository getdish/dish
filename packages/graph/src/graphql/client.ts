import { Client } from 'gqless'

import { createFetcher } from '../createFetcher'
import { query_root, schema } from './generated'

const fetchQuery = createFetcher('query')
// warning: using type here causes Infinity slowdown
export const client = new Client<any>(schema.query_root, fetchQuery)

// main query interface
export const query: any = client.query
