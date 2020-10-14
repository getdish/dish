import { fullyIdle, series, sleep } from '@dish/async'
import {
  SEARCH_DOMAIN,
  TopCuisine,
  getHomeDishes,
  graphql,
  order_by,
  query,
} from '@dish/graph'
import { ChevronRight } from '@dish/react-feather'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  LoadingItems,
  LoadingItemsSmall,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import _, { sortBy, uniqBy } from 'lodash'
import { default as React, Suspense, memo, useEffect, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet } from 'react-native'

import { bgLight, bgLightHover, bgLightTranslucent } from '../../colors'
import { searchBarHeight } from '../../constants'
import { useIsNarrow } from '../../hooks/useIs'
import { addTagsToCache } from '../../state/allTags'
import { HomeStateItemHome } from '../../state/home-types'
import { NavigableTag } from '../../state/NavigableTag'
import { useOvermind } from '../../state/om'
import { omStatic } from '../../state/omStatic'
import { ContentScrollView } from '../../views/ContentScrollView'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { DishView } from '../../views/dish/DishView'
import { PageFooter } from '../../views/layout/PageFooter'
import { SlantedLinkButton } from '../../views/SlantedLinkButton'
import { LinkButton } from '../../views/ui/LinkButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { RestaurantButton } from '../restaurant/RestaurantButton'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { StackViewProps } from '../StackViewProps'
import { HomeTopSearches } from './HomeTopSearches'

// top dishes

type Props = StackViewProps<HomeStateItemHome>

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
      if (!center || !span) return
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
            console.log('SEARCH_DOMAIN', SEARCH_DOMAIN)
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

  if (isLoaded) {
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
          <ContentScrollView id="home">
            {/* cross line */}
            <AbsoluteVStack
              contain="strict"
              height={320}
              width={2000}
              right="-10%"
              zIndex={-1}
              top={-120}
              transform={[{ rotate: '-2deg' }]}
              overflow="hidden" // fixes chrome rendering line at bottom glitch
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
            >
              <VStack>
                {!isSmall && <VStack height={searchBarHeight} />}
                <HomeTopSearches />

                {/* <Suspense fallback={null}>
                  <>
                    <HomeRecentReviews />
                    <Spacer size="lg" />
                  </>
                </Suspense> */}

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

const HomeRecentReviews = memo(
  graphql<any>(() => {
    const reviews = query.review({
      where: {
        source: {
          _eq: 'dish',
        },
        text: {
          _neq: '',
        },
      },
      order_by: [
        {
          updated_at: order_by.asc,
        },
      ],
      limit: 10,
    })

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack paddingHorizontal={20}>
          {reviews.map((review, i) => {
            return (
              <VStack
                key={i}
                width={200}
                maxHeight={110}
                backgroundColor={bgLight}
                borderRadius={20}
                marginRight={10}
                padding={5}
              >
                <RestaurantReview reviewId={review.id} />
              </VStack>
            )
          })}
        </HStack>
      </ScrollView>
    )
  })
)

const HomeTopDishesContent = memo(({ topDishes }: { topDishes: any[] }) => {
  return (
    <>
      <HomeTopDishesTitle />
      <Spacer size="lg" />

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
      textAlign="center"
      fontSize={18}
      lineHeight={26}
    >
      Uniquely good{' '}
      {!info || info.type === 'city' || info.type === 'country' ? 'in' : 'near'}{' '}
      <Text color="#000" fontWeight="600">
        {om.state.home.currentState.currentLocationName}
      </Text>
    </Text>
  )
}

const dishHeight = 130

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
            transform={[{ rotate: '-2deg' }]}
          >
            {/* <LinearGradient
              colors={[bgLightTranslucent, '#fff']}
              startPoint={[1, 0]}
              endPoint={[0, 0]}
              style={StyleSheet.absoluteFill}
            /> */}
          </AbsoluteVStack>
        )}

        <HStack justifyContent="center" alignItems="center">
          <SlantedLinkButton
            marginHorizontal="auto"
            zIndex={1000}
            paddingHorizontal={10}
            position="relative"
            alignSelf="center"
            tag={{
              type: 'country',
              name: country.country,
            }}
            hoverStyle={{
              transform: [{ scale: 1.05 }, { rotate: '-3.5deg' }],
            }}
          >
            <Text
              fontSize={22}
              lineHeight={28}
              fontWeight="300"
              paddingRight={country.icon ? 32 : 0}
              color="#666"
            >
              {country.country}
              {country.icon ? (
                <Text
                  position="absolute"
                  top={14}
                  marginLeft={2}
                  marginTop={2}
                  fontSize={26}
                  lineHeight={5}
                >
                  {' '}
                  {country.icon}
                </Text>
              ) : null}
            </Text>
          </SlantedLinkButton>
        </HStack>

        <Spacer size="sm" />

        <VStack
          paddingBottom={30}
          pointerEvents="none"
          flex={1}
          overflow="hidden"
          position="relative"
        >
          <ContentScrollViewHorizontal style={{ paddingVertical: 15 }}>
            <HStack alignItems="center" spacing={14} paddingRight={20}>
              <VStack marginRight={6}>
                <TopDishesTrendingRestaurants country={country} />
              </VStack>

              {(country.dishes || []).slice(0, 12).map((top_dish, index) => {
                return (
                  <HStack
                    transform={[{ translateY: index % 2 == 0 ? -3 : 3 }]}
                    hoverStyle={{
                      zIndex: 1000,
                    }}
                    key={index}
                  >
                    <DishView
                      size={dishHeight}
                      isFallback
                      dish={top_dish}
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
                alignItems="center"
                justifyContent="center"
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
const setHoveredRestaurant = _.debounce((val) => {
  omStatic.actions.home.setHoveredRestaurant(val)
}, 200)

const TopDishesTrendingRestaurants = memo(
  ({ country }: { country: TopCuisine }) => {
    return (
      <VStack
        width={210}
        paddingHorizontal={10}
        marginRight={5}
        height={135}
        spacing={4}
        alignItems="flex-start"
      >
        <Suspense fallback={<LoadingItemsSmall />}>
          {_.uniqBy(country.top_restaurants, (x) => x.name)
            .slice(0, 4)
            .map((restaurant, index) => {
              return (
                <HStack
                  justifyContent="flex-end"
                  key={restaurant.name}
                  maxWidth="100%"
                  minWidth={210}
                >
                  <RestaurantButton
                    color={`rgba(0,0,0,${Math.max(0.5, 1 - (index + 1) / 5)})`}
                    // trending={
                    //   (index % 5) - 1 == 0
                    //     ? 'neutral'
                    //     : index % 2 == 0
                    //     ? 'up'
                    //     : 'down'
                    // }
                    subtle
                    restaurantSlug={restaurant.slug ?? ''}
                    onHoverIn={() => {
                      lastHoveredId = restaurant.id
                      setHoveredRestaurant.cancel()
                      setHoveredRestaurant({
                        id: restaurant.id,
                        slug: restaurant.slug,
                      })
                    }}
                    onHoverOut={() => {
                      if (lastHoveredId === restaurant.id) {
                        setHoveredRestaurant.cancel()
                        omStatic.actions.home.setHoveredRestaurant(false)
                      }
                    }}
                  />
                </HStack>
              )
            })}
        </Suspense>
      </VStack>
    )
  }
)

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
