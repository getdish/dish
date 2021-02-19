import { RestaurantOnlyIds, graphql } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import React, { Suspense, memo, useMemo, useState } from 'react'
import { Dimensions } from 'react-native'
import { Hoverable, LoadingItems, VStack } from 'snackui'

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
import {
  FIHotNew,
  HomeFeedTrendingNew,
  useHomeFeedTrendingNew,
} from './HomeFeedTrendingNew'

type FI = FICuisine | FIDishRestaurants | FIList | FIHotNew

function useHomeFeed(props: HomeFeedProps): FI[] {
  const { item, region } = props
  // const cuisineItems = useFeedTopCuisines(props)
  const dishItems = useFeedDishItems(region)
  const hotNewItems = useHomeFeedTrendingNew(props)
  return useMemo(() => {
    return [
      ...hotNewItems,
      {
        id: `0`,
        type: 'list',
        region: item.region,
        rank: -3,
        title: `Lists`,
      } as FIList,
      ...dishItems,
    ].filter(isPresent)
  }, [dishItems, hotNewItems])
}

export const HomePageFeed = memo(
  graphql(function HomePageFeed(props: HomeFeedProps) {
    const { region, isActive, center, span } = props
    const items = useHomeFeed(props)
    const isLoading = !region || items[0]?.id === null
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

    const contents = useMemo(() => {
      return items.map((item) => {
        console.warn('GETTING NEW??')
        switch (item.type) {
          case 'new':
          case 'hot':
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
          default:
            return null
        }
      })
    }, [items])

    const feedContents = useMemo(() => {
      return contents.map((content, index) => {
        const item = items[index]
        return (
          <Hoverable
            key={item.id}
            onHoverIn={() => {
              setHovered(item.id)
            }}
          >
            {content}
          </Hoverable>
        )
      })
    }, [contents])

    return (
      <>
        {isLoading && (
          <>
            <LoadingItems />
            <LoadingItems />
          </>
        )}

        {!isLoading && <Suspense fallback={null}>{feedContents}</Suspense>}
      </>
    )
  })
)
