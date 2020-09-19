import { fullyIdle, series, sleep } from '@dish/async'
import { TopCuisine, getHomeDishes } from '@dish/graph'
import { ChevronRight } from '@dish/react-feather'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  LoadingItems,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import _, { sortBy, uniqBy } from 'lodash'
import { default as React, Suspense, memo, useEffect, useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'

import {
  bgLight,
  bgLightHover,
  bgLightLight,
  bgLightTranslucent,
  lightBlue,
} from '../../colors'
import { useIsNarrow } from '../../hooks/useIs'
import { addTagsToCache } from '../../state/allTags'
import { HomeStateItemHome } from '../../state/home-types'
import { NavigableTag } from '../../state/NavigableTag'
import { useOvermind } from '../../state/om'
import { omStatic } from '../../state/omStatic'
import {
  ContentScrollView,
  ContentScrollViewHorizontal,
} from '../../views/ContentScrollView'
import { DishView } from '../../views/dish/DishView'
import { PageFooter } from '../../views/layout/PageFooter'
import { SlantedLinkButton } from '../../views/SlantedLinkButton'
import { LinkButton } from '../../views/ui/LinkButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { RestaurantButton } from '../restaurant/RestaurantButton'
import { StackViewProps } from '../StackViewProps'
import { HomeTopSearches } from './HomeTopSearches'

// top dishes

type Props = StackViewProps<HomeStateItemHome>

function updateHomeTagsCache(all: any) {
  let tags: NavigableTag[] = []
  // update tags
  for (const topDishes of all) {
    tags.push({
      id: `${topDishes.country}`,
      name: topDishes.country,
      type: 'country',
      icon: topDishes.icon,
    })
    tags = [
      ...tags,
      ...(topDishes.dishes ?? []).map((dish) => ({
        id: dish.name ?? '',
        name: dish.name ?? '',
        type: 'dish',
      })),
    ]
  }
  addTagsToCache(tags)
}

export default memo(function HomePage(props: Props) {
  const om = useOvermind()
  const isOnHome = props.isActive
  const [isLoaded, setIsLoaded] = useState(false)
  const [topDishes, setTopDishes] = useState([])
  const state = props.item
  const { center, span } = state
  const isSmall = useIsNarrow()

  useEffect(() => {
    if (!isLoaded || !props.isActive) return

    let isMounted = true

    runHomeSearch(props.item)

    function runHomeSearch({ center, span }: Partial<HomeStateItemHome>) {
      om.actions.home.setIsLoading(true)
      om.actions.home.updateCurrentMapAreaInformation()

      const mapAreasToSearch = [
        [center.lng, center.lat],
        [center.lng - span.lng, center.lat - span.lat],
        [center.lng - span.lng, center.lat + span.lat],
        [center.lng + span.lng, center.lat - span.lat],
        [center.lng + span.lng, center.lat + span.lat],
      ] as const

      sleep(topDishes.length ? 1000 : 0).then(() => {
        if (!isMounted) return
        fetchNewHome()
      })

      setTimeout(() => {
        getHomeDishes(...mapAreasToSearch[0])
      }, 1000)

      function fetchNewHome() {
        Promise.all(
          mapAreasToSearch.map((pt) => {
            return getHomeDishes(pt[0], pt[1])
          })
        )
          .then((areas) => {
            if (!isMounted) return
            om.actions.home.setIsLoading(false)
            let all: TopCuisine[] = []
            for (const area of areas) {
              for (const cuisine of area) {
                const existing = all.find((x) => x.country === cuisine.country)
                if (existing) {
                  const allTopRestaurants = [
                    ...existing.top_restaurants,
                    ...cuisine.top_restaurants,
                  ]
                  const sortedTopRestaurants = sortBy(
                    allTopRestaurants,
                    (x) => -(x.rating ?? 0)
                  )
                  existing.top_restaurants = uniqBy(
                    sortedTopRestaurants,
                    (x) => x.id
                  ).slice(0, 5)
                } else {
                  all.push(cuisine)
                }
              }
            }
            all = sortBy(all, (x) => -x.avg_rating)
            updateHomeTagsCache(all)
            setTopDishes(all)
            om.actions.home.updateCurrentState({
              results: _.flatten(all.map((x) => x.top_restaurants))
                .filter((x) => x?.id)
                .map((x) => ({ id: x.id, slug: x.slug })),
            })
          })
          .catch((err) => {
            console.error('error fetching home', err)
          })
      }
    }

    const dispose = om.reaction((state) => {
      const curState = state.home.allStates[props.item.id]
      return {
        center: curState.mapAt?.center ?? curState.center,
        span: curState.mapAt?.span ?? curState.span,
      }
    }, runHomeSearch)

    return () => {
      om.actions.home.setIsLoading(false)
      dispose()
      isMounted = false
    }
  }, [props.isActive, isLoaded, JSON.stringify({ center, span })])

  // on load home clear search effect!
  useEffect(() => {
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
        fullyIdle,
        () => {
          setIsLoaded(true)
        },
      ])
    }
  }, [isOnHome])

  if (isOnHome || isLoaded) {
    return (
      <>
        <PageTitleTag>Dish - Uniquely Good Food</PageTitleTag>
        <VStack
          position="relative"
          flex={1}
          maxHeight="100%"
          overflow="visible"
          maxWidth="100%"
          height="100%"
        >
          <ContentScrollView>
            {/* cross line */}
            <AbsoluteVStack
              height={400}
              width={2000}
              right="-10%"
              top={-100}
              transform={[{ rotate: '-4deg' }]}
            >
              <LinearGradient
                style={[StyleSheet.absoluteFill]}
                colors={[bgLightHover, '#fff']}
              />
            </AbsoluteVStack>
            <VStack
              flex={1}
              overflow="hidden"
              maxWidth="100%"
              paddingTop={isSmall ? 20 : 28}
              spacing="xl"
            >
              <VStack>
                <HomeTopSearches />

                <Spacer size="xs" />

                <Suspense fallback={null}>
                  <HomeTopDishesContent topDishes={topDishes} />
                </Suspense>
              </VStack>
            </VStack>
          </ContentScrollView>
        </VStack>
      </>
    )
  }

  return null
})

