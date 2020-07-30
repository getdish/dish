import { fullyIdle, series } from '@dish/async'
import { TopCuisine } from '@dish/graph'
import {
  AbsoluteVStack,
  Box,
  HStack,
  LoadingItems,
  SmallTitle,
  Spacer,
  Text,
  VStack,
  useDebounce,
} from '@dish/ui'
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

import { HomeStateItemHome } from '../../state/home'
import { getActiveTags } from '../../state/home-tag-helpers'
import { tagDescriptions } from '../../state/tagDescriptions'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { NotFoundPage } from '../../views/NotFoundPage'
import { Link } from '../../views/ui/Link'
import { LinkButton } from '../../views/ui/LinkButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { flatButtonStyle } from './baseButtonStyle'
import { CloseButton } from './CloseButton'
import { DishView } from './DishView'
import { HomeLenseBar } from './HomeLenseBar'
import { HomePagePaneProps } from './HomePagePane'
import { HomeScrollView, HomeScrollViewHorizontal } from './HomeScrollView'
import { RestaurantButton } from './RestaurantButton'
import { Squircle } from './Squircle'
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

  return (
    <>
      <PageTitleTag>Dish - Uniquely Good Food</PageTitleTag>
      <VStack position="relative" flex={1} maxHeight="100%" overflow="visible">
        <HomeScrollView>
          <VStack
            paddingTop={isSmall ? 20 : 34}
            paddingBottom={30}
            spacing="xl"
          >
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

                <Text
                  marginTop={30}
                  fontWeight="300"
                  fontSize={16}
                  letterSpacing={-0.25}
                  opacity={0.6}
                >
                  {currentLocationName
                    ? `What's good in ${currentLocationName}`
                    : `What's good here`}
                </Text>
              </VStack>

              <HomeIntroLetter />

              <Suspense fallback={null}>
                <HomeTopDishesContent />
              </Suspense>
            </VStack>
          </VStack>
        </HomeScrollView>
      </VStack>
    </>
  )
})

const HomeLenseTitle = ({ state }) => {
  const om = useOvermind()
  const lense = getActiveTags(om.state.home, state).find(
    (x) => x.type === 'lense'
  )
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
        maxWidth="85%"
        minWidth="75%"
        margin="auto"
        padding={20}
        position="relative"
      >
        <HStack position="absolute" top={10} right={10}>
          <CloseButton onPress={() => setShowIntro(false)} />
        </HStack>
        <Spacer size="sm" />
        <Text fontSize={16} lineHeight={22} opacity={0.8}>
          <SmallTitle>Welcome</SmallTitle>
          <Spacer size="lg" />
          <Text fontSize={16} lineHeight={26}>
            <Text fontSize={18} lineHeight={38}>
              Dish is <strong>better food discovery</strong> meets a{' '}
              <strong>curation community</strong>.
            </Text>
            <ul>
              <li>🎖 Accurate ratings, down to the dish</li>
              <li style={{ marginLeft: 20, fontSize: 14, opacity: 0.8 }}>
                Foursquare, Yelp, Google, The Infatuation, Michelin and more
              </li>
              <li>🔎 Search every delivery service</li>
              <li>🤝 Discuss, curate, and explore the map</li>
            </ul>
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

const HomeTopDishesContent = memo(() => {
  const om = useOvermind()
  const { topDishes } = om.state.home

  return useMemo(() => {
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
  }, [topDishes])
})

const dishHeight = 150

const TopDishesCuisineItem = memo(({ country }: { country: TopCuisine }) => {
  return (
    <VStack className="home-top-dish" position="relative">
      <LinkButton
        {...flatButtonStyle}
        transform={[{ rotate: '-2.5deg' }]}
        marginTop={0}
        marginBottom={0}
        marginLeft={20}
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
      <VStack
        marginTop={-20}
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
            pointerEvents="auto"
          >
            <TopDishesTrendingRestaurants country={country} />

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
            <Link
              className="see-through"
              tag={{ type: 'country', name: country.country ?? '' }}
            >
              <Squircle width={dishHeight * 0.8} height={dishHeight}>
                <ChevronRight size={40} color="black" />
              </Squircle>
            </Link>
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

const TopDishesTrendingRestaurants = memo(
  ({ country }: { country: TopCuisine }) => {
    const setHoveredRestaurant = useDebounce((val) => {
      omStatic.actions.home.setHoveredRestaurant(val)
    }, 200)

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
                restaurant={restaurant as any}
                maxWidth="100%"
                onHoverIn={() => {
                  lastHoveredId = restaurant.id
                  setHoveredRestaurant({
                    id: restaurant.id,
                    slug: restaurant.slug,
                  })
                }}
                onHoverOut={() => {
                  clearHoveredRestaurant()
                }}
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
