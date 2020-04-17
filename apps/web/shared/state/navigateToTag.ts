import { slugify } from '@dish/models'
import { isEqual } from '@o/fast-compare'
import { Action, AsyncAction } from 'overmind'

import {
  HomeStateItem,
  OmState,
  SPLIT_TAG,
  SPLIT_TAG_TYPE,
  getActiveTags,
  isHomeState,
  isSearchState,
  shouldBeOnHome,
} from './home'
import { NavigateItem } from './router'
import { NavigableTag, getTagId } from './Tag'

const ensureUniqueTagOfType = new Set(['lense', 'country'])

type HomeStateNav = { tag: NavigableTag; state?: HomeStateItem }

export const navigateToTag: Action<HomeStateNav> = (om, nav) => {
  getNavigateToTag(om, nav)?.onPress?.()
}

type LinkButtonProps = NavigateItem & {
  onPress?: Function
}

// for easy use with Link / LinkButton
export const getNavigateToTag: Action<HomeStateNav, LinkButtonProps> = (
  om,
  { state = om.state.home.currentState, tag }
) => {
  const nextState = getNextHomeStateWithTag(om, {
    tag,
    state,
  })
  const navigateItem = getNavigateItemForState(om.state, nextState)
  return {
    ...navigateItem,
    // but dont want to be causing tons of re-renders
    // if isEqual(om.state.home.currentNavItem, navigateItem) dont!?
    onPress: () => om.actions.home._toggleTagOnHomeState(tag),
  }
}

const getNextHomeStateWithTag: Action<HomeStateNav, HomeStateItem> = (
  om,
  { state, tag }
) => {
  if (!isHomeState(state) && !isSearchState(state)) {
    return null
  }

  if (!tag) throw new Error(`No tag`)
  const key = getTagId(tag)
  const ensureUnique = ensureUniqueTagOfType.has(tag.type)

  // clone it to avoid confusing overmind
  const nextActiveTagIds = {}
  for (const key in state.activeTagIds) {
    if (state.activeTagIds[key]) {
      nextActiveTagIds[key] = true
    }
  }

  // TODO some duplicate logic with _toggleTagOnHomeState we can fix
  if (ensureUnique) {
    for (const key in nextActiveTagIds) {
      if (om.state.home.allTags[key]?.type === tag.type) {
        delete nextActiveTagIds[key]
      }
    }
    nextActiveTagIds[key] = true
  } else {
    nextActiveTagIds[key] = !nextActiveTagIds[key]
  }

  return {
    ...state,
    activeTagIds: nextActiveTagIds,
  }
}

export const _toggleTagOnHomeState: AsyncAction<NavigableTag> = async (
  om,
  next
) => {
  const state = om.state.home.currentState
  if (!next || (!isHomeState(state) && !isSearchState(state))) return

  if (ensureUniqueTagOfType.has(next.type)) {
    // remove old
    for (const key in state.activeTagIds) {
      const tag = om.state.home.allTags[key]
      if (tag?.type === next.type) {
        state.activeTagIds[key] = false
      }
    }
  }

  if (!next) throw new Error(`No tag`)
  const key = getTagId(next)
  state.activeTagIds[key] = !state.activeTagIds[key]
  await om.actions.home._afterTagChange()
}

// push to search on adding lense
// if (isHomeState(state) && willSearch) {
//   // if adding a searchable tag while existing search query, replace it
//   if (state.searchQuery) {
//     state.searchQuery = ''
//   }
//   // go to new route first
//   await om.actions.home._syncStateToRoute({
//     ...state,
//     activeTagIds: { ...state.activeTagIds, [getTagId(val)]: true },
//   })
//   state = om.state.home.currentState
//   console.log('on search now?', state)
// }

export const getNavigateItemForState = (
  omState: OmState,
  ogState: HomeStateItem
): NavigateItem => {
  const { home, router } = omState
  const state = ogState || home.currentState
  const isHome = isHomeState(state)
  const isSearch = isSearchState(state)
  // we only handle "special" states here (home/search)
  if (!isHome && !isSearch) {
    return {
      name: state.type,
      params: router.curPage.params,
    }
  }
  // if going home, just go there
  const shouldBeHome = shouldBeOnHome(home, state)
  if (shouldBeHome) {
    return { name: 'home' }
  }

  const params = getTagRouteParams(omState, state)
  if (state.searchQuery) {
    params.search = state.searchQuery
  }
  const isOnUserSearch =
    state.type === 'userSearch' || router.curPage.name === 'userSearch'
  if (isOnUserSearch) {
    params.username = router.curPage.params.username
  }

  let name = isOnUserSearch ? 'userSearch' : (state.type as any)
  if (name === 'home' && !shouldBeHome) {
    name = 'search'
  }

  const isChangingType = ogState
    ? ogState.type === home.currentState.type
    : true
  const replace = !isChangingType

  return {
    name,
    params,
    replace,
  }
}

const getTagRouteParams = (
  { home }: OmState,
  state = home.currentState
): { [key: string]: string } => {
  if (!isHomeState(state) && !isSearchState(state)) {
    return null
  }
  const allActiveTags = getActiveTags(home, state)
  // build our final path segment
  const filterTags = allActiveTags.filter((x) => x.type === 'filter')
  const otherTags = allActiveTags.filter(
    (x) => x.type !== 'lense' && x.type !== 'filter'
  )
  let tags = `${filterTags.map((x) => slugify(x.name)).join(SPLIT_TAG)}`
  if (otherTags.length) {
    if (tags.length) {
      tags += SPLIT_TAG
    }
    tags += `${otherTags
      .map((t) => `${t.type}${SPLIT_TAG_TYPE}${slugify(t.name)}`)
      .join(SPLIT_TAG)}`
  }
  const params: any = {
    location: 'here',
  }
  const lenseTag = allActiveTags.find((x) => x.type === 'lense')?.name ?? ''
  if (lenseTag) {
    params.lense = slugify(lenseTag)
  }
  if (tags.length) {
    params.tags = tags
  }
  return params
}
