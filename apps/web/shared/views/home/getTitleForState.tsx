import React from 'react'

import { HomeStateItem, Om, OmState, getActiveTags } from '../../state/home'
import { getTagId } from '../../state/Tag'
import { TagButton } from './TagButton'

export function getTitleForState(omState: OmState, state: HomeStateItem) {
  const { currentLocationName } = state
  const tags = getActiveTags(omState.home, state)
  const lense = tags.find((x) => x.type === 'lense')
  const titleTags = tags.filter(
    (tag) => tag.type === 'dish' || tag.name === 'Delivers'
  )
  const countryTag = tags.find((x) => x.type === 'country')?.name ?? ''
  const dishTag = tags.find((x) => x.type === 'dish')?.name ?? ''
  const hasUser = !!omState.user.user
  const userPrefix = hasUser ? `${omState.user.user.username}'s ` : ''
  let lensePlaceholder = lense?.name ?? ''
  const descriptions = lense?.descriptions
  if (descriptions) {
    if (dishTag) lensePlaceholder = descriptions.dish
    else if (countryTag) lensePlaceholder = descriptions.cuisine
    else lensePlaceholder = descriptions.plain
  }
  if (hasUser) {
    lensePlaceholder = lensePlaceholder.toLowerCase()
  }
  const titleSpace = titleTags.length ? ' ' : ''
  const searchName = state.searchQuery ?? ''

  const subTitleParts = countryTag
    ? [countryTag, `restaurants in ${currentLocationName}`]
    : [dishTag, `dishes in ${currentLocationName}`]

  const subTitle = (
    <>
      <strong>{subTitleParts[0]}</strong> {subTitleParts[1]}
    </>
  )

  const titleTagsString = titleTags.map((x) => `${x.name ?? ''}`).join(', ')

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
      {}
      {searchName}
    </>
  )

  return {
    title,
    subTitle,
    pageTitleElements,
  }
}
