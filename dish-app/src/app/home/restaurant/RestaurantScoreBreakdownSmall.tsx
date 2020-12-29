import { graphql } from '@dish/graph'
import { HelpCircle } from '@dish/react-feather'
import { useStore } from '@dish/use-store'
import { sortBy } from 'lodash'
import React, { memo } from 'react'
import { HStack, Spacer, Text, VStack } from 'snackui'

import { bgLight } from '../../../constants/colors'
import { tagDisplayName } from '../../../constants/tagMeta'
import { getActiveTagSlugs } from '../../../helpers/getActiveTagSlugs'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useRestaurantTagScores } from '../../hooks/useRestaurantTagScores'
import { om } from '../../state/om'
import { PointsText } from '../../views/PointsText'
import { RestaurantReviewsDisplayStore } from './RestaurantBreakdown'

export const RestaurantScoreBreakdownSmall = memo(
  graphql(
    ({
      restaurantSlug,
      restaurantId,
    }: {
      restaurantSlug: string
      restaurantId: string
    }) => {
      const textProps = {
        fontSize: 15,
        color: 'rgba(0,0,0,0.6)',
      }

      const restaurant = useRestaurantQuery(restaurantSlug)
      const reviewDisplayStore = useStore(RestaurantReviewsDisplayStore, {
        id: restaurantId,
      })
      const tags = om.state.home.lastActiveTags
      const tagScores = useRestaurantTagScores({
        restaurantSlug,
        tagSlugs: getActiveTagSlugs(),
      })
      const searchQuery = om.state.home.currentState.searchQuery
      const searchQueryText = searchQuery ? ` ${searchQuery}` : ''
      const reviewTags = sortBy(
        tags.filter((tag) => tag.name !== 'Gems'),
        (a) => (a.type === 'lense' ? 0 : a.type === 'dish' ? 2 : 1)
      )

      return (
        <HStack position="relative" alignItems="center" flexWrap="wrap">
          <HStack alignItems="center">
            <Text {...textProps}>
              <PointsText {...textProps} points={restaurant.score} /> plus
            </Text>
            <Spacer size="xs" />
            {reviewTags.map((tag, i) => {
              const tagScore = tagScores.find((x) => x.name === tag.name)
              return (
                <HStack
                  key={i}
                  paddingHorizontal={6}
                  paddingVertical={2}
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
