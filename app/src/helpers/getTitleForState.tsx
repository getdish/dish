import { isPresent } from '@dish/helpers'
import { Text } from '@dish/ui'
import React from 'react'

import { isWeb } from '../constants/constants'
import { tagDisplayName } from '../constants/tagDisplayName'
import { tagDescriptions } from '../constants/tagMeta'
import { HomeStateItem } from '../types/homeTypes'
import { getActiveTags } from './getActiveTags'

const getTitleForQuery = (query: string) => {
  return query
}

export function getTitleForState(state: HomeStateItem, options: { lowerCase?: boolean } = {}) {
  const { curLocName = '...' } = state
  const tags = getActiveTags(state)
  const lense = tags.find((x) => x.type === 'lense')
  const countryTag = tags.find((x) => x.type === 'country')
  const dishTag = tags.find((x) => x.type === 'dish')
  let lensePlaceholder = lense?.name ?? ''
  const descriptions = tagDescriptions[lense?.name?.toLowerCase() ?? '']
  if (descriptions) {
    if (dishTag) lensePlaceholder = descriptions.dish
    else if (countryTag) lensePlaceholder = descriptions.cuisine
    else lensePlaceholder = descriptions.plain
  }

  let titleParts: string[] = []
  const cheap = tags.some((t) => t.slug == 'filters__price-low')
  const midRange = tags.some((t) => t.slug == 'filters__price-mid')
  const expensive = tags.some((t) => t.slug == 'filters__price-high')
  if (cheap && !midRange && !expensive) {
    titleParts.push('Cheap')
  }
  if (!cheap && midRange && !expensive) {
    titleParts.push('Mid-Range')
  }
  if (!cheap && !midRange && expensive) {
    titleParts.push('High-end')
  }
  if (countryTag?.name) {
    titleParts.push(countryTag.name)
  }
  if (dishTag?.name) {
    titleParts.push(dishTag.icon ? `${dishTag.name} ${dishTag.icon}` : dishTag.name)
  }
  const titleSpace = titleParts.length ? ' ' : ''
  const searchName = getTitleForQuery(state.searchQuery ?? '')
  let titleTagsString = titleParts.filter(isPresent).join(' ')

  // lowercase when not at front
  if (!countryTag && lensePlaceholder.indexOf('🍔') > 0) {
    titleTagsString = titleTagsString.toLowerCase()
  }

  let titleSubject = lensePlaceholder.replace('🍔', titleTagsString)

  // build subtitle
  let subTitleParts: string[] = []
  if (tags.some((tag) => tag.name === 'Delivery')) {
    subTitleParts.push(`Delivered to`)
  }
  if (searchName) {
    subTitleParts.push(`${searchName[0].toUpperCase()}${searchName.slice(1)}`)
  }
  subTitleParts.push(`${curLocName}`)

  let subTitle = subTitleParts.join(' ')

  const subTitleElements = (
    <Text fontSize={14} fontWeight="300" {...(isWeb && { color: 'inherit' })}>
      {subTitleParts[0]}
      &nbsp;
      {subTitleParts.slice(1).join(' ')}
    </Text>
  )

  let title = `${titleSubject}`.replaceAll('  ', ' ')

  if (options.lowerCase) {
    title = title.toLowerCase()
    subTitle = subTitle.toLowerCase()
    titleSubject = titleSubject.toLowerCase()
  }

  const pageName = (
    <>
      {titleSubject
        .split('🍔')
        .map((x) => {
          if (x === '🍔') {
            return <>{tags.map((tag) => tagDisplayName(tag))}</>
          }
          return x
        })
        .join(' ')}
      {titleSpace}
    </>
  )

  return {
    title,
    subTitle,
    subTitleElements,
    pageName,
  }
}
