import { versions } from 'process'

import { Restaurant, TopCuisine } from '@dish/graph'
import {
  HStack,
  HorizontalLine,
  LinearGradient,
  LoadingItems,
  StackProps,
  Text,
  VStack,
  ZStack,
} from '@dish/ui'
import _, { size } from 'lodash'
import {
  default as React,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ChevronDown, ChevronRight, ChevronUp, Plus } from 'react-feather'
import { ViewStyle } from 'react-native'

import { HomeStateItemHome } from '../../state/home'
import { getActiveTags } from '../../state/home-tag-helpers'
import { useOvermind } from '../../state/useOvermind'
import { NotFoundPage } from '../NotFoundPage'
import { LinkButton } from '../ui/LinkButton'
import { LinkButtonProps } from '../ui/LinkProps'
import { PageTitleTag } from '../ui/PageTitleTag'
import { flatButtonStyle, flatButtonStyleSelected } from './baseButtonStyle'
import { DishView } from './DishView'
import HomeFilterBar from './HomeFilterBar'
import { HomeLenseBarOnly } from './HomeLenseBar'
import { HomeScrollView, HomeScrollViewHorizontal } from './HomeScrollView'
import RestaurantRatingView from './RestaurantRatingView'
import { Squircle } from './Squircle'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

type TopDishesProps = {
  state: HomeStateItemHome
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

const HomePageTopDishes = memo(({ state }: TopDishesProps) => {
  const om = useOvermind()

  if (!state) {
    return <NotFoundPage title="Home not found" />
  }

  const tagsDescription =
    getActiveTags(om.state.home, state)
      .find((x) => x.type === 'lense')
      ?.descriptions?.plain.replace('Here', ``) ?? ''

  return (
    <>
      <PageTitleTag>Dish - Uniquely Good Food</PageTitleTag>
      <VStack position="relative" flex={1} overflow="hidden">
        <HomeScrollView>
          <VStack paddingTop={28} paddingBottom={34} spacing="xl">
            {/* TRENDING */}
            {/* <HomeViewTopDishesTrending /> */}

            {/* LENSES - UNIQUELY GOOD HERE */}
            <VStack spacing="md">
              <VStack spacing alignItems="center">
                <HStack
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  paddingHorizontal={20}
                  spacing={20}
                >
                  <ZStack
                    position="absolute"
                    top={10}
                    left="0%"
                    width="36%"
                    zIndex={1000}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <LinkButton
                      paddingVertical={5}
                      paddingHorizontal={6}
                      fontSize={15}
                      shadowColor={'rgba(0,0,0,0.1)'}
                      shadowRadius={8}
                      shadowOffset={{ height: 2, width: 0 }}
                      backgroundColor="#fff"
                      borderRadius={8}
                      fontWeight="600"
                      transform={[{ rotate: '-4deg' }]}
                    >
                      {tagsDescription}
                    </LinkButton>
                  </ZStack>
                  <HorizontalLine />
                  <HomeLenseBarOnly
                    size="lg"
                    activeTagIds={state.activeTagIds}
                  />
                  <HorizontalLine />
                </HStack>
                <HomeFilterBar activeTagIds={state.activeTagIds} />
              </VStack>

              <HomeTopDishesContent />
            </VStack>
          </VStack>
        </HomeScrollView>
      </VStack>
    </>
  )
})

const HomeTopDishesContent = memo(() => {
  const om = useOvermind()
  const { topDishes } = om.state.home
  const results = topDishes
  console.warn('HomeTopDishesContent.render')
  return (
    <>
      {!results.length && <LoadingItems />}
      {results.map((country) => (
        <TopDishesCuisineItem key={country.country} country={country} />
      ))}
    </>
  )
})

const dishHeight = 140
const padding = 30
const spacing = 6
const pctRestaurant = 0.3

const TopDishesCuisineItem = memo(({ country }: { country: TopCuisine }) => {
  return (
    <VStack
      paddingVertical={5}
      className="home-top-dish"
      position="relative"
      // onHoverIn={() => setHovered(true)}
      // onHoverOut={() => setHovered(false)}
    >
      <HStack position="relative" zIndex={10} paddingHorizontal={20}>
        {/* <RankingView rank={rank} marginLeft={-36} /> */}
        <LinkButton
          {...flatButtonStyle}
          paddingVertical={4}
          marginBottom={-10}
          style={{
            transform: [{ rotate: '-2deg' }],
          }}
          tag={{
            type: 'country',
            name: country.country,
          }}
        >
          <Text ellipse fontSize={18} fontWeight={'700'}>
            {country.country} {country.icon}
          </Text>
        </LinkButton>
      </HStack>

      <HomeTopDishesSide>
        <TopDishesRestaurantsSide country={country} />
      </HomeTopDishesSide>
      {/* left shadow */}
      <LinearGradient
        colors={[
          'rgba(255,255,255,1)',
          'rgba(255,255,255,1)',
          'rgba(255,255,255,0)',
        ]}
        startPoint={[0, 0]}
        endPoint={[1, 0]}
        style={{
          position: 'absolute',
          // @ts-ignore
          pointerEvents: 'none',
          top: 0,
          left: 0,
          bottom: 0,
          width: `${pctRestaurant * 100 + 4}%`,
          zIndex: 1,
        }}
      />

      <HomeScrollViewHorizontal>
        <HomeTopDishMain>
          {(country.dishes || []).slice(0, 12).map((top_dish, index) => {
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

          <Squircle size={dishHeight}>
            <ChevronRight size={40} color="black" />
          </Squircle>
        </HomeTopDishMain>
      </HomeScrollViewHorizontal>
    </VStack>
  )
})

const TopDishesRestaurantsSide = memo(
  ({ country }: { country: TopCuisine }) => {
    const [
      hoveredRestaurant,
      setHoveredRestaurant,
    ] = useState<Restaurant | null>(country.top_restaurants?.[0] ?? null)
    const onHoverRestaurant = useCallback((restaurant: Restaurant) => {
      setHoveredRestaurant(restaurant)
    }, [])

    return (
      <VStack flex={1} padding={10} spacing={4} alignItems="flex-start">
        {_.uniqBy(country.top_restaurants, (x) => x.name)
          .slice(0, 5)
          .map((restaurant, index) => {
            return (
              <RestaurantButton
                trending={index % 2 == 0 ? 'up' : 'down'}
                subtle
                key={restaurant.name}
                restaurant={restaurant as any}
                onHoverIn={onHoverRestaurant}
                maxWidth="100%"
                active={
                  (hoveredRestaurant &&
                    restaurant?.name === hoveredRestaurant?.name) ||
                  false
                }
              />
            )
          })}
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
      paddingTop={padding + 4}
      pointerEvents="none"
      right="auto"
      maxWidth={drawerWidth * pctRestaurant + 10}
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
      paddingHorizontal={30}
      paddingLeft={drawerWidth * pctRestaurant + 30}
      spacing={spacing}
      {...props}
    />
  )
})

export const RestaurantButton = memo(
  ({
    restaurant,
    active,
    zIndex,
    rank,
    trending,
    subtle,
    onHoverIn,
    ...props
  }: {
    active?: boolean
    rank?: number
    restaurant: Partial<Restaurant>
    trending?: 'up' | 'down'
    subtle?: boolean
  } & LinkButtonProps) => {
    return (
      <LinkButton
        key={restaurant.name}
        pointerEvents="auto"
        {...(active ? flatButtonStyleSelected : flatButtonStyle)}
        {...(subtle && {
          backgroundColor: 'transparent',
        })}
        fontSize={14}
        zIndex={1}
        {...(active && {
          borderColor: '#eee',
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowRadius: 5,
          zIndex: 2,
        })}
        paddingRight={34}
        {...props}
        name="restaurant"
        params={{ slug: restaurant.slug }}
        onHoverIn={() => {
          onHoverIn?.(restaurant)
        }}
      >
        <HStack alignItems="center" spacing={5}>
          {!!trending && (
            <TrendingIcon
              size={22}
              trending={trending}
              marginTop={-4}
              marginBottom={-4}
            />
          )}
          <Text
            ellipse
            fontSize={14}
            fontWeight={active ? '500' : '300'}
            color={active ? '#000' : '#666'}
          >
            {typeof rank === 'number' ? `${rank}. ` : ''}
            {restaurant.name}
          </Text>
          <RestaurantRatingView
            size="xs"
            restaurantSlug={restaurant.slug ?? ''}
            rating={restaurant.rating}
            // @ts-ignore
            position="absolute"
            top={0}
            right={-35}
            subtle={subtle}
          />
        </HStack>
      </LinkButton>
    )
  }
)

const TrendingIcon = ({
  trending,
  color = trending === 'up' ? 'green' : 'red',
  size,
  ...rest
}: StackProps & {
  color?: string
  size?: number
  trending?: 'up' | 'down'
}) => {
  const Icon = trending === 'up' ? ChevronUp : ChevronDown
  return (
    <VStack {...rest}>
      <Icon color={color} size={size} />
    </VStack>
  )
}
