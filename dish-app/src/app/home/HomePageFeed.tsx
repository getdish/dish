import { RestaurantOnlyIds, graphql } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import React, { Suspense, memo, useMemo, useState } from 'react'
import { Hoverable, LoadingItems, Spacer } from 'snackui'

import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { HomeStateItemHome } from '../../types/homeTypes'
import { useSetAppMap } from '../AppMapStore'
import { useHomeStateById } from '../homeStore'
import { FIBase } from './FIBase'
import { FICuisine, HomeFeedCuisineItem } from './HomeFeedCuisineItem'
import {
  FIDishRestaurants,
  HomeFeedDishRestaurants,
  useFeedDishItems,
} from './HomeFeedDishRestaurants'
import { FIList, HomeFeedLists } from './HomeFeedLists'
import { HomeFeedProps } from './HomeFeedProps'
import { FIHotNew, HomeFeedTrendingNew, useHomeFeedTrendingNew } from './HomeFeedTrendingNew'

type FISpace = FIBase & {
  type: 'space'
}

type FI = FICuisine | FIDishRestaurants | FIList | FIHotNew | FISpace

function useHomeFeed(props: HomeFeedProps): FI[] {
  const { item, region } = props
  const dishItems = useFeedDishItems(region)
  const hotNewItems = useHomeFeedTrendingNew(props)
  return useMemo(() => {
    const [newest, hottest] = hotNewItems
    return [
      {
        id: 'list-0',
        type: 'list',
        region: item.region,
        title: `Lists`,
      } as FIList,
      {
        id: 'space',
        type: 'space',
      } as const,
      ...dishItems.slice(0, 1),
      hottest,
      {
        id: 'space',
        type: 'space',
      } as const,
      ...dishItems.slice(1, 2),
      newest,
      {
        id: 'space',
        type: 'space',
      } as const,
      ...dishItems.slice(2),
    ].filter(isPresent)
  }, [dishItems, hotNewItems])
}

export const HomePageFeed = memo(
  graphql(function HomePageFeed(props: HomeFeedProps) {
    const { item, isActive } = props
    const { region, center, span } = useHomeStateById<HomeStateItemHome>(item.id)
    const items = useHomeFeed(props)
    const isLoading = !!(!region || !items[0]?.id)
    const [hovered, setHovered] = useState<null | string>(null)
    const [hoveredResults, setHoveredResults] = useState<null | {
      via: FI['type']
      results: RestaurantOnlyIds[]
    }>(null)

    const results = useMemo(() => {
      return items.flatMap((x) => {
        if (hovered && hovered !== x.id) {
          return []
        }
        if (hoveredResults?.via === x.type) {
          return hoveredResults.results
        }
        if ('restaurants' in x) {
          return x.restaurants.map(getRestaurantIdentifiers)
        }
        return []
      })
    }, [items, hoveredResults])

    useSetAppMap({
      isActive,
      results,
      center,
      span,
    })

    const contents = useMemo(() => {
      return items.map((item) => {
        switch (item.type) {
          case 'space':
            return <Spacer size="xl" />
          case 'new':
          case 'hot':
            return (
              <HomeFeedTrendingNew
                {...item}
                onHoverResults={(results) => {
                  setHoveredResults({ via: item.type, results })
                }}
              />
            )
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
            key={item.id + index}
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
          </>
        )}

        {!isLoading && <Suspense fallback={null}>{feedContents}</Suspense>}
      </>
    )
  })
)
