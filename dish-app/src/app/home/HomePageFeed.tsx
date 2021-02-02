import { series } from '@dish/async'
import {
  LngLat,
  MapPosition,
  RestaurantOnlyIds,
  SEARCH_DOMAIN,
  TopCuisine,
  graphql,
  order_by,
  query,
  resolved,
} from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Plus } from '@dish/react-feather'
import { chunk, partition, sortBy, uniqBy, zip } from 'lodash'
import React, { Suspense, memo, useEffect, useMemo, useState } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
  Spacer,
  Text,
  VStack,
  useDebounce,
  useTheme,
} from 'snackui'

import { peachAvatar } from '../../constants/avatar'
import { getColorsForName } from '../../helpers/getColorsForName'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { hexToRGB } from '../../helpers/hexToRGB'
import {
  getDistanceForZoom,
  snapCoordsToTileCentre,
} from '../../helpers/mapHelpers'
import { useQueryLoud } from '../../helpers/useQueryLoud'
import { queryRestaurant } from '../../queries/queryRestaurant'
import { HomeStateItemHome, RegionNormalized } from '../../types/homeTypes'
import { useSetAppMap } from '../AppMapStore'
import { getMapZoom } from '../getMap'
import { homeStore } from '../homeStore'
import { CardFrame } from '../views/CardFrame'
import { SmallCircleButton } from '../views/CloseButton'
import { CommentBubble } from '../views/CommentBubble'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { DishView } from '../views/dish/DishView'
import { Link } from '../views/Link'
import { ListCard } from '../views/list/ListCard'
import { SlantedTitle, SlantedTitleProps } from '../views/SlantedTitle'
import { GradientButton } from './GradientButton'
import { HomeStackViewProps } from './HomeStackViewProps'
import { PageFooter } from './PageFooter'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { SkewedCard, SkewedCardCarousel } from './SkewedCard'
import { TagsText } from './TagsText'

export type FeedItem =
  | FeedItemDish
  | FeedItemRestaurant
  | FeedItemCuisine
  | FeedItemDishRestaurants
  | FeedItemList

type FeedItemBase = {
  id: string
  title: string
  rank: number
  expandable: boolean
  transparent?: boolean
}
export type FeedItemDish = FeedItemBase & {
  type: 'dish'
  dish: DishTagItem
  restaurant: RestaurantOnlyIds
}
export type FeedItemDishRestaurants = FeedItemBase & {
  type: 'dish-restaurants'
  dish: DishTagItem
  restaurants: RestaurantOnlyIds[]
}
export type FeedItemCuisine = FeedItemBase &
  TopCuisine & {
    type: 'cuisine'
  }
export type FeedItemRestaurant = FeedItemBase & {
  type: 'restaurant'
  restaurant: RestaurantOnlyIds
}
export type FeedItemList = FeedItemBase & {
  type: 'list'
  region: string
}

type HomeFeedProps = HomeStackViewProps<HomeStateItemHome> & {
  region?: RegionNormalized | null
  item: HomeStateItemHome
} & MapPosition

export const HomePageFeed = memo(
  graphql(function HomePageFeed(props: HomeFeedProps) {
    const { region, isActive, center, span } = props
    const items = useHomeFeed(props)
    const isLoading = !region || items[0]?.id === null
    const theme = useTheme()
    const [hovered, setHovered] = useState<null | string>(null)
    const [hoveredResults, setHoveredResults] = useState<null | {
      via: FeedItem['type']
      results: RestaurantOnlyIds[]
    }>(null)
    const results = items.flatMap((x) => {
      if (hovered && hovered !== x.id) {
        return []
      }
      if (hoveredResults?.via === x.type) {
        return hoveredResults.results
      }
      if (x.type === 'dish-restaurants') {
        return x.restaurants
      }
      if (x.type === 'cuisine') {
        return x.top_restaurants.map((r) => ({
          slug: r.slug ?? '',
          id: r.id ?? '',
        }))
      }
      return []
    })
    // const store = useStore(HomeFeedStore)
    // const hovered = store.hoveredItemId ? items.find(x => x.id === store.hoveredItemId) : null

    useSetAppMap({
      isActive,
      results,
      center,
      span,
    })

    const feedContents = useMemo(() => {
      return items.map((item, index) => {
        const content = (() => {
          switch (item.type) {
            case 'restaurant':
              return <RestaurantFeedCard {...item} />
            case 'dish':
              return <DishFeedCard {...item} />
            case 'dish-restaurants':
              return <DishRestaurantsFeedCard {...item} />
            case 'cuisine':
              return <CuisineFeedCard {...item} />
            case 'list':
              return (
                <ListFeedCard
                  {...item}
                  onHoverResults={(results) =>
                    setHoveredResults({ via: 'list', results })
                  }
                />
              )
          }
        })()
        if (!content) {
          return null
        }
        return (
          <VStack
            key={item.id}
            alignItems="center"
            position="relative"
            width="100%"
            onHoverIn={() => {
              setHovered(item.id)
            }}
            onHoverOut={() => {
              setHovered(null)
            }}
            paddingTop={10}
            marginTop={-10}
            marginBottom={10}
            hoverStyle={{
              backgroundColor: theme.backgroundColorAlt,
            }}
          >
            {content}
          </VStack>
        )
      })
    }, [items])

    return (
      <>
        {isLoading && (
          <>
            <LoadingItems />
            <LoadingItems />
          </>
        )}

        {!isLoading && (
          <Suspense fallback={null}>
            <VStack
              paddingBottom={100}
              minHeight={Dimensions.get('window').height * 0.9}
            >
              {feedContents}
            </VStack>

            <VStack height={20} />

            <PageFooter />
          </Suspense>
        )}
      </>
    )
  })
)

