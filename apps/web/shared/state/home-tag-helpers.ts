import { Tag, slugify } from '@dish/graph'
import { HistoryItem } from '@dish/router'

import { LIVE_SEARCH_DOMAIN } from '../constants'
import { getTagId } from './getTagId'
import { isHomeState, isSearchState } from './home-helpers'
import {
  HomeActiveTagsRecord,
  HomeStateItem,
  HomeStateTagNavigable,
} from './home-types'
import { NavigableTag } from './NavigableTag'
import { SearchRouteParams } from './router'
import { tagFilters } from './tagFilters'
import { tagLenses } from './tagLenses'
import { omStatic } from './useOvermind'

const SPLIT_TAG = '_'
const SPLIT_TAG_TYPE = '~'

export const allTagsList = [...tagFilters, ...tagLenses]
export const allTags: { [key: string]: Tag } = {}
for (const tag of allTagsList) {
  allTags[getTagId(tag)] = tag
}

export type HomeStateNav = {
  tags?: NavigableTag[]
  state?: HomeStateTagNavigable
  disallowDisableWhenActive?: boolean
  replaceSearch?: boolean
}

export const cleanTagName = (name: string) => {
  return slugify(name.toLowerCase(), ' ').replace(/\./g, '-')
}

export const getFullTags = async (tags: NavigableTag[]): Promise<Tag[]> => {
  return await Promise.all(
    tags.map(async (tag) => {
      return allTags[getTagId(tag)] ?? (await getFullTag(tag)) ?? (tag as Tag)
    })
  )
}

const isValidTag = (name?: string) => {
  return name !== 'no-slug'
}

export const isSearchBarTag = (tag: Pick<Tag, 'type'>) =>
  tag?.type != 'lense' && tag.type != 'filter'

export const getActiveTags = (
  state: Partial<HomeStateItem> = omStatic.state.home.currentState
) => {
  if ('activeTagIds' in state) {
    const { activeTagIds } = state
    const tagIds = Object.keys(activeTagIds)
      .filter(isValidTag)
      .filter((x) => !!activeTagIds[x])
    const tags: Tag[] = tagIds.map(
      (x) =>
        omStatic.state.home.allTags[x] ?? {
          id: slugify(x),
          name: x,
          type: 'dish',
        }
    )
    if (!tags.some((tag) => tag.type === 'lense')) {
      tags.push({ type: 'lense', name: 'Gems' })
    }
    return tags
  }
  return []
}

// mutating
const ensureUniqueTagOfType = new Set(['lense', 'country', 'dish'])
export function ensureUniqueActiveTagIds(
  activeTagIds: HomeActiveTagsRecord,
  nextActiveTag: NavigableTag
) {
  if (!nextActiveTag) {
    throw new Error(`Missing tag...`)
  }
  for (const key in activeTagIds) {
    if (key === getTagId(nextActiveTag)) {
      continue
    }
    const type = omStatic.state.home.allTags[key]?.type
    if (
      type &&
      ensureUniqueTagOfType.has(type) &&
      type === nextActiveTag.type
    ) {
      delete activeTagIds[key]
    }
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

const getUrlTagInfo = (part: string, defaultType: any = ''): NavigableTag => {
  if (part.indexOf(SPLIT_TAG_TYPE) > -1) {
    const [type, name] = part.split(SPLIT_TAG_TYPE)
    return { type: type as any, name }
  }
  return { type: defaultType, name: part }
}

export const getRouteFromTags = (
  state: HomeStateTagNavigable = omStatic.state.home.currentState
): SearchRouteParams => {
  if (!isHomeState(state) && !isSearchState(state)) {
    throw new Error(`Getting route on bad state`)
  }
  const allActiveTags = getActiveTags(state)
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
