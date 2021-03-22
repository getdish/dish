import 'reflect-metadata'

import path from 'path'

import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'

import { resolvers } from './prisma/type-graphql'

interface Context {
  prisma: PrismaClient
}

async function main() {
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: path.resolve(__dirname, './generated-schema.graphql'),
    validate: false,
  })

  const prisma = new PrismaClient()
  await prisma.$connect()

  const server = new ApolloServer({
    schema,
    playground: true,
    context: (): Context => ({ prisma }),
  })
  const { port } = await server.listen(4000)
  console.log(`GraphQL is listening on ${port}!`)
}

main().catch(console.error)
