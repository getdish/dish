import { getActiveTags } from '../../../helpers/getActiveTags'
import { SlantedTitle } from '../../views/SlantedTitle'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { SearchPagePropsContext } from './SearchPagePropsContext'
import { getSearchPageStore } from './SearchPageStore'
import { AbsoluteYStack, Paragraph, XStack } from '@dish/ui'
import { sortBy } from 'lodash'
import React, { memo, useContext } from 'react'

export const SearchPageScoring = memo(() => {
  const curProps = useContext(SearchPagePropsContext)!
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
    <XStack
      alignItems="center"
      paddingHorizontal={18}
      borderRadius={100}
      marginLeft={0}
      marginRight={30}
      paddingLeft="$12"
      height={48}
      position="relative"
    >
      <AbsoluteYStack left={-10}>
        <SlantedTitle size="$3">Scoring</SlantedTitle>
      </AbsoluteYStack>

      <XStack space="$2">
        {tagsWithPct.map(({ tag, pct }, index) => {
          return (
            <TagButton
              backgroundColor="transparent"
              hideRating
              hideIcon
              key={tag.slug ?? index}
              {...getTagButtonProps(tag)}
              after={<Paragraph size="$3">{`${pct}%`}</Paragraph>}
            />
          )
        })}
      </XStack>
    </XStack>
  )
})
