import 'reflect-metadata'

import { graphql } from '@tsmirror/graphql'

import randomName from './graph/randomName'

const out = graphql({
  Query: {
    randomName,
  },
  Mutation: {
    go(x: string): boolean {
      return true
    },
  },
})

// @ts-ignore
console.log('what is', out)
