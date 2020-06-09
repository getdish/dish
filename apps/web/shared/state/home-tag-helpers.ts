import { slugify } from '@dish/graph'
import { Action, AsyncAction } from 'overmind'

import { LIVE_SEARCH_DOMAIN } from '../constants'
import { memoize } from '../helpers/memoizeWeak'
import { isHomeState, isSearchState, shouldBeOnHome } from './home-helpers'
import {
  HomeActiveTagIds,
  HomeStateItem,
  HomeStateTagNavigable,
  OmState,
  OmStateHome,
} from './home-types'
import { HistoryItem, NavigateItem, SearchRouteParams } from './router'
import { NavigableTag, Tag, getTagId, tagFilters, tagLenses } from './Tag'

const SPLIT_TAG = '_'
const SPLIT_TAG_TYPE = '~'

export const allTagsList = [...tagFilters, ...tagLenses]
export const allTags = allTagsList.reduce((acc, cur) => {
  acc[getTagId(cur)] = cur
  return acc
}, {})

type HomeStateNav = {
  tags: NavigableTag[]
  state?: HomeStateItem
  disabledIfActive?: boolean
  replace?: boolean
}

export const navigateToTag: Action<HomeStateNav> = (om, nav) => {
  getNavigateToTags(om, nav)?.onPress?.()
}

export const getFullTags = async (tags: NavigableTag[]): Promise<Tag[]> => {
  return await Promise.all(
    tags.map(async (tag) => {
      return allTags[getTagId(tag)] ?? (await getFullTag(tag)) ?? (tag as Tag)
    })
  )
}

export const isSearchBarTag = (tag: Pick<Tag, 'type'>) =>
  tag?.type === 'country' || tag?.type === 'dish'

export const getActiveTags = memoize(
  (home: OmStateHome, state: HomeStateItem = home.currentState) => {
    if ('activeTagIds' in state) {
      const { activeTagIds } = state
      const tagIds = Object.keys(activeTagIds).filter((x) => activeTagIds[x])
      const tags: Tag[] = tagIds.map(
        (x) => home.allTags[x] ?? { id: '-1', name: x, type: 'dish' }
      )
      return tags.filter(Boolean)
    }
    return []
  }
)

type LinkButtonProps = NavigateItem & {
  onPress?: Function
}

// for easy use with Link / LinkButton
export const getNavigateToTags: Action<HomeStateNav, LinkButtonProps | null> = (
  om,
  props
) => {
  if (!props.tags.length) {
    console.log('no tags for nav?', props)
    return null
  }
  const nextState = getNextStateWithTags(om, props)
  if (nextState) {
    const navigateItem = getNavigateItemForState(om.state, nextState)
    return {
      ...navigateItem,
      onPress() {
        om.actions.home.updateActiveTags(nextState)
      },
    }
  }
  return null
}

export const getNextStateWithTags: Action<
  HomeStateNav,
  HomeStateTagNavigable | null
> = (
  om,
  {
    state = om.state.home.currentState,
    tags,
    disabledIfActive = false,
    replace = false,
  }
) => {
  let searchQuery = state.searchQuery ?? ''
  let activeTagIds: HomeActiveTagIds = {}

  // clone it to avoid confusing overmind
  if ('activeTagIds' in state) {
    if (!replace) {
      for (const key in state.activeTagIds) {
        activeTagIds[key] = state.activeTagIds[key]
      }
    }
  }

  // if they words match tag exactly, convert to tags
  let words = searchQuery.toLowerCase().split(' ')
  while (words.length) {
    const [word, ...rest] = words
    const foundTagId = om.state.home.allTagsNameToID[word.toLowerCase()]
    if (foundTagId) {
      // remove from words
      words = rest
      // add to active tags
      activeTagIds[foundTagId] = true
    } else {
      break
    }
  }

  // update query
  searchQuery = words.join(' ')

  for (const tag of tags) {
    const key = getTagId(tag)
    if (activeTagIds[key] === true && !disabledIfActive) {
      activeTagIds[key] = false
    } else {
      activeTagIds[key] = true
      // disable others
      ensureUniqueActiveTagIds(activeTagIds, om.state.home, tag)
    }
  }

  const nextState = {
    id: state.id,
    searchQuery,
    activeTagIds,
    type: state.type as any,
  }
  if (isSearchState(nextState)) {
    nextState.type = 'search'
  }
  if (isHomeState(nextState)) {
    nextState.type = 'home'
  }
  return nextState
}

// mutating
const ensureUniqueTagOfType = new Set(['lense', 'country', 'dish'])
function ensureUniqueActiveTagIds(
  activeTagIds: HomeActiveTagIds,
  home: OmStateHome,
  nextActiveTag: NavigableTag
) {
  if (!nextActiveTag) {
    throw new Error(`Missing tag...`)
  }
  for (const key in activeTagIds) {
    if (key === getTagId(nextActiveTag)) {
      continue
    }
    const type = home.allTags[key]?.type
    if (ensureUniqueTagOfType.has(type) && type === nextActiveTag.type) {
      delete activeTagIds[key]
    }
  }
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

export const getTagsFromRoute = (
  item: HistoryItem<'userSearch'>
): NavigableTag[] => {
  const tags: NavigableTag[] = []
  if (!item?.params) {
    return tags
  }
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

export const syncStateToRoute: AsyncAction<HomeStateItem, boolean> = async (
  om,
  state
) => {
  const next = getNavigateItemForState(om.state, state)
  if (om.actions.router.getShouldNavigate(next)) {
    om.actions.router.navigate(next)
    return true
  }
  return false
}

const getUrlTagInfo = (part: string, defaultType: any = ''): NavigableTag => {
  if (part.indexOf(SPLIT_TAG_TYPE) > -1) {
    const [type, name] = part.split(SPLIT_TAG_TYPE)
    return { type: type as any, name }
  }
  return { type: defaultType, name: part }
}

const getRouteFromTags = (
  { home }: OmState,
  state = home.currentState
): SearchRouteParams => {
  if (!isHomeState(state) && !isSearchState(state)) {
    throw new Error(`Getting route on bad state`)
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
    location: slugify(state.currentLocationName ?? 'here'),
  }
  const lenseTag = allActiveTags.find((x) => x.type === 'lense')?.name ?? ''
  if (lenseTag) {
    params.lense = slugify(lenseTag)
  }
  if (tags.length) {
    params.tags = tags
  } else {
    params.tags = '-'
  }
  return params
}

const getFullTag = (tag: NavigableTag): Promise<Tag | null> =>
  fetch(`${LIVE_SEARCH_DOMAIN}/tags?query=${tag.name}&type=${tag.type}&limit=1`)
    .then((res) => res.json())
    .then((tags) => tags?.[0] ?? null)
