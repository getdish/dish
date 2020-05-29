import React from 'react'
import { Text } from 'react-native'

import { HomeStateItem } from '../../state/home'
import { getActiveTags } from '../../state/home-tag-helpers'
import { Om, OmState } from '../../state/home-types'
import { NavigableTag, getTagId } from '../../state/Tag'
import { omStatic } from '../../state/useOvermind'
import { TagButton, getTagButtonProps } from './TagButton'

const getTitleForQuery = (query: string) => {
  // TODO we could keep a tag object..
  // omStatic.state.home.allTags[]
  return query
}

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
  const searchName = getTitleForQuery(state.searchQuery ?? '')
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
  if (searchName) {
    subTitleParts.push(`${searchName[0].toUpperCase()}${searchName.slice(1)}`)
  }
  subTitleParts.push(`in ${currentLocationName}`)

  const subTitle = subTitleParts.join(' ')
  const subTitleElements = (
    <>
      <Text style={{ fontSize: 20, fontWeight: '300', color: 'inherit' }}>
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
      {titleSubject.split('🍔').map((x) => {
        if (x === '🍔') {
          return (
            <>
              {titleTags.map((tag) => (
                <TagButton
                  key={getTagId(tag)}
                  {...getTagButtonProps(tag)}
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
    </>
  )

  return {
    title,
    subTitle,
    subTitleElements,
    pageTitleElements,
  }
}
