import loadable from '@loadable/component'
import React from 'react'

import { isBlogState } from '../state/home-helpers'
import { StackViewProps } from './StackViewProps'

export function PagesWebPanes(props: StackViewProps) {
  const { item } = props
  return <>{isBlogState(item) && <BlogPage {...props} />}</>
}
const BlogPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./blog/BlogPage').default
    : loadable(() => import('./blog/BlogPage'))
