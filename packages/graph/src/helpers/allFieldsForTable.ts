import { schema } from '../graphql'
import { ModelName } from '../types'

export const allFieldsForTable = (table: ModelName): string[] => {
  return Object.keys(schema[table]?.fields ?? {})
}
