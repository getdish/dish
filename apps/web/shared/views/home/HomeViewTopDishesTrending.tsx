import {
  HStack,
  LoadingItem,
  MediaQuery,
  SmallerTitle,
  VStack,
  ZStack,
  mediaQueries,
} from '@dish/ui'
import React, { memo } from 'react'

import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/LinkButton'
import { TrendingButton } from './TrendingButton'

export const HomeViewTopDishesTrending = memo(() => {
  const om = useOvermind()
  const topRestaurants = om.state.home.topDishes[0]?.top_restaurants ?? []
  const hasLoaded = topRestaurants.length > 0

  // @tom if you change Partial<any> to Partial<Restauarant>
  // you can see below at `getTrending` they disagree on Restaurant
  // if its >10m to fix we can leave it as any for now
  const getTrending = (restaurant: Partial<any>, index: number) => {
    return (
      <TrendingButton
        key={`${index}${restaurant.id}`}
        name="restaurant"
        params={{
          slug: restaurant.slug,
        }}
      >
        {['🍔', '🌮', '🥗', '🍲', '🥩'][(index % 4) + 1]} {restaurant.name}
      </TrendingButton>
    )
  }

  const listSpace = 3
  const total = 5

  return (
    <VStack height={188 + listSpace * (total - 1)}>
      <HStack spacing="lg" paddingHorizontal={10}>
        <VStack flex={1}>
          <ZStack position="absolute" top={-5} left={-12} zIndex={100}>
            <LinkButton
              paddingVertical={5}
              paddingHorizontal={6}
              fontSize={12}
              shadowColor={'rgba(0,0,0,0.1)'}
              shadowRadius={8}
              shadowOffset={{ height: 2, width: 0 }}
              backgroundColor="#fff"
              borderRadius={8}
              fontWeight="700"
              transform={[{ rotate: '-4deg' }]}
            >
              Trending
            </LinkButton>
          </ZStack>
          <VStack spacing={6}>
            <SmallerTitle marginBottom={5}>Restaurants</SmallerTitle>
            <VStack spacing={listSpace} overflow="hidden">
              {!hasLoaded && <LoadingItem />}
              {topRestaurants.slice(0, total).map(getTrending)}
            </VStack>
          </VStack>
        </VStack>
        <VStack flex={1} spacing={6}>
          <SmallerTitle marginBottom={5}>Dishes</SmallerTitle>
          <VStack spacing={listSpace} overflow="hidden">
            {!hasLoaded && <LoadingItem />}
            {topRestaurants.slice(0, total).map(getTrending)}
          </VStack>
        </VStack>
        <MediaQuery query={mediaQueries.md} style={{ display: 'none' }}>
          <VStack flex={1} spacing={6}>
            <SmallerTitle marginBottom={5}>Topics</SmallerTitle>
            <VStack spacing={listSpace} overflow="hidden">
              {!hasLoaded && <LoadingItem />}
              {topRestaurants.slice(0, total).map(getTrending)}
            </VStack>
          </VStack>
        </MediaQuery>
      </HStack>
    </VStack>
  )
})