const HomeTopDishesContent = memo(({ topDishes }: { topDishes: any }) => {
  return (
    <>
      <HomeTopDishesTitle />
      <Spacer size="xl" />

      <VStack minHeight={Dimensions.get('window').height * 0.95}>
        {!topDishes.length && (
          <>
            <LoadingItems />
            <LoadingItems />
          </>
        )}
        <Suspense fallback={null}>
          {topDishes.map((country, index) => (
            <React.Fragment key={country.country}>
              <TopDishesCuisineItem index={index} country={country} />
            </React.Fragment>
          ))}
        </Suspense>
      </VStack>

      {/* pad bottom */}
      <VStack height={100} />

      <PageFooter />
    </>
  )
})

const HomeTopDishesTitle = () => {
  const om = useOvermind()
  const info = om.state.home.currentState.currentLocationInfo
  return (
    <Text
      color="rgba(0,0,0,0.5)"
      marginVertical={5}
      paddingHorizontal={10}
      paddingVertical={4}
      fontWeight="300"
      borderRadius={100}
      // backgroundColor={bgLight}
      alignSelf="center"
      fontSize={18}
    >
      Uniquely good{' '}
      {!info || info.type === 'city' || info.type === 'country' ? 'in' : 'near'}{' '}
      <Text color="#000" fontWeight="600">
        {om.state.home.currentState.currentLocationName}
      </Text>
    </Text>
  )
}

const dishHeight = 140

