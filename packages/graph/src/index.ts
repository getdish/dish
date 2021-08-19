import 'isomorphic-unfetch'

if (process.env.TARGET !== 'web') {
  require('@dish/helpers/polyfill')
}

export * from './react'
export * from './graphql'
export * from './startLogging'
export * from './types'
export * from './typesExtra'
export * from './constants'
export * from './Auth'

export * from './getAuth'
export * from './helpers/userHelpers'
export * from './helpers/flushTestData'
export * from './helpers/tagHelpers'
export * from './helpers/reviewAnalyze'
export * from './helpers/levenshteinDistance'
export * from './helpers/queryHelpers'
export * from './helpers/queryResolvers'
export * from './helpers/slugify'

export * from './queries/listQueries'
export * from './queries/menuItemQueries'
export * from './queries/restaurantQueries'
export * from './queries/restaurantTagQueries'
export * from './queries/reviewQueries'
export * from './queries/searchQueries'
export * from './queries/settingQueries'
export * from './queries/tagTagQueries'
export * from './queries/tagQueries'
export * from './queries/userQueries'
