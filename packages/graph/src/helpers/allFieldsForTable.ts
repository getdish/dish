import { schema } from '../graphql'

export const allFieldsForTable = (table: string): string[] => {
  return Object.keys(schema[table]?.fields ?? {})
}
