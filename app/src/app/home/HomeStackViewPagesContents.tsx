import loadable from '@loadable/component'
import React from 'react'

import { isBlogState } from '../../helpers/homeStateHelpers'
import { HomeStackViewProps } from './HomeStackViewProps'

export function HomeStackViewPagesContents(props: HomeStackViewProps) {
  const { item } = props
  return <>{isBlogState(item) && <BlogPage {...props} />}</>
}

const BlogPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./blog/BlogPage').default
    : loadable(() => import('./blog/BlogPage'))