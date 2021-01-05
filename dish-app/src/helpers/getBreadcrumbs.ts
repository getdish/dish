import { HomeStateItem } from '../types/homeTypes'
import { isSearchState } from './homeStateHelpers'

export const isBreadcrumbState = (type: HomeStateItem['type']) => {
  return (
    type == 'search' ||
    type === 'userSearch' ||
    type == 'user' ||
    type == 'restaurant' ||
    type === 'about' ||
    type === 'blog'
  )
}

export const getBreadcrumbs = (states: HomeStateItem[]) => {
  let crumbs: HomeStateItem[] = []
  // reverse loop to find latest
  for (let i = states.length - 1; i >= 0; i--) {
    const cur = states[i]

    if (cur.type === 'home') {
      crumbs.unshift(cur)
      return crumbs
    }

    if (isBreadcrumbState(cur.type)) {
      if (crumbs.some((x) => x.type === cur.type)) {
        continue
      }
      if (
        (cur.type === 'restaurant' ||
          cur.type === 'user' ||
          cur.type == 'userSearch') &&
        crumbs.some(isSearchState)
      ) {
        continue
      }
      if (isSearchState(cur) && crumbs.some(isSearchState)) {
        continue
      }
      crumbs.unshift(cur)
      continue
    }
  }
  return crumbs
}

window['getBreadcrumbs'] = getBreadcrumbs
