import { graphql, query } from '@dish/graph'
import React, { memo } from 'react'
import { AbsoluteVStack, HStack, LoadingItem, VStack } from 'snackui'

import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { suspense } from '../hoc/suspense'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { SlantedTitle } from '../views/SlantedTitle'
import { ContentSectionHoverable } from './ContentSectionHoverable'
import { FeedSlantedTitle } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { HomeFeedProps } from './HomeFeedProps'
import { HoverResultsProp } from './HoverResultsProp'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { RestaurantButton } from './RestaurantButton'
import { SimpleCard, SkewedCardCarousel } from './SimpleCard'

export type FIHotNew = FIBase & {
  type: 'new' | 'hot'
  size?: 'sm' | 'md'
}

// const getGraphResults = (r: restaurant[]) => {
//   return r[0]?.slug ? r : []
// }

export const HomeFeedTrendingNew = suspense(
  memo(
    graphql(function HomeFeedTrendingNew({
      onHoverResults,
      ...props
    }: HomeFeedProps & FIHotNew & HoverResultsProp) {
      const { item, region } = props
      const slug = item.region || region?.slug || ''
      const restaurants = !slug
        ? []
        : props.type === 'new'
        ? query.restaurant_new({
            args: {
              region_slug: slug,
            },
            limit: 8,
          })
        : query.restaurant_trending({
            args: {
              region_slug: slug,
            },
            limit: 8,
          })

      const status = !restaurants[0] || restaurants[0].id === null ? 'loading' : 'complete'

      if (!restaurants.length) {
        return null
      }

      let contents: any = null

      if (props.size === 'sm') {
        contents = (
          <>
            <AbsoluteVStack
              top={0}
              left={0}
              bottom={0}
              paddingLeft={20}
              pointerEvents="none"
              justifyContent="center"
              minWidth={100}
              zIndex={1000}
            >
              <SlantedTitle alignSelf="flex-end" size="xs">
                {props.title}
              </SlantedTitle>
            </AbsoluteVStack>
            <VStack position="relative" zIndex={0} maxWidth="100%" overflow="hidden">
              <ContentScrollViewHorizontal>
                <VStack paddingVertical={13} paddingHorizontal={60} flexWrap="nowrap">
                  <HStack spacing="sm">
                    <VStack width={60} />

                    {restaurants.map((r, index) => {
                      if (!r) return null
                      return (
                        <RestaurantButton
                          key={index}
                          slug={r.slug || ''}
                          id={r.id}
                          // hoverable
                          // size="xs"
                          hoverToMap
                        />
                      )
                    })}
                  </HStack>
                </VStack>
              </ContentScrollViewHorizontal>
            </VStack>
          </>
        )
      } else {
        contents = (
          <ContentSectionHoverable>
            <FeedSlantedTitle zIndex={100}>{props.title}</FeedSlantedTitle>
            <SkewedCardCarousel>
              {restaurants.map((r, i) => {
                if (!r) {
                  return null
                }
                return (
                  <SimpleCard zIndex={1000 - i} key={r.id}>
                    <RestaurantCard
                      size="sm"
                      aspectFixed
                      padTitleSide
                      isBehind={i > 0}
                      hideScore
                      restaurantId={r.id}
                      restaurantSlug={r.slug || ''}
                      hoverable={false}
                      hoverToMap
                    />
                  </SimpleCard>
                )
              })}
            </SkewedCardCarousel>
          </ContentSectionHoverable>
        )
      }

      return (
        <ContentSectionHoverable
          onHoverIn={() => {
            onHoverResults(restaurants.map(getRestaurantIdentifiers))
          }}
        >
          {contents}
        </ContentSectionHoverable>
      )
    })
  ),
  <VStack height={70}>
    <LoadingItem size="sm" />
  </VStack>
)
