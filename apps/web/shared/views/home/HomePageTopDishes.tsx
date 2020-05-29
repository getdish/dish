import { Restaurant, TopCuisine } from '@dish/graph'
import {
  HStack,
  HorizontalLine,
  LinearGradient,
  SmallTitle,
  Spacer,
  VStack,
  ZStack,
} from '@dish/ui'
import { LoadingItems } from '@dish/ui'
import _ from 'lodash'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, Text } from 'react-native'

import { HomeStateItemHome } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { NotFoundPage } from '../NotFoundPage'
import { LinkButton } from '../ui/LinkButton'
import { PageTitleTag } from '../ui/PageTitleTag'
import { flatButtonStyle } from './baseButtonStyle'
import { DishView } from './DishView'
import HomeFilterBar from './HomeFilterBar'
import { HomeLenseBarOnly } from './HomeLenseBar'
import { HomeScrollView } from './HomeScrollView'
import { RestaurantButton } from './RestaurantButton'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

type TopDishesProps = {
  stateIndex: number
}

export default memo(function HomePageTopDishesContainer(props: TopDishesProps) {
  const om = useOvermind()
  const isOnHome = om.state.home.currentStateType === 'home'
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isOnHome) {
      setIsLoaded(true)
    }
  }, [isOnHome])

  if (isOnHome || isLoaded) {
    return <HomePageTopDishes {...props} />
  }

  return null
})

const HomePageTopDishes = ({ stateIndex }: TopDishesProps) => {
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
        <HomeScrollView>
          <VStack paddingVertical={34} paddingTop={88} spacing="xl">
            {/* TRENDING */}
            {/* <HomeViewTopDishesTrending /> */}

            {/* LENSES - UNIQUELY GOOD HERE */}
            <VStack spacing="lg">
              <SmallTitle divider="off">
                {om.state.home.lastActiveTags
                  .find((x) => x.type === 'lense')
                  ?.descriptions?.plain.replace(
                    'Here',
                    `in ${om.state.home.lastHomeState.currentLocationName}`
                  ) ?? ''}
              </SmallTitle>

              <VStack spacing alignItems="center">
                <HStack
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  paddingHorizontal={20}
                  spacing={20}
                >
                  <HorizontalLine />
                  <HomeLenseBarOnly
                    size="lg"
                    activeTagIds={om.state.home.lastHomeState.activeTagIds}
                  />
                  <HorizontalLine />
                </HStack>
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
        </HomeScrollView>
      </VStack>
    </>
  )
}

const dishHeight = 160
const padding = 30
const spacing = 20

const CountryTopDishesAndRestaurants = memo(
  ({ country }: { country: TopCuisine }) => {
    const [
      hoveredRestaurant,
      setHoveredRestaurant,
    ] = useState<Restaurant | null>(null)
    const onHoverRestaurant = useCallback((restaurant: Restaurant) => {
      setHoveredRestaurant(restaurant)
    }, [])

    const dishElements = useMemo(() => {
      return (country.dishes || []).slice(0, 10).map((top_dish, index) => {
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
      })
    }, [country])

    const restaurantsList = useMemo(() => {
      return (
        <VStack flex={1} padding={10} spacing={10} alignItems="flex-start">
          {_.uniqBy(country.top_restaurants, (x) => x.name).map(
            (restaurant, index) => {
              return (
                <RestaurantButton
                  trending={index % 2 == 0 ? 'up' : 'down'}
                  subtle
                  key={restaurant.name}
                  restaurant={restaurant as any}
                  onHoverIn={onHoverRestaurant}
                  containerStyle={{
                    maxWidth: '100%',
                  }}
                  active={
                    (hoveredRestaurant &&
                      restaurant?.name === hoveredRestaurant?.name) ||
                    false
                  }
                />
              )
            }
          )}
        </VStack>
      )
    }, [hoveredRestaurant, country.top_restaurants])

    return (
      <VStack
        paddingVertical={15}
        className="home-top-dish"
        // onHoverIn={() => setHovered(true)}
        // onHoverOut={() => setHovered(false)}
      >
        <HStack position="relative" zIndex={10} paddingHorizontal={20}>
          <HStack flex={1}>
            {/* <RankingView rank={rank} marginLeft={-36} /> */}
            <LinkButton
              {...flatButtonStyle}
              // backgroundColor="transparent"
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
                style={{ fontSize: 20, fontWeight: '700' }}
              >
                {country.country} {country.icon}
              </Text>
            </LinkButton>
          </HStack>
          <Spacer flex />
        </HStack>

        <HomeTopDishesSide>{restaurantsList}</HomeTopDishesSide>

        {/* left shadow */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,0)',
          ]}
          startPoint={[0, 0]}
          endPoint={[1, 0]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '32%',
            zIndex: 1,
          }}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HomeTopDishMain>{dishElements}</HomeTopDishMain>
        </ScrollView>
      </VStack>
    )
  }
)

// these two do optimized updates

const HomeTopDishesSide = memo((props) => {
  const drawerWidth = useHomeDrawerWidth()
  return (
    <ZStack
      fullscreen
      paddingTop={padding + 20}
      pointerEvents="none"
      right="auto"
      maxWidth={drawerWidth * 0.25}
      zIndex={100}
      {...props}
    />
  )
})

const HomeTopDishMain = memo((props) => {
  const drawerWidth = useHomeDrawerWidth()
  return (
    <HStack
      alignItems="center"
      padding={padding}
      paddingTop={padding}
      paddingHorizontal={32}
      paddingLeft={drawerWidth * 0.25 + 30}
      spacing={spacing}
      {...props}
    />
  )
})
