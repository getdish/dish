import { groupBy, sortBy } from 'lodash'
import React, { memo } from 'react'
import { HStack, useMedia } from 'snackui'

import { tagFilters } from '../../../constants/localTags'
import { tagGroup, tagSort } from '../../../constants/tagMeta'
import { getGroupedButtonProps } from '../../../helpers/getGroupedButtonProps'
import { getTagSlug } from '../../../helpers/getTagSlug'
import { rgbString } from '../../../helpers/rgbString'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { HomeActiveTagsRecord } from '../../state/home-types'
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
              const button = (
                <FilterButton
                  key={`tag-${tag.id}`}
                  tag={tag}
                  isActive={isActive}
                  position="relative"
                  color={rgbString(color)}
                  zIndex={100 - index - groupIndex + (isActive ? 1 : 0)}
                  {...getGroupedButtonProps({
                    index: groupIndex,
                    items: group,
                  })}
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
