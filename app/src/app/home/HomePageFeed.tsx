import { RestaurantOnlyIds, graphql } from '@dish/graph'
import React, { Suspense, memo, useMemo, useState } from 'react'
import { AbsoluteVStack, Hoverable, LoadingItems, Spacer, useDebounceEffect } from 'snackui'

import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { FIBase } from './FIBase'
import { FICuisine, HomeFeedCuisineItem } from './HomeFeedCuisineItem'
import { FIDishRestaurants, HomeFeedDishRestaurants } from './HomeFeedDishRestaurants'
import { FIList, HomeFeedLists } from './HomeFeedLists'
import { HomeFeedProps } from './HomeFeedProps'
import { FIHotNew, HomeFeedTrendingNew } from './HomeFeedTrendingNew'
import { homePageStore } from './homePageStore'

type FISpace = FIBase & {
  type: 'space' | 'dish-restaurants'
}

type FI = FICuisine | FIList | FIHotNew | FISpace

function getHomeFeed(props: HomeFeedProps): FI[] {
  const { item, region } = props
  return [
    {
      id: 'new',
      title: 'New Spots',
      type: 'new',
      size: 'sm',
    } as const,
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
    {
      id: 'hot',
      type: 'hot',
      title: 'Hot Spots',
      size: 'sm',
    } as const,
    {
      id: 'space',
      type: 'space',
    } as const,
    {
      id: 'dish-restaurants',
      type: 'dish-restaurants',
    } as const,
  ]
}

export const HomePageFeed = memo(
  graphql(
    function HomePageFeed(props: HomeFeedProps) {
      const { regionName } = props
      const items = getHomeFeed(props)
      const isLoading = !regionName || false
      // was trigger gqless infinite loops..
      //  ||
      // !items.every((item) =>
      //   item.type === 'cuisine'
      //     ? !!item.restaurants[0]?.id
      //     : item.type === 'dish-restaurants'
      //     ? !!item.tag
      //     : item.type === 'hot' || item.type === 'new'
      //     ? !!item.restaurants[0]?.id
      //     : true
      // )
      const [hovered, setHovered] = useState<null | string>(null)
      const [hoveredResults, setHoveredResults] = useState<null | {
        via: FI['type']
        results: RestaurantOnlyIds[]
      }>(null)

      useDebounceEffect(
        () => {
          const results = items.flatMap((x) => {
            if (hovered && hovered !== x.id) {
              return []
            }
            if (hoveredResults?.via === x.type) {
              return hoveredResults?.results
            }
            if ('restaurants' in x) {
              return x.restaurants.map(getRestaurantIdentifiers)
            }
            return []
          })
          // set results
          homePageStore.setResults(results)
        },
        150,
        [items, hoveredResults]
      )

      // const mapRegion = region
      //   ? ({
      //       slug: region.slug,
      //       name: region.name,
      //       geometry: region.bbox,
      //       via: 'click',
      //     } as const)
      //   : null

      const contents = useMemo(() => {
        return items.map((item) => {
          switch (item.type) {
            case 'space':
              return <Spacer size="xl" />
            case 'new':
            case 'hot':
              return (
                <HomeFeedTrendingNew
                  {...props}
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
            <AbsoluteVStack pointerEvents="none" zIndex={100} fullscreen>
              <LoadingItems />
            </AbsoluteVStack>
          )}

          {!isLoading && (
            <>
              <Suspense fallback={<LoadingItems />}>{feedContents}</Suspense>
            </>
          )}
        </>
      )
    },
    {
      suspense: false,
    }
  )
)
