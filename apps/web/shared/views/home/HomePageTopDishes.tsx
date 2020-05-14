import { Restaurant } from '@dish/graph'
import { TopCuisine } from '@dish/models'
import _ from 'lodash'
import React, { memo, useCallback, useState } from 'react'
import { ScrollView, Text } from 'react-native'

import { HomeStateItem, HomeStateItemHome } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { NotFoundPage } from '../NotFoundPage'
import { LinkButton, OverlayLinkButton } from '../ui/Link'
import { MediaQuery, mediaQueries } from '../ui/MediaQuery'
import { PageTitleTag } from '../ui/PageTitleTag'
import { SmallTitle, SmallerTitle } from '../ui/SmallTitle'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { flatButtonStyle } from './baseButtonStyle'
import { bgLightLight } from './colors'
import { DishView } from './DishView'
import HomeFilterBar from './HomeFilterBar'
import { HomeLenseBarOnly } from './HomeLenseBar'
import { LoadingItem, LoadingItems } from './LoadingItems'
import { RestaurantButton } from './RestaurantButton'
import { TrendingButton } from './TrendingButton'

export default memo(function HomePageTopDishes({
  stateIndex,
}: {
  stateIndex: number
}) {
  const om = useOvermind()
  const state = om.state.home.states[stateIndex] as HomeStateItemHome
  if (!state) return <NotFoundPage />

  const { topDishes, topDishesFilteredIndices } = om.state.home
  let results = topDishes
  if (topDishesFilteredIndices.length) {
    results = results.filter(
      (_, index) => topDishesFilteredIndices.indexOf(index) > -1
    )
  }
  // for now force at top because its most filled out
  results = [...results].sort((x) => (x.country === 'Vietnamese' ? -1 : 1))

  return (
    <>
      <PageTitleTag>Dish - Uniquely Good Food</PageTitleTag>
      <VStack position="relative" flex={1}>
        <ScrollView style={{ flex: 1 }}>
          <VStack paddingVertical={34} paddingTop={94} spacing="xl">
            {/* TRENDING */}
            <HomeViewTopDishesTrending />

            {/* LENSES - UNIQUELY GOOD HERE */}
            <VStack spacing="lg">
              <SmallTitle>
                {om.state.home.lastActiveTags
                  .find((x) => x.type === 'lense')
                  ?.descriptions?.plain.replace(
                    'Here',
                    `in ${om.state.home.lastHomeState.currentLocationName}`
                  ) ?? ''}
              </SmallTitle>

              <VStack spacing alignItems="center">
                <HomeLenseBarOnly
                  activeTagIds={om.state.home.lastHomeState.activeTagIds}
                />
                <HomeFilterBar
                  activeTagIds={om.state.home.lastHomeState.activeTagIds}
                />
              </VStack>

              {!results.length && <LoadingItems />}

              {results.map((country) => (
                <CountryTopDishesAndRestaurants
                  key={country.country}
                  country={country}
                />
              ))}
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>
    </>
  )
})

const HomeViewTopDishesTrending = memo(() => {
  const om = useOvermind()
  const allRestaurants = om.state.home.topDishes[0]?.top_restaurants ?? []
  const hasLoaded = allRestaurants.length > 0

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
        // rank={index + 1}
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
              {allRestaurants.slice(0, total).map(getTrending)}
            </VStack>
          </VStack>
        </VStack>
        <VStack flex={1} spacing={6}>
          <SmallerTitle marginBottom={5}>Dishes</SmallerTitle>
          <VStack spacing={listSpace} overflow="hidden">
            {!hasLoaded && <LoadingItem />}
            {allRestaurants.slice(0, total).map(getTrending)}
          </VStack>
        </VStack>
        <MediaQuery query={mediaQueries.md} style={{ display: 'none' }}>
          <VStack flex={1} spacing={6}>
            <SmallerTitle marginBottom={5}>Topics</SmallerTitle>
            <VStack spacing={listSpace} overflow="hidden">
              {!hasLoaded && <LoadingItem />}
              {allRestaurants.slice(0, total).map(getTrending)}
            </VStack>
          </VStack>
        </MediaQuery>
      </HStack>
    </VStack>
  )
})

const CountryTopDishesAndRestaurants = memo(
  ({ country }: { country: TopCuisine }) => {
    const [hoveredRestaurant, setHoveredRestaurant] = useState<Restaurant>(null)
    const onHoverRestaurant = useCallback((restaurant: Restaurant) => {
      setHoveredRestaurant(restaurant)
    }, [])

    const padding = 30
    const dishHeight = 150
    const spacing = 26

    return (
      <VStack
        paddingVertical={15}
        className="home-top-dish"
        // onHoverIn={() => setHovered(true)}
        // onHoverOut={() => setHovered(false)}
      >
        <HStack paddingHorizontal={20}>
          <HStack flex={1}>
            {/* <RankingView rank={rank} marginLeft={-36} /> */}
            <LinkButton
              {...flatButtonStyle}
              paddingVertical={4}
              marginVertical={-6}
              style={{
                transform: [{ rotate: '-2deg' }],
              }}
              tag={{
                type: 'country',
                name: country.country,
              }}
            >
              <Text
                numberOfLines={1}
                style={{ fontSize: 20, fontWeight: '600' }}
              >
                {country.country} {country.icon}
              </Text>
            </LinkButton>
          </HStack>
          <Spacer flex />
        </HStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack
            height={dishHeight + padding * 2}
            alignItems="center"
            padding={padding}
            paddingTop={padding + 10}
            paddingHorizontal={32}
            spacing={spacing}
          >
            {(country.dishes || []).slice(0, 10).map((top_dish, index) => {
              return (
                <DishView
                  size={dishHeight}
                  key={index}
                  dish={top_dish as any}
                  cuisine={{
                    id: country.country,
                    name: country.country,
                    type: 'country',
                  }}
                />
              )
            })}
          </HStack>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack padding={10} paddingHorizontal={30} spacing={32}>
            {_.uniqBy(country.top_restaurants, (x) => x.name).map(
              (restaurant, index) => {
                console.log('restaurant', restaurant.name, index)
                return (
                  <RestaurantButton
                    key={restaurant.name}
                    restaurant={restaurant as any}
                    onHoverIn={onHoverRestaurant}
                    active={
                      // (!hoveredRestaurant && index === 0) ||
                      hoveredRestaurant &&
                      restaurant?.name === hoveredRestaurant?.name
                    }
                  />
                )
              }
            )}
          </HStack>
        </ScrollView>
      </VStack>
    )
  }
)

// {/* <HoverablePopover
//           position="right"
//           contents={
//             <Box>
//               {['All', 'Asia', 'Americas', 'Europe', 'Mid-East', 'Africa'].map(
//                 (tag) => (
//                   <SmallButton isActive={tag === 'All'} key={tag}>
//                     {tag}
//                   </SmallButton>
//                 )
//               )}
//             </Box>
//           }
//         >
//           <VStack pointerEvents="auto">
//             <Text>123</Text>
//           </VStack>
//         </HoverablePopover> */}
