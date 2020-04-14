import { Dish, Restaurant, TopDish } from '@dish/models'
import _ from 'lodash'
import React, { memo, useCallback, useState } from 'react'
import { Image, ScrollView, Text } from 'react-native'

import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { HomeStateItemHome } from '../../state/home'
import { useOvermind } from '../../state/om'
import { RoutesTable } from '../../state/router'
import { Box } from '../ui/Box'
import { HoverablePopover } from '../ui/HoverablePopover'
import { Icon } from '../ui/Icon'
import { LinkButton, LinkButtonProps } from '../ui/Link'
import { PageTitleTag } from '../ui/PageTitleTag'
import { SmallTitle, SmallerTitle } from '../ui/SmallTitle'
import { Spacer } from '../ui/Spacer'
import { HStack, StackBaseProps, VStack, ZStack } from '../ui/Stacks'
import { flatButtonStyle, flatButtonStyleSelected } from './baseButtonStyle'
import { bgLightLight } from './colors'
import HomeLenseBar from './HomeLenseBar'
import { RatingView } from './RatingView'
import { SmallButton } from './SmallButton'

export default memoIsEqualDeep(function HomePageTopDIshes({
  state,
}: {
  state: HomeStateItemHome
}) {
  return (
    <>
      <PageTitleTag>Dish - Uniquely Good Food</PageTitleTag>
      <Spacer size={18} />
      <VStack position="relative" flex={1}>
        <HomeLenseBar activeTagIds={state.activeTagIds} />
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
        🍔 {restaurant.name}
      </TrendingButton>
    )
  }
  return (
    <HStack paddingHorizontal={25}>
      <VStack width="50%" spacing="sm">
        <SmallerTitle hideDivider>Restaurants</SmallerTitle>
        <>{allRestaurants.slice(0, 4).map(getTrending)}</>
      </VStack>
      <VStack width="50%" spacing="sm">
        <SmallerTitle hideDivider>Dishes</SmallerTitle>
        <>{allRestaurants.slice(4, 8).map(getTrending)}</>
      </VStack>
    </HStack>
  )
})

const TrendingButton = <
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>({
  rank,
  children,
  ...rest
}: LinkButtonProps<Name, Params> & { rank?: number }) => {
  return (
    <HStack alignItems="center">
      {rank ? <Text>`${rank}. `</Text> : null}
      <Icon
        marginTop={2}
        marginRight={4}
        name="chevron-down"
        size={14}
        color="red"
      />
      <LinkButton
        {...flatButtonStyle}
        // backgroundColor="transparent"
        margin={2}
        flexDirection="row"
        alignItems="center"
        ellipse
        {...rest}
      >
        <Text style={{ fontWeight: '600', lineHeight: 17 }}>{children}</Text>
      </LinkButton>
    </HStack>
  )
}

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
      <VStack paddingVertical={20} paddingTop={95} spacing>
        <SmallTitle
          after={
            <HoverablePopover
              position="right"
              contents={
                <Box>
                  {[
                    'All',
                    'Asia',
                    'Americas',
                    'Europe',
                    'Mid-East',
                    'Africa',
                  ].map((tag) => (
                    <SmallButton isActive={tag === 'All'} key={tag}>
                      {tag}
                    </SmallButton>
                  ))}
                </Box>
              }
            >
              <VStack pointerEvents="auto">
                <Text></Text>
              </VStack>
            </HoverablePopover>
          }
        >
          {om.state.home.lastActiveTags.find((x) => x.type === 'lense')
            ?.description ?? ''}{' '}
          in {om.state.home.location?.name ?? 'San Francisco'}
        </SmallTitle>

        <HomeViewTopDishesTrending />

        <>
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
        </>
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
              name="search"
              params={{ country: country.country }}
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
        dish: dish.name,
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
