import { isPresent } from '@dish/helpers'
import React from 'react'
import { Text } from 'snackui'

import { isWeb } from '../../constants'
import { getActiveTags } from '../../state/getActiveTags'
import { HomeStateItem } from '../../state/home-types'
import { tagDescriptions, tagDisplayName } from '../../state/tagMeta'

const getTitleForQuery = (query: string) => {
  return query
}

export function getTitleForState(
  state: HomeStateItem,
  options?: { lowerCase: boolean }
) {
  const { currentLocationName = '...' } = state
  const tags = getActiveTags(state)
  const lense = tags.find((x) => x.type === 'lense')
  const countryTag = tags.find((x) => x.type === 'country')
  const dishTag = tags.find((x) => x.type === 'dish')
  const hasUser = state.type === 'userSearch'
  const userPrefix = state.type === 'userSearch' ? `${state.username}'s ` : ''
  let lensePlaceholder = lense?.name ?? ''
  const descriptions = tagDescriptions[lense?.name?.toLowerCase() ?? '']
  if (descriptions) {
    if (dishTag) lensePlaceholder = descriptions.dish
    else if (countryTag) lensePlaceholder = descriptions.cuisine
    else lensePlaceholder = descriptions.plain
  }

  let titleParts: string[] = []
  const cheap = tags.some((t) => t.name == 'price-low')
  const midRange = tags.some((t) => t.name == 'price-mid')
  const expensive = tags.some((t) => t.name == 'price-high')
  if (cheap && !midRange && !expensive) {
    titleParts.push('Cheap')
  }
  if (!cheap && midRange && !expensive) {
    titleParts.push('Nice')
  }
  if (!cheap && !midRange && expensive) {
    titleParts.push('High End')
  }
  if (countryTag?.name) {
    titleParts.push(countryTag.name)
  }
  if (dishTag?.name) {
    titleParts.push(
      dishTag.icon ? `${dishTag.name} ${dishTag.icon}` : dishTag.name
    )
  }
  if (hasUser) {
    lensePlaceholder = lensePlaceholder.toLowerCase()
  }
  const titleSpace = titleParts.length ? ' ' : ''
  const searchName = getTitleForQuery(state.searchQuery ?? '')
  let titleTagsString = titleParts.filter(isPresent).join(' ')

  if (options?.lowerCase) {
    titleTagsString = titleTagsString.toLowerCase()
  }

  // lowercase when not at front
  if (!countryTag && lensePlaceholder.indexOf('🍔') > 0) {
    titleTagsString = titleTagsString.toLowerCase()
  }

  const titleSubject = lensePlaceholder.replace('🍔', titleTagsString)

  // build subtitle
  let subTitleParts: string[] = []
  if (tags.some((tag) => tag.name === 'Delivery')) {
    subTitleParts.push(`Delivery`)
  }
  if (searchName) {
    subTitleParts.push(`${searchName[0].toUpperCase()}${searchName.slice(1)}`)
  }
  subTitleParts.push(`@ ${currentLocationName}`)

  const subTitle = subTitleParts.join(' ')
  const subTitleElements = (
    <>
      <Text fontSize={14} fontWeight="300" {...(isWeb && { color: 'inherit' })}>
        {subTitleParts[0]}
        &nbsp;
        {subTitleParts.slice(1).join(' ')}
      </Text>
    </>
  )

  const title = `${userPrefix} ${titleSubject} ${subTitleParts.join(' ')}`

  const pageTitleElements = (
    <>
      {userPrefix}
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
    pageTitleElements,
  }
}
