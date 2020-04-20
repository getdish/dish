import { Dish, Restaurant, TopDish } from '@dish/models'
import _ from 'lodash'
import React, { memo, useCallback, useState } from 'react'
import { ScrollView, Text } from 'react-native'

import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { HomeStateItem, HomeStateItemHome } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Box } from '../ui/Box'
import { HoverablePopover } from '../ui/HoverablePopover'
import { LinkButton } from '../ui/Link'
import { MediaQuery, mediaQueries } from '../ui/MediaQuery'
import { PageTitleTag } from '../ui/PageTitleTag'
import { SmallTitle, SmallerTitle } from '../ui/SmallTitle'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack } from '../ui/Stacks'
import { flatButtonStyle } from './baseButtonStyle'
import { bgLightLight } from './colors'
import { DishView } from './DishView'
import HomeFilterBar from './HomeFilterBar'
import HomeLenseBar, { HomeLenseBarOnly } from './HomeLenseBar'
import { RestaurantButton } from './RestaurantButton'
import { SmallButton } from './SmallButton'
import { TrendingButton } from './TrendingButton'

export default memoIsEqualDeep(function HomePageTopDIshes({
  state,
}: {
  state: HomeStateItemHome
}) {
  return (
    <>
      <PageTitleTag>Dish - Uniquely Good Food</PageTitleTag>
      <VStack position="relative" flex={1}>
        <HomeViewTopDishesContent state={state} />
      </VStack>
    </>
  )
})

const HomeViewTopDishesTrending = memo(() => {
  const om = useOvermind()
  const allRestaurants = om.state.home.topDishes[0]?.top_restaurants ?? []
  const getTrending = (restaurant: Partial<Restaurant>, index: number) => {
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
  return (
    <VStack spacing="lg">
      <SmallTitle divider="off">
        Trending in {om.state.home.location?.name ?? 'San Francisco'}
      </SmallTitle>
      <HStack spacing="sm" paddingHorizontal={10}>
        <VStack flex={1} spacing={6}>
          <SmallerTitle>Restaurants</SmallerTitle>
          <VStack spacing={0} overflow="hidden">
            {allRestaurants.slice(0, 5).map(getTrending)}
          </VStack>
        </VStack>
        <VStack flex={1} spacing={6}>
          <SmallerTitle>Dishes</SmallerTitle>
          <VStack spacing={0} overflow="hidden">
            {allRestaurants.slice(5).map(getTrending)}
          </VStack>
        </VStack>
        <VStack flex={1} spacing={6}>
          <SmallerTitle>Topics</SmallerTitle>
          <VStack spacing={0} overflow="hidden">
            {allRestaurants.slice(5).map(getTrending)}
          </VStack>
        </VStack>
      </HStack>
    </VStack>
  )
})

const HomeViewTopDishesContent = memo(({ state }: { state: HomeStateItem }) => {
  const om = useOvermind()
  const { topDishes, topDishesFilteredIndices } = om.state.home
  let results = topDishes
  if (topDishesFilteredIndices.length) {
    results = results.filter(
      (_, index) => topDishesFilteredIndices.indexOf(index) > -1
    )
  }
  return (
    <ScrollView style={{ flex: 1, overflow: 'hidden' }}>
      <VStack paddingVertical={20} spacing="xl">
        {/* <Text style={{ fontWeight: '700', fontSize: 22, textAlign: 'center' }}>
          San Francisco
        </Text> */}

        <HomeViewTopDishesTrending />

        <VStack spacing="lg">
          <SmallTitle divider="off">
            {om.state.home.lastActiveTags.find((x) => x.type === 'lense')
              ?.description ?? ''}{' '}
          </SmallTitle>

          <VStack spacing>
            <HomeLenseBarOnly
              activeTagIds={om.state.home.lastHomeState.activeTagIds}
            />
            <HomeFilterBar
              activeTagIds={om.state.home.lastHomeState.activeTagIds}
            />
          </VStack>

          {[...results]
            // for now force japanese at top because its most filled out
            .sort((x) => (x.country === 'Japanese' ? -1 : 1))
            .map((country, index) => (
              <CountryTopDishesAndRestaurants
                state={state}
                key={country.country}
                country={country}
                rank={index + 1}
              />
            ))}
        </VStack>
      </VStack>
    </ScrollView>
  )
})

const CountryTopDishesAndRestaurants = memo(
  ({
    state,
    country,
    rank,
  }: {
    country: TopDish
    rank: number
    state: HomeStateItem
  }) => {
    const om = useOvermind()
    const [hovered, setHovered] = useState(false)
    const [hoveredRestaurant, setHoveredRestaurant] = useState<Restaurant>(null)
    const onHoverRestaurant = useCallback((restaurant: Restaurant) => {
      setHoveredRestaurant(restaurant)
    }, [])

    return (
      <VStack
        paddingVertical={5}
        paddingTop={20}
        backgroundColor={hovered ? bgLightLight : null}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        <HStack paddingHorizontal={20}>
          <HStack flex={1}>
            {/* <RankingView rank={rank} marginLeft={-36} /> */}
            <LinkButton
              {...flatButtonStyle}
              // backgroundColor="transparent"
              marginVertical={-8}
              tag={{
                type: 'country',
                name: country.country,
              }}
            >
              <Text
                numberOfLines={1}
                style={{ fontSize: 18, fontWeight: '600' }}
              >
                {country.country} {country.icon}
              </Text>
            </LinkButton>
          </HStack>
          <Spacer flex />
        </HStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack
            height={160}
            alignItems="center"
            padding={20}
            paddingBottom={10}
            paddingHorizontal={32}
            spacing={22}
          >
            {(country.dishes || []).slice(0, 5).map((top_dish, index) => {
              return <DishView key={index} dish={top_dish as any} />
            })}
          </HStack>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack padding={10} paddingHorizontal={30} spacing={32}>
            {_.uniqBy(country.top_restaurants, (x) => x.name).map(
              (restaurant, index) => (
                <RestaurantButton
                  key={restaurant.name}
                  restaurant={restaurant}
                  onHoverIn={onHoverRestaurant}
                  active={
                    (!hoveredRestaurant && index === 0) ||
                    restaurant === hoveredRestaurant
                  }
                />
              )
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
