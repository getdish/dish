/**
 * @type {import("@gqless/cli").GqlessConfig}
 */
const config = {
  endpoint: 'http://localhost:8080/v1/graphql',
  enumsAsStrings: false,
  react: true,
  scalars: { DateTime: 'string' },
  preImport: '',
  introspection: {
    endpoint: 'http://localhost:8080/v1/graphql',
    headers: { 'x-hasura-admin-secret': 'password' },
  },
  destination: 'src/graphql/schema.generated.ts',
  subscriptions: false,
  javascriptOutput: false,
}

module.exports = config
