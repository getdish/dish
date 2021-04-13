import { capitalize } from 'lodash'

import { SPLIT_TAG_PARENT } from '../constants/SPLIT_TAG'

export function guessTagName(slug: string) {
  const postfix = slug.split(SPLIT_TAG_PARENT)[1] ?? ''
  // best guess at a name
  return postfix.split('-').map(capitalize).join(' ')
}
