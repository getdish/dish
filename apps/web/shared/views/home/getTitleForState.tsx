import React from 'react'
import { Text } from 'react-native'

import { HomeStateItem } from '../../state/home'
import { getActiveTags } from '../../state/home-tag-helpers'
import { Om, OmState } from '../../state/home-types'
import { getTagId } from '../../state/Tag'
import { TagButton } from './TagButton'

export function getTitleForState(omState: OmState, state: HomeStateItem) {
  const { currentLocationName = 'San Francisco' } = state
  const tags = getActiveTags(omState.home, state)
  const lense = tags.find((x) => x.type === 'lense')
  const countryTag = tags.find((x) => x.type === 'country')?.name ?? ''
  const dishTag = tags.find((x) => x.type === 'dish')?.name ?? ''
  const hasUser = state.type === 'userSearch'
  const userPrefix = state.type === 'userSearch' ? `${state.username}'s ` : ''
  let lensePlaceholder = lense?.name ?? ''
  const descriptions = lense?.descriptions
  if (descriptions) {
    if (dishTag) lensePlaceholder = descriptions.dish
    else if (countryTag) lensePlaceholder = descriptions.cuisine
    else lensePlaceholder = descriptions.plain
  }
  const titleTags = tags.filter(
    (tag) =>
      (dishTag
        ? tag.type === 'dish'
        : countryTag
        ? tag.type === 'country'
        : tag.type === 'dish') || tag.name === 'Delivery'
  )

  if (hasUser) {
    lensePlaceholder = lensePlaceholder.toLowerCase()
  }

  const titleSpace = titleTags.length ? ' ' : ''
  const searchName = state.searchQuery ?? ''
  let titleTagsString = titleTags.map((x) => `${x.name ?? ''}`).join(' ')

  // lowercase when not at front
  if (!countryTag && lensePlaceholder.indexOf('🍔') > 0) {
    titleTagsString = titleTagsString.toLowerCase()
  }

  const titleSubject = lensePlaceholder.replace('🍔', titleTagsString)

  const subTitleParts = countryTag
    ? ['', `in ${currentLocationName}`]
    : dishTag
    ? [dishTag, `dishes in ${currentLocationName}`]
    : [`"${state.searchQuery}"`, `in ${currentLocationName}`]

  const subTitle = `${subTitleParts[0]} ${subTitleParts[1]}`
  const subTitleElements = (
    <>
      <Text style={{ fontWeight: '500' }}>{subTitleParts[0]}</Text>&nbsp;
      {subTitleParts[1]}
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
                  tag={tag}
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
