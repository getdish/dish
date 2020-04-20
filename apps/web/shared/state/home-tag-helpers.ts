import { TagType, slugify } from '@dish/models'
import { Action, AsyncAction } from 'overmind'

import {
  HomeActiveTagIds,
  HomeState,
  HomeStateItem,
  OmState,
  OmStateHome,
  SPLIT_TAG,
  SPLIT_TAG_TYPE,
  getActiveTags,
  isHomeState,
  isSearchState,
  shouldBeOnHome,
} from './home'
import { HistoryItem, NavigateItem, SearchRouteParams } from './router'
import { NavigableTag, Tag, getTagId } from './Tag'

const ensureUniqueTagOfType = new Set(['lense'])
const ensureUniqueTag = new Set(['country', 'dish'])

type HomeStateNav = { tag: NavigableTag; state?: HomeStateItem }

export const navigateToTag: Action<HomeStateNav> = (om, nav) => {
  getNavigateToTag(om, nav)?.onPress?.()
}

export const navigateToTagId: Action<string> = (om, tagId) => {
  navigateToTag(om, { tag: om.state.home.allTags[tagId] })
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
    onPress: (e) => {
      e?.preventDefault()
      e?.stopPropagation()
      om.actions.home._toggleTagOnHomeState(tag)
    },
  }
}

const getNextHomeStateWithTag: Action<HomeStateNav, HomeStateItem> = (
  om,
  { state, tag }
) => {
  if (!isHomeState(state) && !isSearchState(state)) {
    return null
  }

  if (!tag) {
    debugger
  }

  // clone it to avoid confusing overmind
  let nextActiveTagIds: HomeActiveTagIds = {}
  for (const key in state.activeTagIds) {
    if (state.activeTagIds[key]) {
      nextActiveTagIds[key] = true
    }
  }

  const key = getTagId(tag)
  if (nextActiveTagIds[key] === true) {
    nextActiveTagIds[key] = false
  } else {
    nextActiveTagIds[key] = true
    // disable others
    ensureUniqueActiveTagIds(nextActiveTagIds, om.state.home, tag)
  }

  return {
    ...state,
    activeTagIds: nextActiveTagIds,
  }
}

// mutating
function ensureUniqueActiveTagIds(
  activeTagIds: HomeActiveTagIds,
  home: OmStateHome,
  nextActiveTag: NavigableTag
) {
  for (const key in activeTagIds) {
    if (key === getTagId(nextActiveTag)) {
      continue
    }
    const type = home.allTags[key]?.type
    if (ensureUniqueTagOfType.has(type) && type === nextActiveTag.type) {
      delete activeTagIds[key]
    }
    if (ensureUniqueTag.has(nextActiveTag.type) && ensureUniqueTag.has(type)) {
      delete activeTagIds[key]
    }
  }
}

export const _toggleTagOnHomeState: AsyncAction<NavigableTag> = async (
  om,
  next
) => {
  const state = om.state.home.currentState
  if (!next || (!isHomeState(state) && !isSearchState(state))) {
    return
  }
  if (!next) {
    debugger
  }
  const key = getTagId(next)
  state.activeTagIds[key] = !state.activeTagIds[key]
  ensureUniqueActiveTagIds(state.activeTagIds, om.state.home, next)
  await om.actions.home._afterTagChange()
}

export const getNavigateItemForState = (
  omState: OmState,
  ogState: HomeStateItem
): NavigateItem => {
  const { home, router } = omState
  const state = ogState || home.currentState
  const isHome = isHomeState(state)
  const isSearch = isSearchState(state)
  const curParams = router.curPage.params

  // we only handle "special" states here (home/search)
  if (!isHome && !isSearch) {
    return {
      name: state.type,
      params: curParams,
    }
  }
  // if going home, just go there
  const shouldBeHome = shouldBeOnHome(home, state)
  if (shouldBeHome) {
    return { name: 'home' }
  }

  // build params
  const params = getRouteFromTags(omState, state)
  if (state.searchQuery) {
    params.search = state.searchQuery
  }
  if (state.type === 'userSearch') {
    params.username = curParams.username
  }

  let name = state.type as any
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

const getUrlTagInfo = (part: string, defaultType: any = ''): NavigableTag => {
  if (part.indexOf(SPLIT_TAG_TYPE) > -1) {
    const [type, name] = part.split(SPLIT_TAG_TYPE)
    return { type: type as any, name }
  }
  return { type: defaultType, name: part }
}

export const getTagsFromRoute = (
  item: HistoryItem<'userSearch'>
): NavigableTag[] => {
  const tags: NavigableTag[] = []
  if (item.params.lense) {
    tags.push(getUrlTagInfo(item.params.lense, 'lense'))
  }
  if (item.params.tags) {
    for (const tag of item.params.tags.split(SPLIT_TAG)) {
      tags.push(getUrlTagInfo(tag, 'filter'))
    }
  }
  return tags
}

const getRouteFromTags = (
  { home }: OmState,
  state = home.currentState
): SearchRouteParams => {
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
