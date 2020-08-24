import { fullyIdle, series } from '@dish/async'
import { TopCuisine, getHomeDishes } from '@dish/graph'
import {
  AbsoluteVStack,
  Box,
  Divider,
  HStack,
  LoadingItems,
  Spacer,
  Text,
  VStack,
  useDebounceEffect,
} from '@dish/ui'
import { isEqual } from '@o/fast-compare'
import _ from 'lodash'
import { default as React, Suspense, memo, useEffect, useState } from 'react'
import { ChevronRight } from 'react-feather'
import { useStorageState } from 'react-storage-hooks'

import { bgLight } from '../../colors'
import { getActiveTags } from '../../state/home-tag-helpers'
import { HomeStateItemHome } from '../../state/home-types'
import { NavigableTag } from '../../state/NavigableTag'
import { omStatic, useOvermind } from '../../state/om'
import { tagDisplayName } from '../../state/tagDisplayName'
import { tagDescriptions } from '../../state/tagLenses'
import { Link } from '../../views/ui/Link'
import { LinkButton } from '../../views/ui/LinkButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { flatButtonStyle } from './baseButtonStyle'
import { CloseButton } from './CloseButton'
import { DishView } from './DishView'
import { HomeLenseBar } from './HomeLenseBar'
import { HomePagePaneProps } from './HomePagePaneProps'
import { HomeScrollView, HomeScrollViewHorizontal } from './HomeScrollView'
import { RestaurantButton } from './RestaurantButton'
import { SlantedBox, slantedBoxStyle } from './SlantedBox'
import { SlantedLinkButton } from './SlantedLinkButton'
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
  const { activeTagIds, center, span } = state
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
    if (isLoaded && props.isActive) {
      let isMounted = true
      getHomeDishes(center!.lng, center!.lat).then((all) => {
        if (!isMounted) return
        if (!isEqual(all, topDishes)) {
          updateHomeTagsCache(all)
          setTopDishes(all)
          om.actions.home.setTopDishes(all)
        }
      })

      return () => {
        isMounted = false
      }
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
        >
          <HomeScrollView>
            <VStack paddingTop={isSmall ? 20 : 28} spacing="xl">
              <VStack>
                {/* LENSES - UNIQUELY GOOD HERE */}
                {/* <VStack alignItems="center">
                  <HStack
                    width="100%"
                    alignItems="center"
                    justifyContent="center"
                    paddingHorizontal={20}
                    position="relative"
                  >
                    {!isSmall && <HomeLenseTitle state={state} />}

                    <HStack alignItems="center" justifyContent="center">
                      <HomeLenseBar
                        backgroundColor="transparent"
                        size="xl"
                        activeTagIds={activeTagIds}
                      />
                    </HStack>
                  </HStack>

                  <Spacer size={isSmall ? 5 : 15} />
                </VStack> */}

                <HomeIntroLetter />

                {/* <SlantedBox alignSelf="center">
                  <Text fontSize={13} opacity={0.5}></Text>
                </SlantedBox>
                <Spacer /> */}
                <HomeTopSearches />

                <Spacer size="lg" />

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

const HomeTopSearches = () => {
  return (
    <HStack
      paddingHorizontal={20}
      paddingVertical={10}
      spacing={14}
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
    >
      {recentSearches.map((search, index) => (
        <VStack
          key={index}
          borderColor="#eee"
          borderWidth={1}
          padding={3}
          paddingHorizontal={8}
          borderRadius={80}
          className="ease-in-out-slower"
          backgroundColor="#fff"
          marginBottom={8}
          hoverStyle={{
            backgroundColor: bgLight,
          }}
        >
          <LinkButton tags={search.tags} cursor="pointer" alignItems="center">
            {search.tags.map((tag, index) => (
              <React.Fragment key={tag.name}>
                <Text
                  height={16}
                  lineHeight={16}
                  padding={5}
                  fontSize={13}
                  borderRadius={50}
                  backgroundColor="transparent"
                >
                  {tag.icon ? `${tag.icon} ` : ''}
                  {tagDisplayName(tag)}
                </Text>
                {index < search.tags.length - 1 ? (
                  <Text marginHorizontal={2} fontSize={8} opacity={0.23}>
                    +
                  </Text>
                ) : null}
              </React.Fragment>
            ))}
          </LinkButton>
        </VStack>
      ))}
    </HStack>
  )
}

const recentSearches = [
  {
    tags: [
      { displayName: 'Cheap', name: 'price-low' },
      { name: 'Pho', icon: '🍜' },
    ],
  },
  {
    tags: [
      { displayName: 'Fancy', name: 'Vibe' },
      { name: 'Steak', icon: '🥩' },
    ],
  },
  {
    tags: [
      { name: 'Gems', displayName: 'Great' },
      { name: 'Delivery' },
      { name: 'Sushi', icon: '🍣' },
    ],
  },
  {
    tags: [
      { name: 'Vegetarian', icon: '🥬' },
      { name: 'Delivery' },
      { name: 'Sandwich', icon: '🥪' },
    ],
  },
  {
    tags: [
      { name: 'Gems', displayName: 'Great' },
      { name: 'Cheap' },
      { name: 'Thai', icon: '🇹🇭' },
    ],
  },
]

const HomeLenseTitle = ({ state }) => {
  const lense = getActiveTags(state).find((x) => x.type === 'lense')
  const tagsDescriptions = tagDescriptions[(lense?.name ?? '').toLowerCase()]
  const tagsDescription = tagsDescriptions?.plain.replace('Here', ``) ?? ''
  return (
    <AbsoluteVStack
      position="absolute"
      top="50%"
      marginTop={-10}
      left="2%"
      width="36%"
      zIndex={1000}
      justifyContent="center"
      alignItems="center"
      pointerEvents="none"
    >
      <LinkButton fontSize={15} fontWeight="600" {...slantedBoxStyle}>
        {tagsDescription}
      </LinkButton>
    </AbsoluteVStack>
  )
}

const HomeIntroLetter = memo(() => {
  const [showInto, setShowIntro] = useStorageState(
    localStorage,
    'showIntro2',
    true
  )

  if (!showInto) {
    return null
  }

  return (
    <VStack marginTop={30} alignItems="center" justifyContent="center">
      <Box
        maxWidth={440}
        width="95%"
        margin="auto"
        paddingRight={30}
        padding={20}
        position="relative"
      >
        <HStack position="absolute" top={10} right={10}>
          <CloseButton onPress={() => setShowIntro(false)} />
        </HStack>
        <Text fontSize={16} lineHeight={22} opacity={0.8}>
          <Text fontSize={16} lineHeight={26}>
            dish is a guide to good food, down to the dish.
            <br /> <Text fontWeight="600">search every delivery service</Text> &
            vote on local gems. &nbsp;{' '}
            <Link name="about">Learn how &#xbb;</Link>
          </Text>
        </Text>
      </Box>
      <Spacer />
    </VStack>
  )
})

const HomeTopDishesContent = memo(({ topDishes }: { topDishes: any }) => {
  if (topDishes.length) {
    console.warn('rendering contnet more expensive', topDishes)
  }
  return (
    <>
      {!topDishes.length && (
        <>
          <LoadingItems />
          <LoadingItems />
        </>
      )}
      {topDishes.map((country) => (
        <React.Fragment key={country.country}>
          <TopDishesCuisineItem country={country} />
          {/* <Spacer size="sm" /> */}
        </React.Fragment>
      ))}
    </>
  )
})

const dishHeight = 140

const TopDishesCuisineItem = memo(({ country }: { country: TopCuisine }) => {
  return (
    <VStack className="home-top-dish" position="relative">
      <HStack alignItems="center" marginBottom={10}>
        <Divider flex />
        <SlantedLinkButton
          fontSize={18}
          fontWeight="600"
          marginTop={0}
          marginBottom={0}
          marginHorizontal="auto"
          zIndex={1000}
          position="relative"
          tag={{
            type: 'country',
            name: country.country,
          }}
        >
          {country.country}{' '}
          {country.icon ? (
            <Text marginLeft={3} marginVertical={-12} fontSize={32}>
              {country.icon}
            </Text>
          ) : null}
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
        <HomeScrollViewHorizontal
          // @ts-ignore fixes ios scroll not working..
          style={{ paddingVertical: 10, pointerEvents: 'auto' }}
        >
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
