import { slugify } from '@dish/graph'
import { Action, AsyncAction } from 'overmind'

import { LIVE_SEARCH_DOMAIN } from '../constants'
import { sleep } from '../helpers/sleep'
import { isHomeState, isSearchState, shouldBeOnHome } from './home-helpers'
import {
  HomeActiveTagIds,
  HomeStateItem,
  HomeStateItemSearch,
} from './home-types'
import { OmState, OmStateHome } from './home-types'
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

export const navigateToTagId: Action<string> = (om, tagId) => {
  navigateToTag(om, { tags: [om.state.home.allTags[tagId]] })
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

export const getActiveTags = (
  home: OmStateHome,
  state: HomeStateItem = home.currentState
) => {
  const lastState = home.states[home.states.length - 1]
  const curState = (state ?? lastState) as HomeStateItemSearch
  const activeTagIds = curState?.activeTagIds ?? {}
  const tagIds = Object.keys(activeTagIds).filter((x) => activeTagIds[x])
  const tags: Tag[] = tagIds.map(
    (x) => home.allTags[x] ?? { id: '-1', name: x, type: 'dish' }
  )
  return tags.filter(Boolean)
}

type LinkButtonProps = NavigateItem & {
  onPress?: Function
}

// for easy use with Link / LinkButton
export const getNavigateToTags: Action<HomeStateNav, LinkButtonProps> = (
  om,
  { state = om.state.home.currentState, tags, ...rest }
) => {
  // remove undefined
  tags = tags.filter(Boolean)
  if (!tags.length) {
    return null
  }
  const nextState = getNextStateWithTags(om, {
    tags,
    state,
    ...rest,
  })
  const navigateItem = getNavigateItemForState(om.state, nextState)
  return {
    ...navigateItem,
    onPress: (e) => {
      e?.preventDefault()
      e?.stopPropagation()
      const activeTags = om.state.home.lastActiveTags
      for (const tag of tags) {
        const tagId = getTagId(tag)
        if (
          rest.disabledIfActive &&
          activeTags.some((x) => getTagId(x) === tagId)
        ) {
          continue
        }
        om.actions.home.toggleTagOnHomeState(tag)
      }
    },
  }
}

const getNextStateWithTags: Action<HomeStateNav, HomeStateItem | null> = (
  om,
  { state, tags, disabledIfActive = false, replace = false }
) => {
  if (!isHomeState(state) && !isSearchState(state)) {
    return null
  }

  let activeTagIds: HomeActiveTagIds = {}

  // clone it to avoid confusing overmind
  if (!replace) {
    for (const key in state.activeTagIds) {
      if (state.activeTagIds[key]) {
        activeTagIds[key] = true
      }
    }
  }

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

  return {
    ...state,
    activeTagIds,
  }
}

// mutating
const ensureUniqueTagOfType = new Set(['lense', 'country', 'dish'])
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

export const toggleTagOnHomeState: AsyncAction<NavigableTag> = async (
  om,
  next
) => {
  const state = om.state.home.currentState
  if (!next || (!isHomeState(state) && !isSearchState(state))) {
    return
  }
  if (!next) {
    console.warn('no tag')
    return
  }
  const key = getTagId(next)
  state.activeTagIds[key] = !state.activeTagIds[key]
  ensureUniqueActiveTagIds(state.activeTagIds, om.state.home, next)
  await _afterTagChange(om)
}

let _htgId = 0
const _afterTagChange: AsyncAction = async (om) => {
  if (!om.state.home.started) return
  _htgId = (_htgId + 1) % Number.MAX_VALUE
  let cur = _htgId
  await sleep(50)
  if (cur != _htgId) return
  await syncStateToRoute(om)
  if (cur != _htgId) return
  om.actions.home.runSearch()
}

export const syncStateToRoute: AsyncAction<HomeStateItem | void> = async (
  om,
  ogState
) => {
  const homeState = ogState || om.state.home.currentState
  const next = getNavigateItemForState(om.state, homeState)
  if (om.actions.router.getShouldNavigate(next)) {
    om.actions.router.navigate(next)
  }
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
