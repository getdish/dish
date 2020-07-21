import { fullyIdle, series } from '@dish/async'
import { Restaurant, TopCuisine } from '@dish/graph'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  LoadingItems,
  SmallTitle,
  Spacer,
  Text,
  VStack,
  useDebounce,
} from '@dish/ui'
import _, { clamp } from 'lodash'
import {
  default as React,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ChevronRight } from 'react-feather'
import { useStorageState } from 'react-storage-hooks'

import { bgLight } from '../../colors'
import { HomeStateItemHome } from '../../state/home'
import { getActiveTags } from '../../state/home-tag-helpers'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { NotFoundPage } from '../../views/NotFoundPage'
import { Link } from '../../views/ui/Link'
import { LinkButton } from '../../views/ui/LinkButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { flatButtonStyle } from './baseButtonStyle'
import { CloseButton } from './CloseButton'
import { DishView } from './DishView'
import { HomeLenseBar } from './HomeLenseBar'
import { HomePagePaneProps } from './HomePage'
import { HomeScrollView, HomeScrollViewHorizontal } from './HomeScrollView'
import { RestaurantButton } from './RestaurantButton'
import { Squircle } from './Squircle'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

// top dishes

type Props = HomePagePaneProps<HomeStateItemHome>

export default memo(function HomePageHomePane(props: Props) {
  const om = useOvermind()
  const isOnHome = props.isActive
  const [isLoaded, setIsLoaded] = useState(false)
  const lastTopDishesLoad = useRef('')
  const loadTopDishesDelayed = useDebounce(om.actions.home.loadHomeDishes, 200)

  useEffect(() => {
    if (props.isActive) {
      const key = JSON.stringify(props.item.center)
      if (lastTopDishesLoad.current === key) return
      if (lastTopDishesLoad.current === '') {
        om.actions.home.loadHomeDishes()
      } else {
        loadTopDishesDelayed()
      }
      lastTopDishesLoad.current = key
    }
  }, [props.item.center, props.isActive, lastTopDishesLoad])

  // on load home clear search effect!
  useEffect(() => {
    // not on first load
    if (props.isActive && isLoaded) {
      console.log('should clear search and tags')
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
        fullyIdle,
        () => {
          setIsLoaded(true)
        },
      ])
    }
  }, [isOnHome])

  if (isOnHome || isLoaded) {
    return <HomePageTopDishes {...props} />
  }

  return null
})

const HomePageTopDishes = memo((props: Props) => {
  const isSmall = useMediaQueryIsSmall()
  const state = props.item as HomeStateItemHome
  const { currentLocationName, activeTagIds } = state

  if (!state) {
    return <NotFoundPage title="Home not found" />
  }

  console.warn('HomePageTopDishes.render')
  // console.warn('HomePageTopDishes.render', JSON.stringify(state, null, 2))

  const tagsDescription =
    getActiveTags(omStatic.state.home, state)
      .find((x) => x.type === 'lense')
      // @ts-ignore
      ?.descriptions?.plain.replace('Here', ``) ?? ''

  return (
    <>
      <PageTitleTag>Dish - Uniquely Good Food</PageTitleTag>
      <VStack position="relative" flex={1} maxHeight="100%" overflow="visible">
        {isSmall && (
          <HStack
            alignItems="center"
            justifyContent="center"
            top={-10}
            zIndex={1000}
            position="absolute"
            left={0}
            right={0}
          >
            <HomeLenseBar size="lg" activeTagIds={activeTagIds} />
          </HStack>
        )}

        <HomeScrollView>
          <VStack
            paddingTop={isSmall ? 34 : 34}
            paddingBottom={34}
            spacing="xl"
          >
            {/* LENSES - UNIQUELY GOOD HERE */}
            <VStack>
              <VStack alignItems="center">
                {!isSmall && (
                  <>
                    <HStack
                      width="100%"
                      alignItems="center"
                      justifyContent="center"
                      paddingHorizontal={20}
                      spacing={20}
                    >
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

                      <HStack alignItems="center" justifyContent="center">
                        <HomeLenseBar size="xl" activeTagIds={activeTagIds} />
                      </HStack>
                    </HStack>
                    <Spacer size="xl" />
                  </>
                )}

                <Spacer size={15} />

                <HomeIntroLetter />

                <SmallTitle fontWeight="300" letterSpacing={0} divider="center">
                  {currentLocationName
                    ? `What's good in ${currentLocationName}`
                    : `What's good here`}
                </SmallTitle>

                {/* <HomeFilterBar activeTagIds={activeTagIds} /> */}
                {isSmall && <Spacer size={20} />}
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
        position="relative"
      >
        <HStack position="absolute" top={10} right={10}>
          <CloseButton onPress={() => setShowIntro(false)} />
        </HStack>
        <Spacer size="sm" />
        <Text fontSize={16} lineHeight={22} opacity={0.8}>
          Welcome to beta, please send any bugs to bugs@dishapp.com
        </Text>
        <Spacer size="sm" />
        {/* <Text fontSize={14} lineHeight={20} opacity={0.8}>
          <strong>Beta</strong>. Report using the (?) on the
          bottom right.
        </Text> */}
        {/* <Spacer size="lg" />
        <HStack justifyContent="center">
          <SmallButton textStyle={{ fontSize: 13 }}>More</SmallButton>
        </HStack> */}
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
            fontSize={20}
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
      paddingTop={10}
      paddingHorizontal={30}
      paddingLeft={sideWidth}
      paddingBottom={padding}
      spacing={spacing}
      {...props}
    />
  )
})
