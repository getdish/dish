import { Dish, Restaurant, TopDish } from '@dish/models'
import _ from 'lodash'
import React, { memo, useCallback, useState } from 'react'
import { ScrollView, Text } from 'react-native'

import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { HomeStateItemHome } from '../../state/home'
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
        <HomeViewTopDishesContent />
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
      <SmallTitle centerDivider>
        Trending in {om.state.home.location?.name ?? 'San Francisco'}
      </SmallTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <VStack paddingHorizontal={25} spacing="sm">
          <HStack flex={1} spacing={5} overflow="hidden">
            <SmallerTitle
              width={120}
              paddingRight={10}
              justifyContent="flex-end"
              hideDivider
            >
              Restaurants
            </SmallerTitle>
            {allRestaurants.slice(0, 8).map(getTrending)}
          </HStack>
          <HStack flex={1} spacing={3} overflow="hidden">
            <SmallerTitle
              width={120}
              paddingRight={10}
              justifyContent="flex-end"
              hideDivider
            >
              Dishes
            </SmallerTitle>
            {allRestaurants.slice(4).map(getTrending)}
          </HStack>
          <HStack flex={1} spacing={3} overflow="hidden">
            <SmallerTitle
              width={120}
              paddingRight={10}
              justifyContent="flex-end"
              hideDivider
            >
              Topics
            </SmallerTitle>
            {allRestaurants.slice(2).map(getTrending)}
          </HStack>
        </VStack>
      </ScrollView>
    </VStack>
  )
})

const HomeViewTopDishesContent = memo(() => {
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
          <SmallTitle centerDivider>
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
  ({ country, rank }: { country: TopDish; rank: number }) => {
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
              {...om.actions.home.getNavigateToTag({
                type: 'country',
                name: country.country,
              })}
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
              return <DishView key={index} dish={top_dish} />
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
