import { sortBy } from 'lodash'
import React, { memo, useContext } from 'react'
import { ScrollView } from 'react-native'
import { AbsoluteVStack, HStack, VStack, useTheme } from 'snackui'

import { getActiveTags } from '../../../helpers/getActiveTags'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { SlantedTitle } from '../../views/SlantedTitle'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { Arrow } from './Arrow'
import { SearchPagePropsContext } from './SearchPagePropsContext'
import { searchPageStore } from './SearchPageStore'

export const SearchPageScoring = memo(() => {
  const curProps = useContext(SearchPagePropsContext)!
  const theme = useTheme()
  const meta = searchPageStore.meta
  const activeTags = getActiveTags(curProps.item)
  const weights = activeTags.map((tag) => {
    return !meta
      ? 1
      : meta.main_tag === tag.slug?.replace('lenses__', '')
      ? meta.scores.weights.main_tag * 2
      : meta.scores.weights.rishes * 2
  })
  const totalWeight = weights.reduce((a, c) => a + c, 0)
  const tagsWithPct = sortBy(
    activeTags.map((tag, i) => {
      return {
        pct: Math.round((weights[i] / totalWeight) * 100),
        tag,
      }
    }),
    (x) => -x.pct
  )

  return (
    <HStack alignItems="center" paddingBottom={5}>
      <HStack flex={1} position="relative">
        <HStack position="absolute" fullscreen>
          <VStack
            borderLeftWidth={2}
            borderColor={theme.borderColor}
            minWidth={40}
            minHeight={40}
            marginBottom={-40}
            marginRight={-20}
            borderRadius={40}
            marginLeft={20}
            transform={[{ rotate: '45deg' }]}
          />
          <AbsoluteVStack bottom={-32} left={15} transform={[{ rotate: '180deg' }]}>
            <Arrow />
          </AbsoluteVStack>
          <VStack
            borderBottomWidth={2}
            transform={[{ translateY: -1 }]}
            borderBottomColor={theme.borderColor}
            flex={1}
          />
        </HStack>
      </HStack>
      <HStack
        alignItems="center"
        borderWidth={1}
        borderColor={theme.borderColor}
        paddingHorizontal={18}
        borderRadius={100}
        marginLeft={100}
        marginRight={30}
        height={48}
        position="relative"
      >
        <AbsoluteVStack left={-66}>
          <SlantedTitle size="xs" fontWeight="300" color={theme.colorSecondary}>
            Scoring
          </SlantedTitle>
        </AbsoluteVStack>

        <HStack spacing="sm">
          {tagsWithPct.map(({ tag, pct }, index) => {
            return (
              <TagButton
                hideRating
                key={tag.slug ?? index}
                size="sm"
                {...getTagButtonProps(tag)}
                after={`(${pct}%)`}
              />
            )
          })}
        </HStack>
      </HStack>

      <HStack flex={1} />
    </HStack>
  )
})
