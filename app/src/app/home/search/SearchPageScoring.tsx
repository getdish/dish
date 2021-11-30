import { AbsoluteYStack, Paragraph, Text, XStack, YStack, useTheme } from '@dish/ui'
import { sortBy } from 'lodash'
import React, { memo, useContext } from 'react'

import { getActiveTags } from '../../../helpers/getActiveTags'
import { SlantedTitle } from '../../views/SlantedTitle'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { Arrow } from './Arrow'
import { SearchPagePropsContext } from './SearchPagePropsContext'
import { getSearchPageStore } from './SearchPageStore'

export const SearchPageScoring = memo(() => {
  const curProps = useContext(SearchPagePropsContext)!
  const theme = useTheme()
  const meta = getSearchPageStore()?.meta
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
    <XStack alignItems="center" paddingBottom={0} position="relative" zIndex={100}>
      <XStack flex={1} position="relative">
        <XStack y={-7} position="absolute" fullscreen>
          <YStack
            borderLeftWidth={2}
            borderColor={theme.borderColor}
            minWidth={40}
            minHeight={40}
            marginBottom={-40}
            marginRight={-20}
            borderRadius={40}
            marginLeft={20}
            rotate="45deg"
          />
          <AbsoluteYStack bottom={-32} left={15} rotate="180deg">
            <Arrow />
          </AbsoluteYStack>
          <YStack borderBottomWidth={2} y={-1} borderBottomColor={theme.borderColor} flex={1} />
        </XStack>
      </XStack>
      <XStack
        alignItems="center"
        // borderWidth={1}
        // borderColor={theme.borderColor}
        paddingHorizontal={18}
        borderRadius={100}
        marginLeft={0}
        marginRight={30}
        height={48}
        position="relative"
      >
        <AbsoluteYStack left={-62}>
          <SlantedTitle size="$3" fontWeight="500">
            Scoring
          </SlantedTitle>
        </AbsoluteYStack>

        <XStack marginLeft={-5} space="$2">
          {tagsWithPct.map(({ tag, pct }, index) => {
            return (
              <TagButton
                backgroundColor="transparent"
                hideRating
                hideIcon
                key={tag.slug ?? index}
                size="sm"
                {...getTagButtonProps(tag)}
                after={<Paragraph size="$3">{`${pct}%`}</Paragraph>}
              />
            )
          })}
        </XStack>
      </XStack>

      <XStack flex={1} />
    </XStack>
  )
})
