import { RestaurantOnlyIds, graphql, query } from '@dish/graph'
import React, { memo, useMemo } from 'react'
import { HStack, VStack } from 'snackui'

import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { ContentSectionHoverable } from './ContentSectionHoverable'
import { FeedSlantedTitle } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { HomeFeedProps } from './HomeFeedProps'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { RestaurantButton } from './RestaurantButton'
import { SkewedCard, SkewedCardCarousel } from './SkewedCard'

export type FIHotNew = FIBase & {
  type: 'new' | 'hot'
  size: 'sm' | 'md'
  restaurants: RestaurantOnlyIds[]
  status: 'loading' | 'complete'
}

const getGraphResults = (r: any) => {
  return r[0]?.slug ? r : []
}

export function useHomeFeedTrendingNew(props: HomeFeedProps): FIHotNew[] {
  const { item, region } = props
  const slug = item.region ?? region?.slug ?? ''
  const newest = query
    .restaurant_new({
      args: {
        region_slug: slug,
      },
      limit: 8,
    })
    .map(getRestaurantIdentifiers)

  const trending = query
    .restaurant_trending({
      args: {
        region_slug: slug,
      },
      limit: 8,
    })
    .map(getRestaurantIdentifiers)
  const status =
    !trending[0] || trending[0].id === null ? 'loading' : 'complete'

  const key = `${status}${newest.map((x) => x.slug)}${trending.map(
    (x) => x.slug
  )}`
  return useMemo(() => {
    return [
      {
        id: '1',
        type: 'new',
        size: 'sm',
        rank: -2,
        title: 'New',
        restaurants: getGraphResults(newest),
        status,
        expandable: false,
      },
      {
        id: '2',
        type: 'hot',
        size: 'sm',
        title: 'Trending',
        rank: -1,
        restaurants: getGraphResults(trending),
        status,
        expandable: false,
      },
    ]
  }, [key])
}

export const HomeFeedTrendingNew = memo(
  graphql(function HomeFeedTrendingNew(props: FIHotNew) {
    const restaurants = props.restaurants
    if (!restaurants.length) {
      return null
    }
    if (props.size === 'sm') {
      return (
        <ContentSectionHoverable>
          <FeedSlantedTitle size="sm" zIndex={10}>
            {props.title}
          </FeedSlantedTitle>
          <VStack
            maxWidth="100%"
            overflow="hidden"
            marginTop={-15}
            marginBottom={10}
          >
            <ContentScrollViewHorizontal>
              <VStack
                paddingVertical={12}
                paddingHorizontal={40}
                flexWrap="nowrap"
              >
                <HStack spacing={6} overflow="hidden">
                  <VStack width={props.type == 'hot' ? 72 : 30} />

                  {restaurants.map((r, index) => {
                    if (!r) return null
                    return (
                      <RestaurantButton
                        key={index}
                        slug={r.slug}
                        id={r.id}
                        hoverToMap
                      />
                    )
                  })}
                </HStack>
              </VStack>
            </ContentScrollViewHorizontal>
          </VStack>
        </ContentSectionHoverable>
      )
    }
    return (
      <ContentSectionHoverable>
        <FeedSlantedTitle zIndex={10}>{props.title}</FeedSlantedTitle>
        <SkewedCardCarousel>
          {restaurants.map((r, i) => {
            if (!r) {
              return null
            }
            return (
              <SkewedCard zIndex={1000 - i} key={r.id}>
                <RestaurantCard
                  size="sm"
                  aspectFixed
                  padTitleSide
                  isBehind={i > 0}
                  hideScore
                  restaurantId={r.id}
                  restaurantSlug={r.slug}
                  hoverable={false}
                  hoverToMap
                />
              </SkewedCard>
            )
          })}
        </SkewedCardCarousel>
      </ContentSectionHoverable>
    )
  })
)
