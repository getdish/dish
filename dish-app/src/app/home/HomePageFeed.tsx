import { RestaurantOnlyIds, graphql } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import React, { Suspense, memo, useMemo, useState } from 'react'
import { Dimensions } from 'react-native'
import { LoadingItems, VStack, useTheme } from 'snackui'

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
  FIHot,
  FINew,
  HomeFeedTrendingNew,
  useHomeFeedTrendingNew,
} from './HomeFeedTrendingNew'
import { PageFooter } from './PageFooter'

type FI = FICuisine | FIDishRestaurants | FIList | FINew | FIHot

function useHomeFeed(props: HomeFeedProps): FI[] {
  const { item, region } = props
  const cuisineItems = useFeedTopCuisines(props)
  const dishItems = useFeedDishItems(region)
  const hotNewItems = useHomeFeedTrendingNew(props)
  return [
    {
      id: `0`,
      type: 'list',
      region: item.region,
      rank: -3,
      title: `Lists`,
    } as FIList,
    ...hotNewItems,
    ...cuisineItems,
    ...dishItems,
  ].filter(isPresent)
}

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
            case 'new':
            // return (
            //   <VStack width="100%" marginBottom={-50}>
            //     <HomeFeedTrendingNew {...item} />
            //   </VStack>
            // )
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
            paddingTop={5}
            marginTop={-5}
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
