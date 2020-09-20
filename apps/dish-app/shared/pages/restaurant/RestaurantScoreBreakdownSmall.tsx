import { graphql } from '@dish/graph'
import { HelpCircle } from '@dish/react-feather'
import { HStack, Spacer, Text, VStack } from '@dish/ui'
import { useStore } from '@dish/use-store'
import { sortBy } from 'lodash'
import React, { memo } from 'react'

import { bgLight } from '../../colors'
import { isWeb } from '../../constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useRestaurantTagScores } from '../../hooks/useRestaurantTagScores'
import { omStatic } from '../../state/omStatic'
import { tagDisplayName } from '../../state/tagDisplayName'
import { PointsText } from '../../views/PointsText'
import { RestaurantReviewsDisplayStore } from './RestaurantRatingBreakdown'

const textProps = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.7)',
}

export const RestaurantScoreBreakdownSmall = memo(
  graphql(
    ({
      restaurantSlug,
      restaurantId,
    }: {
      restaurantSlug: string
      restaurantId: string
    }) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const reviewDisplayStore = useStore(RestaurantReviewsDisplayStore, {
        id: restaurantId,
      })
      const tags = omStatic.state.home.lastActiveTags
      const tagScores = useRestaurantTagScores(
        restaurantSlug,
        omStatic.state.home.currentState['activeTagIds']
      )
      const searchQuery = omStatic.state.home.currentState.searchQuery
      const searchQueryText = searchQuery ? ` ${searchQuery}` : ''

      const reviewTags = sortBy(
        tags.filter((tag) => tag.name !== 'Gems'),
        (a) => (a.type === 'lense' ? 0 : a.type === 'dish' ? 2 : 1)
      )

      return (
        <HStack position="relative" alignItems="center" flexWrap="wrap">
          <HStack alignItems="center">
            <Text {...textProps}>
              Base <PointsText points={restaurant.score} /> plus
            </Text>
            <Spacer size="xs" />
            {reviewTags.map((tag, i) => {
              const tagScore = tagScores.find((x) => x.name === tag.name)
              return (
                <HStack
                  key={i}
                  paddingHorizontal={6}
                  paddingVertical={1}
                  borderWidth={1}
                  marginRight={8}
                  borderColor="#eee"
                  borderRadius={100}
                  maxWidth={300 / (reviewTags.length || 1)}
                  flexWrap="nowrap"
                >
                  <Text {...textProps}>{tagDisplayName(tag)}</Text>
                  <Text {...textProps} marginLeft={4} opacity={0.5}>
                    {tagScore?.score ?? '0'}
                  </Text>
                </HStack>
              )
            })}
            {searchQueryText ? (
              <Text marginRight={8} {...textProps}>
                "{searchQuery}"
              </Text>
            ) : null}

            <VStack
              className="hide-when-small"
              padding={3}
              marginVertical={-1}
              borderRadius={100}
              hoverStyle={{
                backgroundColor: bgLight,
              }}
              onPress={reviewDisplayStore.toggleShowComments}
            >
              <HelpCircle
                size={12}
                color={
                  reviewDisplayStore.showComments ? '#000' : 'rgba(0,0,0,0.2)'
                }
              />
            </VStack>
          </HStack>
        </HStack>
      )
    }
  )
)
