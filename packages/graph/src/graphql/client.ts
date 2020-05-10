import { Client } from 'gqless'

import { createFetcher } from '../createFetcher'
import { query_root, schema } from './generated'

const fetchQuery = createFetcher('query')
export const client = new Client(schema.query_root, fetchQuery)
export const query: query_root = client.query