const TopDishesCuisineItem = memo(
  ({ country, index }: { index: number; country: TopCuisine }) => {
    return (
      <VStack className="home-top-dish" position="relative">
        {index % 2 !== 0 && (
          <AbsoluteVStack
            top={-15}
            left={-100}
            right={-100}
            bottom={-15}
            backgroundColor={bgLightTranslucent}
            transform={[{ rotate: '-4deg' }]}
          >
            <LinearGradient
              colors={[bgLightTranslucent, '#fff']}
              startPoint={[1, 0]}
              endPoint={[0, 0]}
              style={StyleSheet.absoluteFill}
            />
          </AbsoluteVStack>
        )}
        <HStack
          // backgroundColor={lightBlue}
          justifyContent="center"
          alignItems="center"
          marginBottom={10}
        >
          <SlantedLinkButton
            padding={100}
            marginHorizontal="auto"
            zIndex={1000}
            position="relative"
            alignSelf="center"
            tag={{
              type: 'country',
              name: country.country,
            }}
            hoverStyle={{
              transform: [{ scale: 1.1 }, { rotate: '-6deg' }],
            }}
          >
            <Text
              fontSize={18}
              lineHeight={22}
              fontWeight="600"
              paddingRight={country.icon ? 32 : 0}
            >
              {country.country}
              {country.icon ? (
                <Text
                  position="absolute"
                  top={14}
                  right={4}
                  marginLeft={1}
                  marginTop={2}
                  fontSize={26}
                  lineHeight={0}
                >
                  {' '}
                  {country.icon}
                </Text>
              ) : null}
            </Text>
          </SlantedLinkButton>
          {/* <Divider flex /> */}
        </HStack>
        <VStack
          marginTop={-20}
          pointerEvents="none"
          flex={1}
          overflow="hidden"
          position="relative"
        >
          <ContentScrollViewHorizontal style={{ paddingVertical: 10 }}>
            <HStack
              alignItems="center"
              spacing={10}
              paddingVertical={18}
              paddingRight={20}
            >
              <TopDishesTrendingRestaurants country={country} />

              {(country.dishes || []).slice(0, 12).map((top_dish, index) => {
                // console.log(
                //   'top_dish.best_restaurants',
                //   top_dish.best_restaurants
                // )
                return (
                  <HStack
                    transform={[{ translateY: index % 2 == 0 ? -5 : 5 }]}
                    hoverStyle={{
                      zIndex: 1000,
                    }}
                    key={index}
                  >
                    <DishView
                      size={dishHeight}
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

                    {/* Shows top restaurants per-dish */}
                    {/* <VStack>
                    {top_dish.best_restaurants?.map((restaurant) => {
                      if (!restaurant.slug) {
                        return null
                      }
                      return (
                        <VStack key={restaurant.slug}>
                          <RestaurantButton
                            restaurantSlug={restaurant.slug}
                            subtle
                            onHoverIn={() => {
                              // lastHoveredId = restaurant.id
                              // setHoveredRestaurant({
                              //   id: restaurant.id,
                              //   slug: restaurant.slug,
                              // })
                            }}
                          />
                        </VStack>
                      )
                    })}
                  </VStack> */}
                  </HStack>
                )
              })}
              <LinkButton
                className="see-through"
                width={dishHeight * 0.8}
                height={dishHeight}
                tag={{ type: 'country', name: country.country ?? '' }}
              >
                <ChevronRight size={40} color="black" />
              </LinkButton>
            </HStack>
          </ContentScrollViewHorizontal>
        </VStack>
      </VStack>
    )
  }
)

let lastHoveredId
const clearHoveredRestaurant = _.debounce(() => {
  const hovered = omStatic.state.home.hoveredRestaurant
  if (hovered && hovered.id == lastHoveredId) {
    omStatic.actions.home.setHoveredRestaurant(false)
  }
}, 200)

const setHoveredRestaurant = _.debounce((val) => {
  omStatic.actions.home.setHoveredRestaurant(val)
}, 200)

const TopDishesTrendingRestaurants = memo(
  ({ country }: { country: TopCuisine }) => {
    return (
      <VStack width={200} padding={10} spacing={4} alignItems="flex-start">
        {_.uniqBy(country.top_restaurants, (x) => x.name)
          .slice(0, 5)
          .map((restaurant, index) => {
            return (
              <HStack key={restaurant.name} maxWidth="100%">
                <RestaurantButton
                  trending={
                    (index % 5) - 1 == 0
                      ? 'neutral'
                      : index % 2 == 0
                      ? 'up'
                      : 'down'
                  }
                  subtle
                  restaurantSlug={restaurant.slug ?? ''}
                  maxWidth={100}
                  onHoverIn={() => {
                    lastHoveredId = restaurant.id
                    setHoveredRestaurant({
                      id: restaurant.id,
                      slug: restaurant.slug,
                    })
                  }}
                  // onHoverOut={() => {
                  //   clearHoveredRestaurant()
                  // }}
                  // active={
                  //   (hoveredRestaurant &&
                  //     restaurant?.name === hoveredRestaurant?.name) ||
                  //   false
                  // }
                />
              </HStack>
            )
          })}
      </VStack>
    )
  }
)

// these two do optimized updates
