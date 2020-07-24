import { Text } from '@dish/ui'
import React from 'react'

import { HomeStateItem } from '../../state/home'
import { getActiveTags } from '../../state/home-tag-helpers'
import { OmState } from '../../state/home-types'
import { getTagId, tagDescriptions } from '../../state/Tag'
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
  const dishTag = tags.find((x) => x.type === 'dish')
  const hasUser = state.type === 'userSearch'
  const userPrefix = state.type === 'userSearch' ? `${state.username}'s ` : ''
  let lensePlaceholder = lense?.name ?? ''
  const descriptions = tagDescriptions[lense?.name.toLowerCase()]
  if (descriptions) {
    if (dishTag) lensePlaceholder = descriptions.dish
    else if (countryTag) lensePlaceholder = descriptions.cuisine
    else lensePlaceholder = descriptions.plain
  }

  let titleParts: string[] = []
  const cheap = tags.some((t) => t.name == 'cheap')
  const midRange = tags.some((t) => t.name == 'midrange')
  const expensive = tags.some((t) => t.name == 'expensive')
  if (cheap && !midRange && !expensive) {
    titleParts.push('cheap')
  }
  if (!cheap && midRange && !expensive) {
    titleParts.push('nice')
  }
  if (!cheap && !midRange && expensive) {
    titleParts.push('high end')
  }
  if (countryTag) {
    titleParts.push(countryTag.name)
  }
  if (dishTag) {
    titleParts.push(dishTag.name)
  }

  if (hasUser) {
    lensePlaceholder = lensePlaceholder.toLowerCase()
  }

  const titleSpace = titleParts.length ? ' ' : ''
  const searchName = getTitleForQuery(state.searchQuery ?? '')
  let titleTagsString = titleParts.filter(Boolean).join(' ')

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
      {titleSubject.split('🍔').map((x) => {
        if (x === '🍔') {
          return (
            <>
              {tags.map((tag) => (
                <TagButton
                  key={getTagId(tag)}
                  {...getTagButtonProps(tag as any)}
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
