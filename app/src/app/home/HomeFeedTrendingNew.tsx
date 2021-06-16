import { RestaurantOnlyIds, graphql, query, restaurant } from '@dish/graph'
import React, { memo, useMemo } from 'react'
import { AbsoluteVStack, HStack, VStack } from 'snackui'

import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { SlantedTitle } from '../views/SlantedTitle'
import { ContentSectionHoverable } from './ContentSectionHoverable'
import { FeedSlantedTitle } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { HomeFeedProps } from './HomeFeedProps'
import { HoverResultsProp } from './HoverResultsProp'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { RestaurantButton } from './RestaurantButton'
import { SkewedCard, SkewedCardCarousel } from './SkewedCard'

export type FIHotNew = FIBase & {
  type: 'new' | 'hot'
  size: 'sm' | 'md'
  restaurants: restaurant[]
  status: 'loading' | 'complete'
}

const getGraphResults = (r: restaurant[]) => {
  return r[0]?.slug ? r : []
}

export function useHomeFeedTrendingNew(props: HomeFeedProps): FIHotNew[] {
  const { item, region } = props
  const slug = item.region || region?.slug || ''
  const newest = slug
    ? query.restaurant_new({
        args: {
          region_slug: slug,
        },
        limit: 8,
      })
    : []

  const trending = slug
    ? query.restaurant_trending({
        args: {
          region_slug: slug,
        },
        limit: 8,
      })
    : []

  const status = !trending[0] || trending[0].id === null ? 'loading' : 'complete'

  const key = `${status}${newest.map((x) => x.slug)}${trending.map((x) => x.slug)}`
  return useMemo(() => {
    return [
      {
        id: '1',
        type: 'new',
        size: 'sm',
        title: 'New',
        restaurants: getGraphResults(newest),
        status,
      },
      {
        id: '2',
        type: 'hot',
        size: 'sm',
        title: 'Trending',
        restaurants: getGraphResults(trending),
        status,
      },
    ]
  }, [key])
}

export const HomeFeedTrendingNew = memo(
  graphql(function HomeFeedTrendingNew({
    restaurants,
    onHoverResults,
    ...props
  }: FIHotNew & HoverResultsProp) {
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
          >
            <SlantedTitle alignSelf="flex-end" size="xs" zIndex={10}>
              {props.title}
            </SlantedTitle>
          </AbsoluteVStack>
          <VStack maxWidth="100%" overflow="hidden">
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
                    restaurantSlug={r.slug || ''}
                    hoverable={false}
                    hoverToMap
                  />
                </SkewedCard>
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
)