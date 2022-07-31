import { isWeb } from '../../../constants/constants'
import { tagFilters } from '../../../constants/localTags'
import { tagGroup, tagSort } from '../../../constants/tagMeta'
import { getGroupedButtonProps } from '../../../helpers/getGroupedButtonProps'
import { getTagSlug } from '../../../helpers/getTagSlug'
import { HomeActiveTagsRecord } from '../../../types/homeTypes'
import { CloseButton } from '../../views/CloseButton'
import { FilterButton } from '../../views/FilterButton'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SmallButton } from '../../views/SmallButton'
import {
  Modal,
  Text,
  Theme,
  XGroup,
  XStack,
  YStack,
  useIsTouchDevice,
  useMedia,
  useTheme,
} from '@dish/ui'
import { Filter } from '@tamagui/feather-icons'
import { groupBy, sortBy } from 'lodash'
import React, { memo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

type FilterBarProps = { activeTags: HomeActiveTagsRecord }

export const SearchPageFilterBar = memo(({ activeTags }: FilterBarProps) => {
  const media = useMedia()
  return media.sm ? (
    <HomePageFilterBarSmall activeTags={activeTags} />
  ) : (
    <HomePageFilterBarLarge activeTags={activeTags} />
  )
})

const HomePageFilterBarLarge = ({ activeTags }: FilterBarProps) => {
  const filterButtons = useSearchFilterButtons({ activeTags })
  return (
    <XStack alignItems="center" space="$2" justifyContent="center">
      {filterButtons}
    </XStack>
  )
}

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
          <Text color={theme.colorFocus} fontSize={13}>
            ({num})
          </Text>
        ) : null}
      </SmallButton>

      {show && (
        <Theme name="light">
          <Modal
            onOpenChange={setShow}
            width="98%"
            maxWidth={400}
            height="90%"
            maxHeight={300}
            open
          >
            <SafeAreaView style={{ flex: 1, width: '100%', position: 'relative' }}>
              <PaneControlButtons>
                <CloseButton onPress={() => setShow(false)} />
              </PaneControlButtons>

              <SlantedTitle alignSelf="center">Filters</SlantedTitle>
              <YStack alignItems="center" justifyContent="center" flex={1} space="$2">
                {filterButtons}
              </YStack>
            </SafeAreaView>
          </Modal>
        </Theme>
      )}
    </>
  )
}

const useSearchFilterButtons = ({ activeTags }: FilterBarProps) => {
  let last = 0
  const grouped = groupBy(
    sortBy(tagFilters, (x) => tagSort[x.slug]),
    (x) => tagGroup[x.slug] ?? ++last
  )
  const isTouchable = useIsTouchDevice()
  const groupedList = Object.keys(grouped).map((k) => grouped[k])
  return groupedList.map((group, index) => {
    return (
      <XGroup br="$10" key={index}>
        {group.map((tag, groupIndex) => {
          const isActive = activeTags[getTagSlug(tag.slug)] ?? false
          return (
            <FilterButton
              key={tag.id + isActive}
              tag={tag as any}
              index={index - groupIndex}
              size={isTouchable ? '$4' : '$3'}
              isActive={isActive}
              {...getGroupedButtonProps({
                index: groupIndex,
                items: group,
              })}
            />
          )
        })}
      </XGroup>
    )
  })
}
