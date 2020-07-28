import { memoize } from '../../helpers/memoizeWeak'
import { HomeStateItem, HomeStateItemSimple } from '../../state/home'
import { isSearchState } from '../../state/home-helpers'

export const isBreadcrumbState = (type: HomeStateItem['type']) => {
  return (
    type === 'about' ||
    type == 'search' ||
    type === 'userSearch' ||
    type == 'user' ||
    type == 'restaurant'
  )
}

export const getBreadcrumbs = memoize((states: HomeStateItem[]) => {
  let crumbs: HomeStateItemSimple[] = []
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
})
