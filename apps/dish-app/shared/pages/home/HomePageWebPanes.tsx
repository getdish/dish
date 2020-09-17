import loadable from '@loadable/component'

import { isBlogState } from '../../state/home-helpers'
import { HomePagePaneProps } from './HomePagePaneProps'

export function HomePageWebPanes(props: HomePagePaneProps) {
  const { item } = props
  return <>{isBlogState(item) && <BlogPage {...props} />}</>
}
const BlogPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('../blog/BlogPage').default
    : loadable(() => import('../blog/BlogPage'))
