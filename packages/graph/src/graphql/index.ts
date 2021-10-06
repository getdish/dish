import { createClient } from 'gqty'

import { queryFetcher } from './queryFetcher'
import { GeneratedSchema, generatedSchema, scalarsEnumsHash } from './schema.generated'

export * from './schema.generated'

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalarsEnumsHash,
  queryFetcher,
  catchSelectionsTimeMS: 40,
  // turning on fixed infinite loop on loading lily restaurantpage list items
  normalization: true,
  retry: false,
})

export const { query, mutation, subscription, resolved, refetch, setCache, mutate } = client
