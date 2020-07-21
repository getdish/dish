import { Tag, slugify } from '@dish/graph'
import { HistoryItem, NavigateItem } from '@dish/router'
import { cloneDeep } from 'lodash'
import { AsyncAction } from 'overmind'

import { LIVE_SEARCH_DOMAIN } from '../constants'
import { isHomeState, isSearchState, shouldBeOnHome } from './home-helpers'
import {
  HomeActiveTagIds,
  HomeStateItem,
  Om,
  OmState,
  OmStateHome,
} from './home-types'
import { SearchRouteParams, router } from './router'
import { NavigableTag, getTagId, tagFilters, tagLenses } from './Tag'

const SPLIT_TAG = '_'
const SPLIT_TAG_TYPE = '~'

export const allTagsList = [...tagFilters, ...tagLenses]
export const allTags: { [key: string]: Tag } = {}
for (const tag of allTagsList) {
  allTags[getTagId(tag)] = tag
}

export type HomeStateNav = {
  tags?: NavigableTag[]
  state?: HomeStateItem
  disallowDisableWhenActive?: boolean
  replaceSearch?: boolean
}

export const getFullTags = async (tags: NavigableTag[]): Promise<Tag[]> => {
  return await Promise.all(
    tags.map(async (tag) => {
      return allTags[getTagId(tag)] ?? (await getFullTag(tag)) ?? (tag as Tag)
    })
  )
}

const isValidTag = (tag?: NavigableTag) => {
  return tag && tag.name && tag.name !== 'no-slug'
}

export const isSearchBarTag = (tag: Pick<Tag, 'type'>) =>
  tag?.type != 'lense' && tag.type != 'filter'

export const getActiveTags = (
  home: OmStateHome,
  state: HomeStateItem = home.currentState
) => {
  if ('activeTagIds' in state) {
    const { activeTagIds } = state
    const tagIds = Object.keys(activeTagIds).filter((x) => !!activeTagIds[x])
    const tags: Tag[] = tagIds.map(
      (x) => home.allTags[x] ?? { id: slugify(x), name: x, type: 'dish' }
    )
    return tags.filter(isValidTag)
  }
  return []
}

export const getNextState = (om: Om, navState?: HomeStateNav) => {
  const {
    state = om.state.home.currentState,
    tags = [],
    disallowDisableWhenActive = false,
    replaceSearch = false,
  } = navState ?? {}
  let searchQuery = state.searchQuery ?? ''
  let activeTagIds: HomeActiveTagIds = replaceSearch
    ? {}
    : 'activeTagIds' in state
    ? { ...state.activeTagIds }
    : {}

  // if they words match tag exactly, convert to tags
  let words = searchQuery.toLowerCase().split(' ')
  while (words.length) {
    const [word, ...rest] = words
    const foundTagId =
      om.state.home.allTagsNameToID[slugify(word, ' ').toLowerCase()]
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
    if (activeTagIds[key] === true && !disallowDisableWhenActive) {
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
  nextState.type = shouldBeOnHome(om.state.home, nextState) ? 'home' : 'search'
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

  let name = state.type
  if (name === 'home' && !shouldBeHome) {
    name = 'search'
  } else if (name === 'search' && shouldBeHome) {
    name = 'home'
  }

  const isChangingType = name !== router.curPage.name
  const replace = !isChangingType

  if (shouldBeHome) {
    return {
      name: 'home',
      replace,
    }
  }

  // build params
  const params = getRouteFromTags(omState, state) as any
  // TODO wtf is this doing here
  if (state.searchQuery) {
    params.search = state.searchQuery
  }
  if (state.type === 'userSearch') {
    // @ts-ignore
    params.username = curParams.username
  }
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

let recentTries = 0
let tm
export const syncStateToRoute: AsyncAction<HomeStateItem, boolean> = async (
  om,
  state
) => {
  const next = getNavigateItemForState(om.state, state)
  const should = router.getShouldNavigate(next)
  if (should) {
    recentTries++
    clearTimeout(tm)
    if (recentTries > 3) {
      console.warn('bailing loop')
      recentTries = 0
      // break loop
      return false
    }
    tm = setTimeout(() => {
      recentTries = 0
    }, 200)
    // console.log(
    //   'syncStateToRoute',
    //   cloneDeep({ should, next, state })
    //   // cloneDeep(om.state.router.curPage),
    //   // router.navItemToHistoryItem(next)
    // )
    router.navigate(next)
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
  let tags = `${filterTags.map((x) => slugify(x.name ?? '')).join(SPLIT_TAG)}`
  if (otherTags.length) {
    if (tags.length) {
      tags += SPLIT_TAG
    }
    tags += `${otherTags
      .map((t) => `${t.type}${SPLIT_TAG_TYPE}${slugify(t.name ?? '')}`)
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
  fetch(
    `${LIVE_SEARCH_DOMAIN}/tags?query=${encodeURIComponent(
      tag.name?.replace(/-/g, ' ') ?? ''
    )}&type=${tag.type}&limit=1`
  )
    .then((res) => res.json())
    .then((tags) => tags?.[0] ?? null)
