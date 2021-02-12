import { RestaurantOnlyIds, SEARCH_DOMAIN, graphql } from '@dish/graph'
import React, { memo } from 'react'
import { HStack, VStack } from 'snackui'

import { useQueryLoud } from '../../helpers/useQueryLoud'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { FeedSlantedTitle } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { HomeFeedProps } from './HomeFeedProps'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { RestaurantButton } from './RestaurantButton'
import { SkewedCard, SkewedCardCarousel } from './SkewedCard'

export type FINew = FIBase & {
  type: 'new'
  size: 'sm' | 'md'
  restaurants: RestaurantOnlyIds[]
}

export type FIHot = FIBase & {
  type: 'hot'
  size: 'sm' | 'md'
  restaurants: RestaurantOnlyIds[]
}

type FeedApiResponse = {
  trending: RestaurantOnlyIds[]
  newest: RestaurantOnlyIds[]
}

export function useHomeFeedTrendingNew(props: HomeFeedProps) {
  const { item, region } = props
  const slug = item.region ?? region?.slug ?? ''
  const homeFeed = useQueryLoud<FeedApiResponse>(
    `HOMEFEEDQUERY-${slug}`,
    () =>
      fetch(
        `${SEARCH_DOMAIN}/feed?region=${encodeURIComponent(slug)}&limit=20`
      ).then((res) => res.json()),
    {
      enabled: !!slug,
      suspense: false,
    }
  )
  const feedData = homeFeed.data
  return [
    {
      id: '1',
      type: 'new',
      size: 'sm',
      rank: -2,
      title: 'New',
      restaurants: feedData?.newest,
    } as FINew,

    {
      id: '2',
      type: 'hot',
      size: 'sm',
      title: 'Trending',
      rank: -1,
      restaurants: feedData?.trending,
    } as FIHot,
  ]
}

export const HomeFeedTrendingNew = memo(
  graphql(function HomeFeedTrendingNew(props: FIHot | FINew) {
    const restaurants = props.restaurants
    if (!restaurants) {
      return null
    }
    if (props.size === 'sm') {
      return (
        <>
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
                <HStack
                  spacing={6}
                  marginHorizontal="auto"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                >
                  <VStack width={80} />

                  {restaurants.map((r, index) => {
                    if (!r) return null
                    return <RestaurantButton key={index} slug={r.slug} />
                  })}
                </HStack>
              </VStack>
            </ContentScrollViewHorizontal>
          </VStack>
        </>
      )
    }
    return (
      <>
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
      </>
    )
  })
)
