export const JWT_SECRET = process.env.JWT_SECRET || '12345678901234567890123456789012'
export const HASURA_SECRET =
  process.env.HASURA_GRAPHQL_ADMIN_SECRET || (process.env.TARGET === 'node' ? 'password' : '')

console.log('secrets>>', HASURA_SECRET[0], JWT_SECRET[0])
