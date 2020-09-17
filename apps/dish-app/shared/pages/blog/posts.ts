import { PostEntry } from './types'

export type PostDirectory = {
  [key: string]: PostEntry
}

// order important, most recent at top
export const posts: PostDirectory = {
  'update-one': {
    view: () => import('./update-one/index.mdx'),
    title: 'Update One',
    date: '2018-09-29T22:12:03.284Z',
    author: 'Nathan Wienert',
    authorImage: null,
  },
}
