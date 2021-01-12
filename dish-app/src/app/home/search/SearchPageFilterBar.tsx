import { groupBy, sortBy } from 'lodash'
import React, { memo } from 'react'
import { HStack, Theme, useMedia } from 'snackui'

import { tagFilters } from '../../../constants/localTags'
import { tagGroup, tagSort } from '../../../constants/tagMeta'
import { getGroupedButtonProps } from '../../../helpers/getGroupedButtonProps'
import { getTagSlug } from '../../../helpers/getTagSlug'
import { rgbString } from '../../../helpers/rgbString'
import { HomeActiveTagsRecord } from '../../../types/homeTypes'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { FilterButton } from '../../views/FilterButton'

type FilterBarProps = { activeTags: HomeActiveTagsRecord }

export const SearchPageFilterBar = memo(({ activeTags }: FilterBarProps) => {
  const media = useMedia()
  const color = useCurrentLenseColor()

  if (media.sm) {
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
              const isActive = activeTags[getTagSlug(tag)] ?? false
              return (
                <FilterButton
                  key={`tag-${tag.id}`}
                  tag={tag}
                  position="relative"
                  textProps={{
                    color: rgbString(color),
                  }}
                  zIndex={100 - index - groupIndex + (isActive ? 1 : 0)}
                  theme={isActive ? 'active' : null}
                  {...getGroupedButtonProps({
                    index: groupIndex,
                    items: group,
                  })}
                />
              )
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
            theme={isActive ? 'active' : null}
            tag={tag}
            position="relative"
            zIndex={100 - index + (isActive ? 1 : 0)}
          />
        )
      })}
    </HStack>
  )
}
