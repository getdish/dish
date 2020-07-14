import { fullyIdle, series } from '@dish/async'
import { Restaurant, TopCuisine } from '@dish/graph'
import {
  AbsoluteVStack,
  HStack,
  HorizontalLine,
  LinearGradient,
  LoadingItems,
  SmallTitle,
  Spacer,
  StackProps,
  Text,
  VStack,
} from '@dish/ui'
import _, { clamp } from 'lodash'
import {
  default as React,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { ChevronDown, ChevronRight, ChevronUp, Minus } from 'react-feather'
import { useStorageState } from 'react-storage-hooks'

import { bgLight } from '../../colors'
import { getActiveTags } from '../../state/home-tag-helpers'
import { useOvermind } from '../../state/useOvermind'
import { NotFoundPage } from '../../views/NotFoundPage'
import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { SmallButton } from '../../views/ui/SmallButton'
import { flatButtonStyle, flatButtonStyleSelected } from './baseButtonStyle'
import { CloseButton } from './CloseButton'
import { DishView } from './DishView'
import { HomeLenseBar } from './HomeLenseBar'
import { HomePagePaneProps } from './HomePage'
import { HomeScrollView, HomeScrollViewHorizontal } from './HomeScrollView'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import RestaurantRatingView from './RestaurantRatingView'
import { Squircle } from './Squircle'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

// top dishes

export default memo(function HomePageHomePane(props: HomePagePaneProps) {
  const om = useOvermind()
  const isOnHome = om.state.home.currentStateType === 'home'
  const [isLoaded, setIsLoaded] = useState(false)

  // on load home clear search effect!
  useLayoutEffect(() => {
    // not on first load
    if (props.isActive && isLoaded) {
      om.actions.home.clearSearch()
      om.actions.home.clearTags()
    }
  }, [props.isActive])

  // load effect!
  useEffect(() => {
    if (isOnHome) {
      setIsLoaded(true)
    } else {
      return series([
        () =>
          fullyIdle({
            min: 1000 * 2,
            max: 1000 * 10,
          }),
        () => {
          setIsLoaded(true)
        },
      ])
    }
  }, [isOnHome])

  if (isOnHome || isLoaded) {
    return <HomePageTopDishes />
  }

  return null
})

const HomePageTopDishes = memo(() => {
  const isSmall = useMediaQueryIsSmall()
  const om = useOvermind()
  const state = om.state.home.lastHomeState
  const { activeTagIds } = state

  if (!state) {
    return <NotFoundPage title="Home not found" />
  }

  console.warn('HomePageTopDishes.render')

  const tagsDescription =
    getActiveTags(om.state.home, state)
      .find((x) => x.type === 'lense')
      // @ts-ignore
      ?.descriptions?.plain.replace('Here', ``) ?? ''

  const locationName = om.state.home.currentState.currentLocationName

  return (
    <>
      <PageTitleTag>Dish - Uniquely Good Food</PageTitleTag>
      <VStack position="relative" flex={1} overflow="hidden">
        <HomeScrollView>
          <VStack paddingTop={34} paddingBottom={34} spacing="xl">
            {/* LENSES - UNIQUELY GOOD HERE */}
            <VStack>
              <VStack alignItems="center">
                <HStack
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  paddingHorizontal={20}
                  spacing={20}
                >
                  {!isSmall && (
                    <AbsoluteVStack
                      position="absolute"
                      top={0}
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
                    </AbsoluteVStack>
                  )}
                  <HorizontalLine />

                  <HStack alignItems="center" justifyContent="center">
                    <HomeLenseBar size="lg" activeTagIds={activeTagIds} />
                  </HStack>
                  <HorizontalLine />
                </HStack>

                <Spacer size={40} />

                <HomeIntroLetter />

                <SmallTitle fontWeight="300" letterSpacing={0} divider="center">
                  {locationName ? `What's good in ${locationName}` : ' '}
                </SmallTitle>

                {/* <HomeFilterBar activeTagIds={activeTagIds} /> */}
                {isSmall && <Spacer size={40} />}
              </VStack>

              <HomeTopDishesContent />
            </VStack>
          </VStack>
        </HomeScrollView>
      </VStack>
    </>
  )
})

const HomeIntroLetter = memo(() => {
  const [showInto, setShowIntro] = useStorageState(
    localStorage,
    'showIntro',
    true
  )

  if (!showInto) {
    return null
  }

  return (
    <VStack alignItems="center" justifyContent="center">
      <VStack
        borderColor={bgLight}
        borderWidth={2}
        borderRadius={10}
        maxWidth="75%"
        margin="auto"
        padding={20}
      >
        <HStack>
          <Text fontSize={18} fontWeight="600">
            Welcome to Dish!
          </Text>
          <Spacer flex={1} />
          <CloseButton onPress={() => setShowIntro(false)} />
        </HStack>
        <Spacer size="sm" />
        <Text fontSize={16} lineHeight={22} opacity={0.8}>
          It's not easy to find the Pho, Tacos, and other dishes in your city –
          other food rating apps mix ratings for everything into one big score.
          Dish is a food review aggregator that uses novel analysis to figure
          out which dishes are actually the best.
        </Text>
        <Spacer size="sm" />
        <Text fontSize={14} lineHeight={20} opacity={0.8}>
          We want to build a fun community where you can explore the world of
          food, find unique popups, amazing insider tips, and track all your
          food advertures.
        </Text>
        <Spacer size="sm" />
        <Text fontSize={14} lineHeight={20} opacity={0.8}>
          <strong>Beta</strong>... watch for bugs! Report using the (?) on the
          bottom right.
        </Text>
        <Spacer size="lg" />
        <HStack justifyContent="center">
          <SmallButton textStyle={{ fontSize: 16 }}>
            Learn how dish breaks down data &nbsp; ➡️
          </SmallButton>
        </HStack>
      </VStack>
      <Spacer size={30} />
    </VStack>
  )
})

const HomeTopDishesContent = memo(() => {
  const om = useOvermind()
  const { topDishes } = om.state.home

  return useMemo(() => {
    console.warn('rendering contnet more expensive', topDishes)
    return (
      <>
        {!topDishes.length && <LoadingItems />}
        {topDishes.map((country) => (
          <TopDishesCuisineItem key={country.country} country={country} />
        ))}
      </>
    )
  }, [topDishes])
})

const dishHeight = 180
const padding = 30
const spacing = 16
const pctRestaurant = 0.23

const useHomeSideWidth = () => {
  const drawerWidth = useHomeDrawerWidth()
  const min = 180
  const max = 240
  return clamp(drawerWidth * pctRestaurant + 10, min, max)
}

const TopDishesCuisineItem = memo(({ country }: { country: TopCuisine }) => {
  return (
    <VStack
      paddingVertical={5}
      paddingLeft={18}
      className="home-top-dish"
      position="relative"
    >
      <HStack position="relative" zIndex={10}>
        <LinkButton
          {...flatButtonStyle}
          style={{
            transform: [{ rotate: '-2.5deg' }],
          }}
          tag={{
            type: 'country',
            name: country.country,
          }}
        >
          <Text
            ellipse
            fontSize={24}
            fontWeight={'400'}
            height={24}
            lineHeight={24}
          >
            {country.country}{' '}
            {country.icon ? (
              <Text marginLeft={3} fontSize="120%">
                {country.icon}
              </Text>
            ) : null}
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
          width: `${pctRestaurant * 100 - 1}%`,
          zIndex: 1,
        }}
      />

      <VStack marginTop={-5}>
        <HomeScrollViewHorizontal>
          <HomeTopDishMain>
            {(country.dishes || []).slice(0, 12).map((top_dish, index) => {
              return (
                <DishView
                  size={dishHeight}
                  key={index}
                  dish={{
                    ...top_dish,
                    rating: (top_dish.rating ?? 0) / 5,
                  }}
                  cuisine={{
                    id: country.country,
                    name: country.country,
                    type: 'country',
                  }}
                />
              )
            })}

            <Squircle width={dishHeight * 0.8} height={dishHeight}>
              <ChevronRight size={40} color="black" />
            </Squircle>
          </HomeTopDishMain>
        </HomeScrollViewHorizontal>
      </VStack>
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
      <VStack flex={1} padding={10} spacing={6} alignItems="flex-start">
        {_.uniqBy(country.top_restaurants, (x) => x.name)
          .slice(0, 5)
          .map((restaurant, index) => {
            return (
              <RestaurantButton
                trending={
                  (index % 5) - 1 == 0
                    ? 'neutral'
                    : index % 2 == 0
                    ? 'up'
                    : 'down'
                }
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
  const sideWidth = useHomeSideWidth()
  return (
    <AbsoluteVStack
      fullscreen
      paddingTop={padding + 10}
      pointerEvents="none"
      right="auto"
      maxWidth={sideWidth}
      zIndex={100}
      {...props}
    />
  )
})

const HomeTopDishMain = memo((props) => {
  const sideWidth = useHomeSideWidth()
  return (
    <HStack
      alignItems="center"
      padding={padding}
      paddingTop={5}
      paddingHorizontal={30}
      paddingLeft={sideWidth}
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
    trending?: 'up' | 'down' | 'neutral'
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
        <HStack flex={1} alignItems="center" spacing={5}>
          {!!trending && (
            <TrendingIcon
              size={16}
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
  color = trending === 'up' ? 'green' : '#ff559999',
  size,
  ...rest
}: StackProps & {
  color?: string
  size?: number
  trending?: 'up' | 'down' | 'neutral'
}) => {
  const Icon =
    trending == 'neutral' ? Minus : trending === 'up' ? ChevronUp : ChevronDown
  return (
    <VStack {...rest}>
      <Icon color={color} size={size} />
    </VStack>
  )
}
