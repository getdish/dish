import { HomeStateItem } from '../types/homeTypes'

const breadCrumbTypes = {
  search: true,
  user: true,
  restaurant: true,
  about: true,
  blog: true,
  list: true,
}

export const isBreadcrumbState = (type: HomeStateItem['type']) => {
  return breadCrumbTypes[type]
}

const MAX_CRUMBS = 3 //isTouchDevice && isWeb ? 3 : 5

export const getBreadcrumbs = (states: HomeStateItem[]) => {
  let crumbs: HomeStateItem[] = []
  // reverse loop to find latest
  for (let i = states.length - 1; i >= 0; i--) {
    const cur = states[i]

    if (crumbs.length === MAX_CRUMBS) {
      break
    }

    if (cur.type === 'home') {
      crumbs.unshift(cur)
      return crumbs
    }

    if (isBreadcrumbState(cur.type)) {
      crumbs.unshift(cur)
      continue
    }
  }

  return crumbs
}

window['getBreadcrumbs'] = getBreadcrumbs
