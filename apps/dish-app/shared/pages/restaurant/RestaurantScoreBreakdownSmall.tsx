import { graphql } from '@dish/graph'
import { HelpCircle } from '@dish/react-feather'
import { HStack, Spacer, Text, Tooltip, VStack } from '@dish/ui'
import { useStore } from '@dish/use-store'
import { sortBy } from 'lodash'
import React, { memo } from 'react'
import { Image } from 'react-native'

import { bgLight } from '../../colors'
import { isWeb } from '../../constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useRestaurantTagScores } from '../../hooks/useRestaurantTagScores'
import { omStatic } from '../../state/omStatic'
import { tagDisplayName } from '../../state/tagDisplayName'
import { thirdPartyCrawlSources } from '../../thirdPartyCrawlSources'
import { PointsText } from '../../views/PointsText'
import { RestaurantReviewsDisplayStore } from './RestaurantRatingBreakdown'

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
          <Text
            className="ellipse"
            maxWidth={isWeb ? 'calc(min(100%, 170px))' : '100%'}
            fontSize={12}
            color="rgba(0,0,0,0.5)"
          >
            <Text fontSize={14}>
              <PointsText points={restaurant.score} />{' '}
              {reviewTags.map((tag, i) => {
                const tagScore = tagScores.find((x) => x.name === tag.name)
                return (
                  <Text
                    paddingHorizontal={6}
                    paddingVertical={1}
                    borderWidth={1}
                    borderColor="#eee"
                    borderRadius={100}
                  >
                    {tagDisplayName(tag)}
                    <Text opacity={0.5}>{tagScore?.score ?? '0'}</Text>
                  </Text>
                )
              })}
              {searchQueryText && <Text>"{searchQuery}"</Text>}
            </Text>{' '}
          </Text>

          <Spacer size="sm" />

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
      )
    }
  )
)
