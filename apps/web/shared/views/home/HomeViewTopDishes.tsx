import { Dish, Restaurant, TopDish } from '@dish/models'
import _ from 'lodash'
import React, { memo, useCallback, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Image, ScrollView, Text } from 'react-native'

import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { HomeStateItemHome, HomeStateItemSimple } from '../../state/home'
import { useOvermind } from '../../state/om'
import { LinkButton } from '../shared/Link'
import { PageTitle } from '../shared/PageTitle'
import { Spacer } from '../shared/Spacer'
import { HStack, StackBaseProps, VStack, ZStack } from '../shared/Stacks'
import { flatButtonStyle, flatButtonStyleSelected } from './baseButtonStyle'
import { lightLightBg } from './colors'
import HomeLenseBar from './HomeLenseBar'
import { RankingView } from './RankingView'
import { RatingView } from './RatingView'

export default memoIsEqualDeep(function HomeViewTopDishes({
  state,
}: {
  state: HomeStateItemHome
}) {
  return (
    <>
      <PageTitle>Dish - Uniquely Good Food</PageTitle>
      <Spacer size={20} />
      {/* <Title>{activeLense?.description ?? ''}</Title> */}
      <VStack position="relative" flex={1}>
        <HomeLenseBar backgroundGradient />
        <HomeViewTopDishesContent />
      </VStack>
    </>
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
      <VStack paddingVertical={20} paddingTop={90}>
        {results.map((country, index) => (
          <CountryTopDishesAndRestaurants
            key={country.country}
            country={country}
            rank={index + 1}
          />
        ))}
      </VStack>
    </ScrollView>
  )
})

const CountryTopDishesAndRestaurants = memo(
  ({ country, rank }: { country: TopDish; rank: number }) => {
    const [hovered, setHovered] = useState(false)
    const [hoveredRestaurant, setHoveredRestaurant] = useState<Restaurant>(null)
    const onHoverRestaurant = useCallback((restaurant: Restaurant) => {
      setHoveredRestaurant(restaurant)
    }, [])

    return (
      <VStack
        paddingVertical={5}
        paddingTop={20}
        backgroundColor={hovered ? lightLightBg : null}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        <HStack paddingHorizontal={20}>
          <HStack flex={1}>
            {/* <RankingView rank={rank} marginLeft={-36} /> */}
            <LinkButton
              {...flatButtonStyle}
              marginVertical={-8}
              name="search"
              params={{ query: country.country }}
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

const RestaurantButton = memo(
  ({
    restaurant,
    active,
    onHoverIn,
    ...props
  }: {
    active?: boolean
    restaurant: Partial<Restaurant>
  } & StackBaseProps) => {
    return (
      <LinkButton
        key={restaurant.name}
        name="restaurant"
        params={{ slug: restaurant.slug }}
        {...(active ? flatButtonStyleSelected : flatButtonStyle)}
        borderWidth={1}
        borderColor="transparent"
        fontWeight="400"
        fontSize={14}
        {...(active && {
          borderColor: '#eee',
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowRadius: 5,
        })}
        paddingRight={28}
        {...props}
        onHoverIn={() => {
          onHoverIn(restaurant)
        }}
      >
        {restaurant.name}
        <RatingView
          size="sm"
          restaurant={restaurant}
          position="absolute"
          top={-6}
          right={-16}
        />
      </LinkButton>
    )
  }
)

const DishView = memo(({ dish }: { dish: { name: string; image: string } }) => {
  return (
    <LinkButton
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 3,
      }}
      name="search"
      params={{
        query: dish.name,
      }}
      position="relative"
    >
      <ZStack fullscreen zIndex={10}>
        <RatingView
          size="sm"
          restaurant={{ rating: 4 }}
          position="absolute"
          top={-4}
          right={-12}
        />
      </ZStack>
      <VStack width={100} height={100}>
        <VStack
          className="ease-in-out"
          shadowColor="rgba(0,0,0,0.17)"
          shadowRadius={25}
          shadowOffset={{ width: 0, height: 3 }}
          width="100%"
          height="100%"
          borderRadius={28}
          overflow="hidden"
          hoverStyle={{
            shadowRadius: 35,
            shadowColor: 'rgba(0,0,0,0.35)',
            zIndex: 10000,
          }}
        >
          <Image
            source={{ uri: dish.image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </VStack>
      </VStack>
      <VStack
        marginTop={3}
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <Text
          numberOfLines={1}
          style={{
            fontWeight: '600',
            fontSize: 13,
            lineHeight: 22,
            opacity: 0.75,
            textAlign: 'center',
          }}
        >
          {dish.name}
        </Text>
      </VStack>
    </LinkButton>
  )
})
