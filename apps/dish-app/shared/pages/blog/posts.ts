import loadable from '@loadable/component'

export type PostEntry = {
  View: React.SFC
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
  'update-one': {
    // @ts-ignore
    View: loadable(() => import('./update-one/index.mdx')),
    title: 'Update One',
    date: '2018-09-29T22:12:03.284Z',
    author: 'Nathan Wienert',
    authorImage: null,
  },
}
