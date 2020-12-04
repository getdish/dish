import { groupBy, sortBy } from 'lodash'
import React, { memo } from 'react'
import { HStack, StackProps } from 'snackui'

import { rgbString } from '../../helpers/rgbString'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { useIsNarrow } from '../../hooks/useIs'
import { getTagSlug } from '../../state/getTagSlug'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { tagFilters } from '../../state/localTags'
import { tagGroup, tagSort } from '../../state/tagMeta'
import { FilterButton } from '../../views/FilterButton'

type FilterBarProps = { activeTags: HomeActiveTagsRecord }

export const SearchPageFilterBar = memo(({ activeTags }: FilterBarProps) => {
  const isSmall = useIsNarrow()
  const color = useCurrentLenseColor()

  if (isSmall) {
    return <HomePageFilterBarSmall activeTags={activeTags} />
  }

  let last = 0
  const grouped = groupBy(
    sortBy(tagFilters, (x) => tagSort[x.slug]),
    (x) => tagGroup[x.slug] ?? ++last
  )
  const groupedList = Object.keys(grouped).map((k) => grouped[k])

  return (
    <HStack alignItems="center" spacing={4} justifyContent="center">
      {groupedList.map((group, index) => {
        return (
          <HStack key={index} borderRadius={100}>
            {group.map((tag, groupIndex) => {
              const hasPrev = !!group[groupIndex - 1]
              const hasNext = !!group[groupIndex + 1]
              const extraProps: StackProps = {}
              extraProps.borderTopLeftRadius = hasPrev ? 0 : 30
              extraProps.borderBottomLeftRadius = hasPrev ? 0 : 30
              extraProps.borderTopRightRadius = hasNext ? 0 : 30
              extraProps.borderBottomRightRadius = hasNext ? 0 : 30
              const isActive = activeTags[getTagSlug(tag)] ?? false
              const button = (
                // @ts-expect-error Incompatibility with snack-ui types
                <FilterButton
                  key={`tag-${tag.id}`}
                  tag={tag}
                  isActive={isActive}
                  {...(hasPrev && { marginLeft: -1 })}
                  {...(hasNext && { marginRight: 0 })}
                  {...extraProps}
                  position="relative"
                  color={rgbString(color)}
                  zIndex={100 - index - groupIndex + (isActive ? 1 : 0)}
                />
              )

              return button
            })}
          </HStack>
        )
      })}
    </HStack>
  )
})

const HomePageFilterBarSmall = ({ activeTags }: FilterBarProps) => {
  const filters = [tagFilters[1], tagFilters[3], tagFilters[4]]

  return (
    <HStack alignItems="center" justifyContent="center" spacing={5}>
      {filters.map((tag, index) => {
        const isActive = activeTags[getTagSlug(tag)]
        return (
          <FilterButton
            key={`tag-${tag.id}`}
            tag={tag}
            isActive={isActive}
            position="relative"
            zIndex={100 - index + (isActive ? 1 : 0)}
            color="#fff"
          />
        )
      })}
    </HStack>
  )
}
