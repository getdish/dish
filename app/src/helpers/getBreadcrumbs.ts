import { HomeStateItem } from '../types/homeTypes'
import { isHomeState } from './homeStateHelpers'

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
  let res: HomeStateItem[] = []
  const statesBackwards = [...states].reverse()
  for (const cur of statesBackwards) {
    if (res.length === MAX_CRUMBS) {
      break
    }
    if (isHomeState(cur)) {
      res.unshift(cur)
      return res
    }
    if (res.some((x) => x.type === cur.type)) {
      // dont stack same type (? testing)
      continue
    }
    if (isBreadcrumbState(cur.type)) {
      res.unshift(cur)
      continue
    }
  }
  if (!res.some(isHomeState)) {
    const home = statesBackwards.find(isHomeState)
    if (!home) {
      console.error('no home???')
    } else {
      res.unshift(home)
    }
  }
  return res
}

window['getBreadcrumbs'] = getBreadcrumbs
