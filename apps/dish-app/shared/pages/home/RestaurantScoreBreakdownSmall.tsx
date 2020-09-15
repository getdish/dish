import { graphql } from '@dish/graph'
import { HelpCircle } from '@dish/react-feather'
import { HStack, Spacer, Text, Tooltip, VStack } from '@dish/ui'
import { useStore } from '@dish/use-store'
import { sortBy } from 'lodash'
import React, { memo } from 'react'
import { Image } from 'react-native'

import { bgLight } from '../../colors'
import { isWeb } from '../../constants'
import { omStatic } from '../../state/omStatic'
import { tagDisplayName } from '../../state/tagDisplayName'
import { RestaurantReviewsDisplayStore } from './RestaurantRatingBreakdown'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'
import { useRestaurantQuery } from './useRestaurantQuery'

export const RestaurantScoreBreakdownSmall = memo(
  graphql(
    ({
      restaurantSlug,
      restaurantId,
    }: {
      restaurantSlug: string
      restaurantId: string
    }) => {
      const reviewDisplayStore = useStore(RestaurantReviewsDisplayStore, {
        id: restaurantId,
      })
      const restaurant = useRestaurantQuery(restaurantSlug)
      const sources = {
        dish: {
          rating: 3,
        },
        ...(restaurant?.sources?.() ?? {}),
      }

      const searchQuery = omStatic.state.home.currentState.searchQuery
      const searchQueryText = searchQuery ? ` ${searchQuery}` : ''

      const tags = omStatic.state.home.lastActiveTags
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
            <Text fontSize={12}>
              in "
              <Text fontWeight="600">
                {(
                  reviewTags
                    .map((tag, i) => {
                      return tagDisplayName(tag)
                    })
                    .join(' ') + searchQueryText
                ).trim()}
              </Text>
              "
            </Text>{' '}
          </Text>

          <Spacer size={6} />

          {Object.keys(sources)
            .filter(
              (source) => thirdPartyCrawlSources[source]?.delivery === false
            )
            .map((source, i) => {
              const item = sources[source]
              const info = thirdPartyCrawlSources[source]
              return (
                <Tooltip
                  key={source}
                  contents={`${info.name} +${+(item.rating ?? 0) * 10} points`}
                >
                  <HStack
                    className="faded-out"
                    alignItems="center"
                    paddingHorizontal={5}
                    paddingVertical={3}
                    borderRadius={100}
                  >
                    {info?.image ? (
                      <Image
                        source={info.image}
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 100,
                        }}
                      />
                    ) : null}
                    <Spacer size={3} />
                    <Text fontWeight="500" fontSize={13} opacity={0.5}>
                      {+(item.rating ?? 0) * 10}
                    </Text>
                  </HStack>
                </Tooltip>
              )
            })}

          <Spacer size="sm" />

          <VStack
            className="hide-when-small"
            padding={3}
            marginVertical={-1}
            marginLeft={3}
            borderRadius={100}
            hoverStyle={{
              backgroundColor: bgLight,
            }}
            onPress={reviewDisplayStore.toggleShowComments}
          >
            <HelpCircle
              size={14}
              color={
                reviewDisplayStore.showComments ? '#000' : 'rgba(0,0,0,0.5)'
              }
            />
          </VStack>
        </HStack>
      )
    }
  )
)