async function getHomeDishes(
  lng: number,
  lat: number,
  zoom: number
): Promise<TopCuisine[]> {
  const snapped = snapCoordsToTileCentre(lng, lat, zoom)
  lng = snapped[0]
  lat = snapped[1]
  const params = [
    'lon=' + lng,
    'lat=' + lat,
    'distance=' + getDistanceForZoom(zoom),
  ]
  const url = SEARCH_DOMAIN + '/top_cuisines?' + params.join('&')
  const response = await fetch(url).then((res) => res.json())
  return response
}

const getHomeCuisines = async (center: LngLat) => {
  const cuisineItems = await getHomeDishes(
    center.lng,
    center.lat,
    (await getMapZoom()) ?? 11
  )
  let all: TopCuisine[] = []
  for (const item of cuisineItems) {
    const existing = all.find((x) => x.country === item.country)
    if (existing) {
      const allTopRestaurants = [
        ...existing.top_restaurants,
        ...item.top_restaurants,
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
      all.push(item)
    }
  }
  return sortBy(all, (x) => -x.avg_rating)
}

const useTopCuisines = (center: LngLat) => {
  return useQueryLoud('topcuisine', () => getHomeCuisines(center), {
    suspense: false,
  })
}

const ListFeedCard = graphql(
  ({
    region,
    onHoverResults,
  }: FeedItemList & { onHoverResults: (ids: RestaurantOnlyIds[]) => any }) => {
    const recentLists = query.list({
      limit: 10,
      where: {
        public: {
          _neq: false,
        },
        region: {
          _eq: region,
        },
      },
      order_by: [{ created_at: order_by.desc }],
    })
    const [hoveredList, setHoveredListFast] = useState<string | null>(null)
    const setHoveredList = useDebounce(setHoveredListFast, 300)

    useEffect(() => {
      return series([
        () =>
          resolved(() => {
            return query
              .list({
                where: {
                  id: {
                    _eq: hoveredList,
                  },
                },
                limit: 1,
              })
              .flatMap((x) => {
                return x
                  .restaurants({
                    limit: 40,
                  })
                  .map((r) => getRestaurantIdentifiers(r.restaurant))
              })
          }),
        (results) => {
          onHoverResults(results)
        },
      ])
    }, [hoveredList])

    return (
      <>
        <FeedSlantedTitle>
          <HStack alignItems="center">
            <Text fontSize={22} fontWeight="700">
              Playlists
            </Text>
            <Spacer size="sm" />
            <Link
              promptLogin
              name="list"
              params={{
                userSlug: 'me',
                slug: 'create',
                region: homeStore.lastRegionSlug,
              }}
            >
              <SmallCircleButton alignSelf="center">
                <Plus size={14} color="#fff" />
              </SmallCircleButton>
            </Link>
          </HStack>
        </FeedSlantedTitle>
        <SkewedCardCarousel>
          {recentLists.map((list, i) => {
            if (!list) {
              return null
            }
            return (
              <SkewedCard zIndex={1000 - i} key={list.id}>
                <ListCard
                  isBehind={i > 0}
                  hoverable={false}
                  slug={list.slug}
                  userSlug={list.user?.username ?? ''}
                  region={list.region ?? ''}
                  onHover={(hovered) =>
                    hovered ? setHoveredList(list.id) : null
                  }
                />
              </SkewedCard>
            )
          })}
        </SkewedCardCarousel>
      </>
    )
  }
)

const FeedSlantedTitle = (props: SlantedTitleProps) => {
  return (
    <VStack
      alignSelf="flex-start"
      marginTop={0}
      marginLeft={15}
      marginBottom={-42}
    >
      <SlantedTitle size="md" {...props} />
    </VStack>
  )
}

const CuisineFeedCard = memo(
  graphql(function CuisineFeedCard(props: FeedItemCuisine) {
    const dishes = props.dishes
      ? query.tag({
          where: {
            name: {
              _in: props.dishes.map((x) => x.name),
            },
          },
          order_by: [{ popularity: order_by.desc }],
        })
      : []

    const restaurants = props.dishes?.[0]?.best_restaurants ?? []
    const [titleWidth, setTitleWidth] = useState(100)

    return (
      <>
        <FeedSlantedTitle
          onLayout={(x) => setTitleWidth(x.nativeEvent.layout.width)}
        >
          {props.title}
        </FeedSlantedTitle>

        <VStack
          maxWidth="100%"
          overflow="hidden"
          marginBottom={-20}
          marginTop={-14}
        >
          <ContentScrollViewHorizontal>
            <VStack
              paddingVertical={12}
              paddingHorizontal={40}
              flexWrap="nowrap"
            >
              <HStack
                spacing={6}
                marginHorizontal="auto"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
              >
                <VStack width={titleWidth} />
                {dishes.map((dish, index) => {
                  const color = getColorsForName(dish.name).color
                  const rgb = hexToRGB(color).rgb
                  return (
                    <Link key={index} tag={{ slug: dish.slug }} asyncClick>
                      <GradientButton rgb={rgb.map((x) => x * 1.1)}>
                        <TagsText
                          tags={[{ name: dish.name, icon: dish.icon }]}
                          color={color}
                        />
                      </GradientButton>
                    </Link>
                  )
                })}
              </HStack>
            </VStack>
          </ContentScrollViewHorizontal>
        </VStack>

        <ContentScrollViewHorizontal>
          <VStack paddingVertical={0} paddingHorizontal={0} flexWrap="nowrap">
            <HStack>
              {restaurants.map((r, i) => {
                return (
                  <SkewedCard zIndex={1000 - i} key={r.id}>
                    <RestaurantCard
                      isBehind={i > 0}
                      restaurantId={r.id}
                      restaurantSlug={r.slug}
                      hoverable={false}
                      // below={
                      //   <VStack position="absolute" bottom={-10} right={-5}>
                      //     <DishView
                      //       dish={props.dish}
                      //       restaurantId={r.id}
                      //       restaurantSlug={r.slug}
                      //       size={140}
                      //       isFallback
                      //     />
                      //   </VStack>
                      // }
                    />
                  </SkewedCard>
                )
              })}
            </HStack>
          </VStack>
        </ContentScrollViewHorizontal>
      </>
    )
  })
)

const DishFeedCard = graphql(function DishFeedCard(props: FeedItemDish) {
  const [restaurant] = queryRestaurant(props.restaurant.slug)
  return (
    <CardFrame aspectFixed transparent>
      <VStack position="relative" alignSelf="center">
        <DishView showSearchButton size={220} {...props} {...props.dish} />
      </VStack>
      <Text fontSize={14} lineHeight={22} opacity={0.4} margin={4}>
        lorem ipsume dolor sit amet lorem ipsume dolor sit amet lorem ipsume
        dolor sit amet lorem ipsume dolor sit amet.
      </Text>
    </CardFrame>
  )
})

const DishRestaurantsFeedCard = (props: FeedItemDishRestaurants) => {
  return (
    <>
      <FeedSlantedTitle>
        {props.dish.icon} {props.dish.name}
      </FeedSlantedTitle>
      <SkewedCardCarousel>
        {props.restaurants.slice(0, 5).map((r, i) => {
          if (!r.slug) {
            return null
          }
          return (
            <SkewedCard zIndex={1000 - i} key={r.id}>
              <RestaurantCard
                padTitleSide
                isBehind={i > 0}
                hideScore
                restaurantId={r.id}
                restaurantSlug={r.slug}
                hoverable={false}
                dimImage
                below={
                  <AbsoluteVStack alignSelf="center" bottom={20}>
                    <DishView
                      {...props.dish}
                      hideVote
                      restaurantId={r.id}
                      restaurantSlug={r.slug}
                      size={190}
                    />
                  </AbsoluteVStack>
                }
              />
            </SkewedCard>
          )
        })}
      </SkewedCardCarousel>
    </>
  )
}

const RestaurantFeedCard = (props: FeedItemRestaurant) => {
  return (
    <RestaurantCard
      aspectFixed={false}
      restaurantId={props.restaurant.id}
      restaurantSlug={props.restaurant.slug}
      below={
        <CommentBubble
          name="Test"
          avatar={peachAvatar}
          text="Lorem ipsum dolor sit amet"
        />
      }
    />
  )
}

function useHomeFeed({ item, region, center, span }: HomeFeedProps) {
  const isNew = item.section === 'new'
  const slug = item.region ?? ''
  const homeFeed = useQueryLoud<{
    trending: RestaurantOnlyIds[]
    newest: RestaurantOnlyIds[]
  }>(
    `HOMEFEEDQUERY-${slug}`,
    () =>
      fetch(
        `${SEARCH_DOMAIN}/feed?region=${encodeURIComponent(slug)}&limit=20`
      ).then((res) => res.json()),
    {
      enabled: !!item.region,
      suspense: false,
    }
  )

  const feedRestaurants = homeFeed.data?.[isNew ? 'new' : 'trending'] ?? []
  const bbox = region?.bbox
  const backupRestaurants = bbox
    ? query
        .restaurant({
          where: {
            location: {
              _st_within: bbox,
            },
            downvotes: { _is_null: false },
            votes_ratio: { _is_null: false },
          },
          order_by: [{ votes_ratio: order_by.desc }],
          limit: 10,
        })
        .map((x) => ({ id: x.id, slug: x.slug }))
    : []

  const restaurants = uniqBy(
    [...feedRestaurants, ...backupRestaurants],
    (x) => x.id
  )

  const cuisines = useTopCuisines(center)

  const dishes = query.tag({
    where: {
      type: {
        _eq: 'dish',
      },
    },
    order_by: [{ popularity: order_by.desc }],
    limit: 8,
  })

  // @ts-ignore
  let items: FeedItem[] =
    !region || !item.region
      ? []
      : [
          {
            id: `0`,
            type: 'list',
            region: item.region,
            expandable: true,
            rank: -1,
            title: `Lists`,
          } as FeedItemList,
          ,
          // ...dishes.map(
          //   (dish, index): FeedItem => {
          //     return {
          //       id: `dish-${dish.id}`,
          //       type: 'dish',
          //       expandable: false,
          //       rank: Math.random() * 10,
          //       transparent: true,
          //       restaurant: {
          //         id: restaurants[0]?.id ?? '',
          //         slug: restaurants[0]?.slug ?? '',
          //       },
          //       dish: {
          //         id: dish.id ?? '',
          //         slug: dish.slug ?? '',
          //         name: dish.name ?? '',
          //         icon: dish.icon ?? '',
          //         image: dish.default_images()?.[0] ?? '',
          //         score: 100,
          //       },
          //     } as const
          //   }
          // ),
          ...dishes.map(
            (dish, index): FeedItem => {
              return {
                id: `dish-restaurant-${dish.id}`,
                title: `Known for ${dish.name}`,
                type: 'dish-restaurants',
                expandable: true,
                rank: index + (index % 2 ? 10 : 0),
                dish: {
                  id: dish.id ?? '',
                  slug: dish.slug ?? '',
                  name: dish.name ?? '',
                  icon: dish.icon ?? '',
                  image: dish.default_images()?.[0] ?? '',
                  score: 100 - index * 10,
                },
                restaurants: restaurants.map((r) => {
                  return {
                    id: r.id,
                    slug: r.slug,
                  }
                }),
              } as const
            }
          ),
          ...(cuisines.data ?? []).map(
            (item, index): FeedItem => {
              return {
                id: `cuisine-${item.country}`,
                title: `${item.country}`,
                type: 'cuisine',
                expandable: true,
                rank: index + (index % 3 ? 30 : 0),
                ...item,
              } as const
            }
          ),
          // ...restaurants.map(
          //   (item, index): FeedItem => {
          //     return {
          //       id: `restaurant-${item.id}`,
          //       title: item.name,
          //       expandable: false,
          //       type: 'restaurant',
          //       rank: index,
          //       restaurant: {
          //         id: item.id,
          //         slug: item.slug,
          //       },
          //     } as const
          //   }
          // ),
        ]

  items = items.filter((x) => x.id)
  items = sortBy(items, (x) => x.rank)
  items = uniqBy(items, (x) => x.id)

  const [expandable, unexpandable] = partition(items, (x) => x.expandable)
  const unshuffled = zip(expandable, unexpandable).flat().slice(0, 12)
  const shuffled = chunk(unshuffled, 2)
    .map((chunk, i) => (i % 2 === 1 ? [chunk[1], chunk[0]] : chunk))
    .flat()
    .filter(isPresent)

  return shuffled
}
