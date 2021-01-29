import { series, sleep } from '@dish/async'
import { graphql, query, resolved, search, useLazyQuery } from '@dish/graph'
import { Loader } from '@dish/react-feather'
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { Input, Text, VStack, useDebounce, useTheme } from 'snackui'

import { blue } from '../../../constants/colors'
import {
  AutocompleteItemFull,
  AutocompleteItemRestuarant,
} from '../../../helpers/createAutocomplete'
import { searchRestaurants } from '../../../helpers/searchRestaurants'
import { useIsMountedRef } from '../../../helpers/useIsMountedRef'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { AutocompleteItemView } from '../../AppAutocomplete'
import { appMapStore } from '../../AppMapStore'
import { SlantedTitle } from '../../views/SlantedTitle'

export const ListAddRestuarant = graphql(
  ({
    onAdd,
    listSlug,
  }: {
    onAdd: (r: { id: string }) => any
    listSlug: string
  }) => {
    const theme = useTheme()
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState<AutocompleteItemFull[]>([])
    const [searchQuery, setQuery] = useState('')

    useEffect(() => {
      const dispose = series([
        () => {
          setIsSearching(true)
        },
        () => sleep(300),
        () => {
          return resolved(() => {
            const { center, span } = appMapStore.nextPosition
            return searchRestaurants(searchQuery, center, {
              lng: Math.max(0.1, span.lng),
              lat: Math.max(0.1, span.lat),
            })
          })
        },
        (restaurants) => {
          setResults(restaurants)
          setIsSearching(false)
        },
      ])

      return () => {
        dispose()
        setIsSearching(false)
      }
    }, [searchQuery])

    return (
      <VStack width="100%" height="100%" flex={1}>
        <SlantedTitle alignSelf="center" marginTop={-15}>
          Add
        </SlantedTitle>
        <VStack width="100%">
          <Input
            backgroundColor={theme.backgroundColorSecondary}
            marginHorizontal={20}
            placeholder="Search restaurants..."
            onChangeText={setQuery}
          />
        </VStack>
        <ScrollView style={{ width: '100%' }}>
          <VStack padding={20} spacing="xs">
            {isSearching && (
              <VStack className="rotating" margin="auto" marginVertical={20}>
                <Loader size={16} color={blue} />
              </VStack>
            )}
            {!isSearching && (
              <>
                {!results.length && (
                  <Text>No results found, try zooming map out</Text>
                )}
                {results.map((result, index) => {
                  return (
                    <AutocompleteItemView
                      preventNavigate
                      key={result.id ?? index}
                      hideBackground
                      onSelect={() => {}}
                      target="search"
                      showAddButton
                      index={index}
                      result={result}
                      onAdd={async () => {
                        const slug = result.id
                        const id = await resolved(
                          () => queryRestaurant(slug)[0].id
                        )
                        onAdd({ id })
                      }}
                    />
                  )
                })}
              </>
            )}
          </VStack>
        </ScrollView>
      </VStack>
    )
  }
)

// let [runSearch, { isLoading }] = useLazyQuery(
//   // @ts-expect-error
//   (_query, searchQuery: string) => {
//     const restaurants = query.restaurant({
//       where: {
//         name: {
//           _ilike: `%${searchQuery.split(' ').join('%')}%`,
//         },
//       },
//       limit: 20,
//     })
//     return restaurants.map((restaurant) => {
//       return {
//         type: 'restaurant',
//         name: restaurant.name,
//         slug: restaurant.slug,
//         description: restaurant.address,
//         icon: restaurant.image,
//       } as const
//     })
//   },
//   {
//     onCompleted: setResults,
//   }
// )
