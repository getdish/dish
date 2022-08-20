import loadable from '@loadable/component'

export type PostEntry = {
  View: React.FunctionComponent
  title: string
  date: string
  author: string
  authorImage: string
  preview?: string
  private?: boolean
}

export type PostDirectory = {
  [key: string]: PostEntry
}

// order important, most recent at top

export const posts: PostDirectory = {
  'welcome-to-dish': {
    // @ts-ignore
    View: loadable(() => import('./welcome-to-dish/index.mdx')),
    title: `Baby steps`,
    date: '2018-09-29T22:12:03.284Z',
    author: 'Nate Wienert',
    authorImage: '',
  },
}
