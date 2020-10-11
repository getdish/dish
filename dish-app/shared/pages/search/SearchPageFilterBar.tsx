import { HStack, StackProps } from '@dish/ui'
import _ from 'lodash'
import React, { memo } from 'react'

import { rgbString } from '../../helpers/rgbString'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { useIsNarrow } from '../../hooks/useIs'
import { getTagId } from '../../state/getTagId'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { tagFilters } from '../../state/tagFilters'
import { FilterButton } from '../../views/FilterButton'

type FilterBarProps = { activeTagIds: HomeActiveTagsRecord }

export const SearchPageFilterBar = memo(({ activeTagIds }: FilterBarProps) => {
  const isSmall = useIsNarrow()
  const color = useCurrentLenseColor()

  if (isSmall) {
    return <HomePageFilterBarSmall activeTagIds={activeTagIds} />
  }

  let last = 0
  const grouped = _.groupBy(tagFilters, (x) => x?.['groupId'] ?? ++last)
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
              const isActive = activeTagIds[getTagId(tag)]
              const button = (
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

const HomePageFilterBarSmall = ({ activeTagIds }: FilterBarProps) => {
  const filters = [tagFilters[0], tagFilters[1], tagFilters[2]]

  return (
    <HStack
      alignItems="center"
      justifyContent="center"
      // borderWidth={1}
      // borderColor="#eee"
      // borderRadius={100}
    >
      {filters.map((tag, index) => {
        const isActive = activeTagIds[getTagId(tag)]
        const hasPrev = !!filters[index - 1]
        const hasNext = !!filters[index + 1]
        return (
          <FilterButton
            key={`tag-${tag.id}`}
            tag={tag}
            isActive={isActive}
            {...(hasPrev && { marginLeft: -1 })}
            {...(hasNext && { marginRight: 0 })}
            position="relative"
            zIndex={100 - index + (isActive ? 1 : 0)}
            borderColor="transparent"
          />
        )
      })}
    </HStack>
  )
}
