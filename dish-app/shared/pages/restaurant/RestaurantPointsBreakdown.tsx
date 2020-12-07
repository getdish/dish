import { graphql } from '@dish/graph'
import React, { memo, useState } from 'react'
import { View } from 'react-native'
import {
  Divider,
  HStack,
  Paragraph,
  Spacer,
  Text,
  TextProps,
  VStack,
} from 'snackui'

import { lightGreen, lightYellow } from '../../colors'
import { numberFormat } from '../../helpers/numberFormat'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { thirdPartyCrawlSources } from '../../thirdPartyCrawlSources'
import { SmallButton } from '../../views/ui/SmallButton'
import { RestaurantSourcesBreakdown } from './RestaurantSourcesBreakdown'
import {
  useTotalExternalReviews,
  useTotalNativeReviews,
  useTotalReviews,
} from './useTotalReviews'

const TextHighlight = (props: TextProps) => (
  <Text paddingHorizontal={4} borderRadius={8} {...props} />
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
  graphql(
    ({
      restaurantSlug,
      restaurantId,
      showTable: showTableDefault,
    }: {
      restaurantSlug: string
      restaurantId: string
      showTable?: boolean
    }) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const sources = restaurant.sources() ?? {}
      const [showTable, setShowTable] = useState(showTableDefault)
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
            <Text textAlign="center" fontSize={40} fontWeight="600">
              {numberFormat(Math.round(restaurant.score))}
            </Text>
            <Spacer />
            {reviewsBreakdown.score != null ? (
              <Paragraph size={0.9} color="rgba(0,0,0,0.7)">
                <TextHighlight backgroundColor={lightGreen}>
                  {numberFormat(Math.round(reviewsBreakdown['score']))}
                </TextHighlight>{' '}
                from {numberFormat(totalReviews)} reviews
              </Paragraph>
            ) : null}

            {photosBreakdown.score != null && reviewsBreakdown.score != null ? (
              <Spacer size="xs" />
            ) : null}

            {photosBreakdown.score != null ? (
              <Paragraph size={0.9} color="rgba(0,0,0,0.7)">
                <TextHighlight backgroundColor={lightGreen}>
                  {numberFormat(Math.round(photosBreakdown['score']))}
                </TextHighlight>{' '}
                from {photosBreakdown['meeting_criteria_count']} good photos
              </Paragraph>
            ) : null}

            <Spacer size="lg" />
            <Divider />
            <Spacer size="lg" />

            <Paragraph textAlign="center" size={0.9} color="rgba(0,0,0,0.6)">
              <TextHighlight fontWeight="700" backgroundColor={lightGreen}>
                {numberFormat(Math.round(nativeReviewPoints))}
              </TextHighlight>{' '}
              points from {numberFormat(totalNativeReviews)} Dish reviews and{' '}
              <View />
              <TextHighlight fontWeight="700" backgroundColor={lightYellow}>
                {numberFormat(Math.round(externalReviewPoints))}
              </TextHighlight>{' '}
              from {numberFormat(totalExternalReviews)} {sourceNames(sources)}{' '}
              reviews.
            </Paragraph>

            {/* <RestaurantTagsScore
              userVote={0}
              restaurantSlug={restaurantSlug}
              activeTags={tagLenses.reduce((acc, cur) => {
                acc[getTagSlug(cur)] = true
                return acc
              }, {})}
            /> */}

            <Spacer size="lg" />

            {showTable && (
              <RestaurantSourcesBreakdown restaurantSlug={restaurantSlug} />
            )}

            {!showTable && (
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
    }
  )
)
