import React from 'react'
import { Text } from 'react-native'

import { HomeStateItem } from '../../state/home'
import { getActiveTags } from '../../state/home-tag-helpers'
import { Om, OmState } from '../../state/home-types'
import { NavigableTag, getTagId } from '../../state/Tag'
import { TagButton } from './TagButton'

export function getTitleForState(omState: OmState, state: HomeStateItem) {
  const { currentLocationName = 'San Francisco' } = state
  const tags = getActiveTags(omState.home, state)
  const lense = tags.find((x) => x.type === 'lense')
  const countryTag = tags.find((x) => x.type === 'country')
  const countryTagName = countryTag?.name ?? ''
  const dishTag = tags.find((x) => x.type === 'dish')
  const dishTagName = dishTag?.name ?? ''
  const hasUser = state.type === 'userSearch'
  const userPrefix = state.type === 'userSearch' ? `${state.username}'s ` : ''
  let lensePlaceholder = lense?.name ?? ''
  const descriptions = lense?.descriptions
  if (descriptions) {
    if (dishTag) lensePlaceholder = descriptions.dish
    else if (countryTag) lensePlaceholder = descriptions.cuisine
    else lensePlaceholder = descriptions.plain
  }

  let titleTags: NavigableTag[] = []
  if (countryTag) {
    titleTags.push(countryTag)
  }
  if (dishTag) {
    titleTags.push(dishTag)
  }

  if (hasUser) {
    lensePlaceholder = lensePlaceholder.toLowerCase()
  }

  const titleSpace = titleTags.length ? ' ' : ''
  const searchName = state.searchQuery ?? ''
  let titleTagsString = titleTags
    .map((x) => `${x.name ?? ''}`)
    .filter(Boolean)
    .join(' ')

  // lowercase when not at front
  if (!countryTag && lensePlaceholder.indexOf('🍔') > 0) {
    titleTagsString = titleTagsString.toLowerCase()
  }

  const titleSubject = lensePlaceholder.replace('🍔', titleTagsString)

  // build subtitle
  let subTitleParts: string[] = []
  // if (countryTagName) {
  //   subTitleParts.push(countryTagName)
  // }
  // if (dishTagName) {
  //   subTitleParts.push(dishTagName)
  // }
  if (state.searchQuery) {
    subTitleParts.push(`"${state.searchQuery}"`)
  }
  subTitleParts.push(`in ${currentLocationName}`)

  const subTitle = subTitleParts.join(' ')
  const subTitleElements = (
    <>
      <Text style={{ fontWeight: '500' }}>{subTitleParts[0]}</Text>&nbsp;
      {subTitleParts.slice(1).join(' ')}
    </>
  )

  const title = `${userPrefix} ${titleSubject} ${searchName} ${subTitleParts.join(
    ' '
  )}`

  const pageTitleElements = (
    <>
      {userPrefix}
      {titleSubject.split('🍔').map((x) => {
        if (x === '🍔') {
          return (
            <>
              {titleTags.map((tag) => (
                <TagButton
                  key={getTagId(tag)}
                  name={tag.name}
                  type={tag.type}
                  subtle
                  noColor
                  hideIcon
                />
              ))}
            </>
          )
        }
        return x
      })}
      {titleSpace}
      {searchName}
    </>
  )

  return {
    title,
    subTitle,
    subTitleElements,
    pageTitleElements,
  }
}
