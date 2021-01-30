import { Filter } from '@dish/react-feather'
import { groupBy, sortBy } from 'lodash'
import React, { memo, useState } from 'react'
import { HStack, Modal, Text, Theme, VStack, useMedia, useTheme } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { tagFilters } from '../../../constants/localTags'
import { tagGroup, tagSort } from '../../../constants/tagMeta'
import { getGroupedButtonProps } from '../../../helpers/getGroupedButtonProps'
import { getTagSlug } from '../../../helpers/getTagSlug'
import { rgbString } from '../../../helpers/rgbString'
import { HomeActiveTagsRecord } from '../../../types/homeTypes'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { CloseButton } from '../../views/CloseButton'
import { FilterButton } from '../../views/FilterButton'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { SmallButton } from '../../views/SmallButton'

type FilterBarProps = { activeTags: HomeActiveTagsRecord }

export const SearchPageFilterBar = memo(({ activeTags }: FilterBarProps) => {
  const media = useMedia()
  const filterButtons = useSearchFilterButtons({ activeTags })

  if (media.sm) {
    return <HomePageFilterBarSmall activeTags={activeTags} />
  }

  return (
    <HStack alignItems="center" spacing={4} justifyContent="center">
      {filterButtons}
    </HStack>
  )
})

const HomePageFilterBarSmall = ({ activeTags }: FilterBarProps) => {
  const num = Object.keys(activeTags).length
  const theme = useTheme()
  const [show, setShow] = useState(false)
  const filterButtons = useSearchFilterButtons({ activeTags })
  return (
    <>
      <SmallButton
        alignSelf="center"
        icon={<Filter color={isWeb ? 'var(--color)' : '#fff'} size={14} />}
        onPress={() => setShow(true)}
      >
        Filters
        {num ? (
          <>
            {' '}
            <Text color={theme.colorQuartenary} fontSize={13}>
              ({num})
            </Text>
          </>
        ) : null}
      </SmallButton>

      {show && (
        <Modal
          overlayDismisses
          onDismiss={() => setShow(false)}
          width="98%"
          maxWidth={400}
          height="90%"
          maxHeight={300}
          visible
        >
          <PaneControlButtons>
            <CloseButton onPress={() => setShow(false)} />
          </PaneControlButtons>
          <VStack
            alignItems="center"
            justifyContent="center"
            flex={1}
            spacing="sm"
          >
            {filterButtons}
          </VStack>
        </Modal>
      )}
    </>
  )
}

const useSearchFilterButtons = ({ activeTags }: FilterBarProps) => {
  const color = useCurrentLenseColor()
  let last = 0
  const grouped = groupBy(
    sortBy(tagFilters, (x) => tagSort[x.slug]),
    (x) => tagGroup[x.slug] ?? ++last
  )
  const groupedList = Object.keys(grouped).map((k) => grouped[k])
  return groupedList.map((group, index) => {
    return (
      <HStack key={index} borderRadius={100}>
        {group.map((tag, groupIndex) => {
          const isActive = activeTags[getTagSlug(tag)] ?? false
          return (
            <FilterButton
              key={`tag-${tag.id}`}
              tag={tag}
              position="relative"
              {...(!isActive && {
                textProps: {
                  color: rgbString(color),
                },
              })}
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
  })
}
