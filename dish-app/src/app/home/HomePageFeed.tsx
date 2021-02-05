import { RestaurantOnlyIds, SEARCH_DOMAIN, graphql } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { sortBy, uniqBy } from 'lodash'
import React, { Suspense, memo, useCallback, useMemo, useState } from 'react'
import { Dimensions } from 'react-native'
import { LoadingItems, VStack, useTheme } from 'snackui'

import { useQueryLoud } from '../../helpers/useQueryLoud'
import { useSetAppMap } from '../AppMapStore'
import {
  FICuisine,
  HomeFeedCuisineItem,
  useFeedTopCuisines,
} from './HomeFeedCuisineItem'
import {
  FIDishRestaurants,
  HomeFeedDishRestaurants,
  useFeedDishItems,
} from './HomeFeedDishRestaurants'
import { FIList, HomeFeedLists } from './HomeFeedLists'
import { HomeFeedProps } from './HomeFeedProps'
import { FIHot, FINew, HomeFeedTrendingNew } from './HomeFeedTrendingNew'
import { PageFooter } from './PageFooter'

type FI = FICuisine | FIDishRestaurants | FIList | FINew | FIHot

export const HomePageFeed = memo(
  graphql(function HomePageFeed(props: HomeFeedProps) {
    const { region, isActive, center, span } = props
    const items = useHomeFeed(props)
    const isLoading = !region || items[0]?.id === null
    const theme = useTheme()
    const [hovered, setHovered] = useState<null | string>(null)
    const [hoveredResults, setHoveredResults] = useState<null | {
      via: FI['type']
      results: RestaurantOnlyIds[]
    }>(null)
    const results = items.flatMap((x) => {
      if (hovered && hovered !== x.id) {
        return []
      }
      if (hoveredResults?.via === x.type) {
        return hoveredResults.results
      }
      if ('restaurants' in x) {
        return x.restaurants
      }
      return []
    })

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
            case 'hot':
            case 'new':
              return <HomeFeedTrendingNew {...item} />
            case 'dish-restaurants':
              return (
                <HomeFeedDishRestaurants
                  {...item}
                  onHoverResults={(results) => {
                    setHoveredResults({ via: item.type, results })
                  }}
                />
              )
            case 'cuisine':
              return (
                <HomeFeedCuisineItem
                  {...item}
                  onHoverResults={(results) => {
                    console.log('setting hover', results)
                    setHoveredResults({ via: item.type, results })
                  }}
                />
              )
            case 'list':
              return (
                <HomeFeedLists
                  {...item}
                  onHoverResults={(results) => {
                    setHoveredResults({ via: item.type, results })
                  }}
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

type FeedApiResponse = {
  trending: RestaurantOnlyIds[]
  newest: RestaurantOnlyIds[]
}

function useHomeFeed(props: HomeFeedProps) {
  const { item, region } = props
  const cuisineItems = useFeedTopCuisines(props)
  const slug = item.region ?? region?.slug ?? ''
  const dishItems = useFeedDishItems(region)
  const homeFeed = useQueryLoud<FeedApiResponse>(
    `HOMEFEEDQUERY-${slug}`,
    () =>
      fetch(
        `${SEARCH_DOMAIN}/feed?region=${encodeURIComponent(slug)}&limit=20`
      ).then((res) => res.json()),
    {
      enabled: !!slug,
      suspense: false,
    }
  )
  const feedData = homeFeed.data

  let items: FI[] =
    !region || !item.region
      ? []
      : [
          {
            id: `0`,
            type: 'list',
            region: item.region,
            rank: -3,
            title: `Lists`,
          } as FIList,

          {
            id: '1',
            type: 'new',
            rank: -2,
            title: 'New',
            restaurants: feedData?.newest,
          } as FINew,

          {
            id: '2',
            type: 'hot',
            title: 'Trending',
            rank: -1,
            restaurants: feedData?.trending,
          } as FIHot,
          ...cuisineItems,
          ...dishItems,
        ].filter(isPresent)

  items = uniqBy(items, (x) => x.id)
  items = items.filter((x) => x.id)
  items = sortBy(items, (x) => x.rank)

  return items
}
