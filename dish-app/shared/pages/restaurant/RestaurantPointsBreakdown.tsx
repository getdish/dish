import { graphql } from '@dish/graph'
import {
  Divider,
  HStack,
  Paragraph,
  Spacer,
  Text,
  TextProps,
  VStack,
} from '@dish/ui'
import React, { memo, useState } from 'react'
import { View } from 'react-native'

import { lightGreen, lightYellow } from '../../colors'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { omStatic } from '../../state/omStatic'
import { thirdPartyCrawlSources } from '../../thirdPartyCrawlSources'
import { SmallButton } from '../../views/ui/SmallButton'
import { TextStrong } from '../../views/ui/TextStrong'
import { RestaurantSourcesBreakdown } from './RestaurantSourcesBreakdown'
import {
  useTotalExternalReviews,
  useTotalNativeReviews,
  useTotalReviews,
} from './useTotalReviews'

const TextHighlight = (props: TextProps) => (
  <Text padding={2} margin={-2} borderRadius={6} {...props} />
)

// Include and retrieve this from the breakdown JSONB
const REVIEW_FACTOR = 0.1

const sourceNames = (sources: any[]) => {
  const sourceKeys = Object.keys(sources)
  if (!sourceKeys.length) return 'no sources'
  const upperCasedSources = sourceKeys.map(
    (s) => thirdPartyCrawlSources[s].name
  )
  const count = upperCasedSources.length
  if (count == 1) return upperCasedSources[0]
  const final = upperCasedSources.pop()
  const pre = upperCasedSources.join(', ')
  const all = `${pre} and ${final}`
  return all
}

export const RestaurantPointsBreakdown = memo(
  graphql((props: { restaurantSlug: string; showTable?: boolean }) => {
    const restaurant = useRestaurantQuery(props.restaurantSlug)
    const sources = restaurant.sources() ?? {}
    const [showTable, setShowTable] = useState(props.showTable)
    const tags = omStatic.state.home.lastActiveTags
    const totalReviews = useTotalReviews(restaurant)
    const totalNativeReviews = useTotalNativeReviews(restaurant)
    const nativeReviewPoints =
      Math.round(totalNativeReviews * REVIEW_FACTOR * 10) / 10
    const totalExternalReviews = useTotalExternalReviews(restaurant)
    const externalReviewPoints =
      Math.round(totalExternalReviews * REVIEW_FACTOR * 10) / 10
    const reviewsBreakdown = restaurant.score_breakdown()?.['reviews'] ?? {}
    const photosBreakdown = restaurant.score_breakdown()?.['photos'] ?? {}
    return (
      <HStack overflow="hidden" paddingVertical={12}>
        <VStack alignItems="stretch" flex={1}>
          <Paragraph size={1} color="rgba(0,0,0,0.7)">
            <TextStrong>{restaurant.name}</TextStrong> has{' '}
            <TextStrong>{restaurant.score}</TextStrong> points.{' '}
          </Paragraph>
          <Paragraph size={0.9} color="rgba(0,0,0,0.7)">
            {reviewsBreakdown['score']} points from {totalReviews} reviews and{' '}
            {photosBreakdown['score']} points from{' '}
            {photosBreakdown['meeting_criteria_count']} high quality photos.
          </Paragraph>

          <Spacer size="lg" />
          <Divider />
          <Spacer size="lg" />

          <Paragraph textAlign="center" size={0.9} color="rgba(0,0,0,0.6)">
            <TextHighlight backgroundColor={lightGreen}>
              <TextStrong color="#000">{nativeReviewPoints}</TextStrong>
            </TextHighlight>{' '}
            from {totalNativeReviews} Dish reviews and <View />
            <TextHighlight backgroundColor={lightYellow}>
              <TextStrong color="#000">{externalReviewPoints}</TextStrong>
            </TextHighlight>{' '}
            from {totalExternalReviews} {sourceNames(sources)} reviews.
          </Paragraph>

          {showTable && (
            <RestaurantSourcesBreakdown restaurantSlug={props.restaurantSlug} />
          )}

          {!props.showTable && (
            <>
              <Spacer size="lg" />

              <SmallButton
                alignSelf="center"
                onPress={() => setShowTable((x) => !x)}
              >
                {showTable ? 'Hide breakdown' : 'Points breakdown'}
              </SmallButton>
            </>
          )}
        </VStack>
      </HStack>
    )
  })
)
