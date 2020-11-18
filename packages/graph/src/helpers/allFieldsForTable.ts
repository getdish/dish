import { generatedSchema } from '../graphql'
import { ModelName } from '../types'

export const allFieldsForTable = (table: ModelName): string[] => {
  return Object.keys(generatedSchema[table] ?? {})
}
