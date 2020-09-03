import { fullyIdle, series } from '@dish/async'
import { TopCuisine, getHomeDishes } from '@dish/graph'
import {
  Divider,
  HStack,
  LoadingItems,
  SmallTitle,
  Spacer,
  Text,
  VStack,
  useDebounceEffect,
} from '@dish/ui'
import { isEqual } from '@o/fast-compare'
import _, { sortBy, uniqBy } from 'lodash'
import { default as React, Suspense, memo, useEffect, useState } from 'react'
import { ChevronRight } from 'react-feather'

import { HomeStateItemHome, HomeStateItemSearch } from '../../state/home-types'
import { NavigableTag } from '../../state/NavigableTag'
import { omStatic, useOvermind } from '../../state/om'
import { LinkButton } from '../../views/ui/LinkButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { DishView } from './DishView'
import { HomePagePaneProps } from './HomePagePaneProps'
import { HomeScrollView, HomeScrollViewHorizontal } from './HomeScrollView'
import { HomeTopSearches } from './HomeTopSearches'
import { RestaurantButton } from './RestaurantButton'
import { SlantedLinkButton } from './SlantedLinkButton'
import { TextStrong } from './TextStrong'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

// top dishes

type Props = HomePagePaneProps<HomeStateItemHome>

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
  omStatic.actions.home.addTagsToCache(tags)
}

export default memo(function HomePageHomePane(props: Props) {
  const om = useOvermind()
  const isOnHome = props.isActive
  const [isLoaded, setIsLoaded] = useState(false)
  const [topDishes, setTopDishes] = useState([])
  const state = props.item
  const { center, span } = state
  const isSmall = useMediaQueryIsSmall()

  useDebounceEffect(
    () => {
      if (props.isActive) {
        om.actions.home.setCenterToResults()
      }
    },
    100,
    [props.isActive]
  )

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
      ]

      Promise.all(
        mapAreasToSearch.map((pt) => {
          return getHomeDishes(pt[0], pt[1])
        })
      ).then((areas) => {
        console.log('got areas', areas, isMounted)
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
        om.actions.home.setTopDishes(all)
      })
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
          <HomeScrollView>
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
          </HomeScrollView>
        </VStack>
      </>
    )
  }

  return null
})

const HomeTopDishesContent = memo(({ topDishes }: { topDishes: any }) => {
  if (topDishes.length) {
    console.warn('rendering contnet more expensive', topDishes)
  }
  return (
    <>
      <HomeTopDishesTitle />
      <Spacer size="xl" />
      {!topDishes.length && (
        <>
          <LoadingItems />
          <LoadingItems />
        </>
      )}
      <Suspense fallback={null}>
        {topDishes.map((country) => (
          <React.Fragment key={country.country}>
            <TopDishesCuisineItem country={country} />
            {/* <Spacer size="sm" /> */}
          </React.Fragment>
        ))}
      </Suspense>
    </>
  )
})

const HomeTopDishesTitle = () => {
  const om = useOvermind()
  return (
    <SmallTitle divider="off">
      Uniquely good in{' '}
      <TextStrong>{om.state.home.currentState.currentLocationName}</TextStrong>
    </SmallTitle>
  )
}

const dishHeight = 140

const TopDishesCuisineItem = memo(({ country }: { country: TopCuisine }) => {
  return (
    <VStack className="home-top-dish" position="relative">
      <HStack alignItems="center" marginBottom={10}>
        <Divider flex />
        <SlantedLinkButton
          fontSize={22}
          fontWeight="300"
          marginTop={0}
          paddingHorizontal={10}
          marginBottom={0}
          marginHorizontal="auto"
          zIndex={1000}
          position="relative"
          tag={{
            type: 'country',
            name: country.country,
          }}
          hoverStyle={{
            transform: [{ scale: 1.1 }],
          }}
        >
          <Text lineHeight={22} letterSpacing={0.5}>
            {country.country}
            {country.icon ? (
              <Text marginLeft={1} fontSize={26} lineHeight={0}>
                {' '}
                {country.icon}
              </Text>
            ) : null}
          </Text>
        </SlantedLinkButton>
        <Divider flex />
      </HStack>
      <VStack
        marginTop={-25}
        pointerEvents="none"
        flex={1}
        overflow="hidden"
        position="relative"
      >
        <HomeScrollViewHorizontal style={{ paddingVertical: 10 }}>
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
        </HomeScrollViewHorizontal>
      </VStack>
    </VStack>
  )
})

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
      <VStack width={220} padding={10} spacing={4} alignItems="flex-start">
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
                restaurantSlug={restaurant.slug ?? ''}
                maxWidth="100%"
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
            )
          })}
      </VStack>
    )
  }
)

// these two do optimized updates
