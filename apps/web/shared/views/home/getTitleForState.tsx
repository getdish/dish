import React from 'react'

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
        : tag.type === 'dish') || tag.name === 'Delivers'
  )

  if (hasUser) {
    lensePlaceholder = lensePlaceholder.toLowerCase()
  }

  const titleSpace = titleTags.length ? ' ' : ''
  const searchName = state.searchQuery ?? ''

  const subTitleParts = countryTag
    ? [countryTag, `restaurants in ${currentLocationName}`]
    : [dishTag, `dishes in ${currentLocationName}`]

  const subTitle = `${subTitleParts[0]} ${subTitleParts[1]}`
  const subTitleElements = (
    <>
      <strong>{subTitleParts[0]}</strong> {subTitleParts[1]}
    </>
  )

  let titleTagsString = titleTags.map((x) => `${x.name ?? ''}`).join(', ')

  // lowercase when not at front
  if (!countryTag && lensePlaceholder.indexOf('🍔') > 0) {
    titleTagsString = titleTagsString.toLowerCase()
  }

  const titleSubject = lensePlaceholder.replace('🍔', titleTagsString)
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
