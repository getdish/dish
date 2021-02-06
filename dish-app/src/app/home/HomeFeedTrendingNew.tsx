import { RestaurantOnlyIds, SEARCH_DOMAIN, graphql } from '@dish/graph'
import React, { memo } from 'react'

import { useQueryLoud } from '../../helpers/useQueryLoud'
import { FeedSlantedTitle } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { HomeFeedProps } from './HomeFeedProps'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { SkewedCard, SkewedCardCarousel } from './SkewedCard'

export type FINew = FIBase & {
  type: 'new'
  restaurants: RestaurantOnlyIds[]
}

export type FIHot = FIBase & {
  type: 'hot'
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
      rank: -2,
      title: 'New',
      restaurants: feedData?.newest,
    } as FINew,

    {
      id: '2',
      type: 'hot',
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
