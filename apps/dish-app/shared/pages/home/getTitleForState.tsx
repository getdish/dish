import { Text } from '@dish/ui'
import React from 'react'

import { getTagId } from '../../state/getTagId'
import { getActiveTags } from '../../state/home-tag-helpers'
import { HomeStateItem } from '../../state/home-types'
import { tagDescriptions } from '../../state/tagLenses'
import { TagButton, getTagButtonProps } from './TagButton'

const getTitleForQuery = (query: string) => {
  // TODO we could keep a tag object..
  // omStatic.state.home.allTags[]
  return query
}

export function getTitleForState(
  state: HomeStateItem,
  options?: { lowerCase: boolean }
) {
  const { currentLocationName = 'San Francisco' } = state
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
    titleParts.push(dishTag.name)
  }
  if (hasUser) {
    lensePlaceholder = lensePlaceholder.toLowerCase()
  }
  const titleSpace = titleParts.length ? ' ' : ''
  const searchName = getTitleForQuery(state.searchQuery ?? '')
  let titleTagsString = titleParts.filter(Boolean).join(' ')

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
  subTitleParts.push(`in ${currentLocationName}`)

  const subTitle = subTitleParts.join(' ')
  const subTitleElements = (
    <>
      <Text fontSize={14} fontWeight="300" color="inherit">
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
            return (
              <>
                {tags.map((tag) => (
                  <TagButton
                    key={getTagId(tag)}
                    {...getTagButtonProps({
                      type: tag.type,
                      name: tag.name.toLowerCase(),
                    })}
                    subtle
                    noColor
                    hideIcon
                  />
                ))}
              </>
            )
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
