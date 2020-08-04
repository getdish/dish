import { fullyIdle, series } from '@dish/async'
import { TopCuisine, TopCuisineDish, getHomeDishes } from '@dish/graph'
import {
  AbsoluteVStack,
  Box,
  HStack,
  LoadingItems,
  Spacer,
  Text,
  VStack,
  useDebounce,
} from '@dish/ui'
import { isEqual } from '@o/fast-compare'
import _ from 'lodash'
import {
  default as React,
  Suspense,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ChevronRight } from 'react-feather'
import { useStorageState } from 'react-storage-hooks'

import { getTagId } from '../../state/getTagId'
import { getActiveTags } from '../../state/home-tag-helpers'
import { HomeStateItemHome } from '../../state/home-types'
import { NavigableTag } from '../../state/NavigableTag'
import { omStatic, useOvermind } from '../../state/om'
import { tagDescriptions } from '../../state/tagDescriptions'
import { NotFoundPage } from '../../views/NotFoundPage'
import { LinkButton } from '../../views/ui/LinkButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { flatButtonStyle } from './baseButtonStyle'
import { CloseButton } from './CloseButton'
import { DishView } from './DishView'
import { HomeLenseBar } from './HomeLenseBar'
import { HomePagePaneProps } from './HomePagePaneProps'
import { HomeScrollView, HomeScrollViewHorizontal } from './HomeScrollView'
import { RestaurantButton } from './RestaurantButton'
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

  useEffect(() => {
    if (isLoaded && props.isActive) {
      let isMounted = true
      getHomeDishes(
        center!.lat,
        center!.lng,
        // TODO span
        span!.lat
      ).then((all) => {
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
              {/* LENSES - UNIQUELY GOOD HERE */}
              <VStack>
                <VStack alignItems="center">
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
                </VStack>

                <HomeIntroLetter />

                <Spacer size="xl" />

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

// {/* <Spacer size={isSmall ? 5 : 15} />
//<Text
// marginTop={30}
// fontWeight="300"
// fontSize={16}
// letterSpacing={-0.25}
// opacity={0.6}
// >
// {currentLocationName
//   ? `What's good in ${currentLocationName}`
//   : `What's good here`}
// </Text> */} */}

const HomeLenseTitle = ({ state }) => {
  const lense = getActiveTags(state).find((x) => x.type === 'lense')
  const tagsDescriptions = tagDescriptions[(lense.name ?? '').toLowerCase()]
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
  )
}

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
    <VStack marginTop={30} alignItems="center" justifyContent="center">
      <Box
        maxWidth={400}
        width="70%"
        margin="auto"
        padding={20}
        position="relative"
      >
        <HStack position="absolute" top={10} right={10}>
          <CloseButton onPress={() => setShowIntro(false)} />
        </HStack>
        <Spacer size="md" />
        <Text fontSize={16} lineHeight={22} opacity={0.8}>
          <Text fontSize={18} lineHeight={28}>
            dish is shows uniquely good restaurants in your neighborhood.{' '}
            <Text fontWeight="600">searches every delivery service.</Text>
            vote on what makes places ✨.{' '}
            <Text fontWeight="600">its a little like a social pokedex.</Text>
          </Text>
        </Text>
         
        <Spacer size="sm" />
        {/* <Text fontSize={14} lineHeight={20} opacity={0.8}>
          <strong>Beta</strong>. Report using the (?) on the
          bottom right.
        </Text> */}
        <LinkButton {...flatButtonStyle} name="about">
          Read more
        </LinkButton>
      </Box>
      <Spacer size={30} />
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
      <LinkButton
        {...flatButtonStyle}
        transform={[{ rotate: '-2.5deg' }]}
        pressStyle={{
          transform: [{ rotate: '-2.5deg' }],
        }}
        marginTop={0}
        marginBottom={0}
        marginLeft={20}
        zIndex={1000}
        position="relative"
        tag={{
          type: 'country',
          name: country.country,
        }}
      >
        <Text
          ellipse
          fontSize={18}
          fontWeight={'400'}
          height={22}
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
            spacing={16}
            paddingVertical={18}
            paddingRight={20}
            pointerEvents="auto"
          >
            <TopDishesTrendingRestaurants country={country} />

            {(country.dishes || []).slice(0, 12).map((top_dish, index) => {
              // console.log(
              //   'top_dish.best_restaurants',
              //   top_dish.best_restaurants
              // )
              return (
                <HStack key={index}>
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
