import { series, sleep } from '@dish/async'
import { graphql, query, resolved, useRefetch } from '@dish/graph'
import { Loader } from '@dish/react-feather'
import { debounce } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Input, Spacer, Text, VStack, useDebounce, useTheme } from 'snackui'

import { blue } from '../../../constants/colors'
import { AutocompleteItemFull } from '../../../helpers/createAutocomplete'
import { createRestaurantAutocomplete } from '../../../helpers/createRestaurantAutocomplete'
import { useRegionQuery } from '../../../helpers/fetchRegion'
import { getFuzzyMatchQuery } from '../../../helpers/getFuzzyMatchQuery'
import { searchRestaurants } from '../../../helpers/searchRestaurants'
import { queryList } from '../../../queries/queryList'
import { RegionApiResponse } from '../../../types/homeTypes'
import { appMapStore } from '../../AppMap'
import { AutocompleteItemView } from '../../AutocompleteItemView'
import { SlantedTitle } from '../../views/SlantedTitle'

const searchRestaurantsInBBox = async (bbox: RegionApiResponse['bbox'], searchQuery: string) => {
  return await resolved(() => {
    return query
      .restaurant({
        where: {
          location: {
            _st_within: bbox,
          },
          name: {
            _ilike: getFuzzyMatchQuery(searchQuery),
          },
        },
        limit: 20,
      })
      .map(createRestaurantAutocomplete)
  })
}

const searchRestaurantsNearby = async (searchQuery: string) => {
  const { center, span } = appMapStore.nextPosition
  const closeSpan = {
    lng: Math.max(0.1, span.lng),
    lat: Math.max(0.1, span.lat),
  }
  const close = await resolved(() => searchRestaurants(searchQuery, center, closeSpan))
  const further =
    close.length < 5
      ? await resolved(() =>
          searchRestaurants(searchQuery, center, {
            lng: closeSpan.lng * 2.5,
            lat: closeSpan.lat * 2.5,
          })
        )
      : []
  return [...(close || []), ...(further || [])]
}

export const ListAddRestuarant = graphql(
  ({ onAdd, listSlug }: { onAdd: (id: string) => any; listSlug: string }) => {
    const refetch = useRefetch()
    const listQuery = queryList(listSlug)
    const list = listQuery[0]
    const listRegion = list.region
    const region = useRegionQuery(listRegion)
    const bbox = region.data?.bbox
    const theme = useTheme()
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState<AutocompleteItemFull[]>([])
    const [searchQuery, setQuery] = useState('')
    const [addedState, setAddedState] = useState({})

    const added = {
      ...Object.fromEntries(list.restaurants({ limit: 300 }).map((x) => [x.restaurant.id, true])),
      ...addedState,
    }

    console.log('added', added, addedState)

    useEffect(() => {
      const dispose = series([
        () => {
          setIsSearching(true)
        },
        () => sleep(250),
        () =>
          Promise.all([
            bbox ? searchRestaurantsInBBox(bbox, searchQuery) : null,
            searchRestaurantsNearby(searchQuery),
          ]),
        ([boxRes = [], nearbyRes = []]) => {
          setResults([...boxRes, ...nearbyRes])
          setIsSearching(false)
        },
      ])

      return () => {
        dispose()
        setIsSearching(false)
      }
    }, [searchQuery, bbox])

    const onAddCb = debounce(async (result: any, index: number) => {
      const id = result.id
      setAddedState((x) => {
        const res = {
          ...x,
          [id]: !added[id],
        }
        console.log('res', index, result.id, res)
        return res
      })
      await onAdd(id)
      refetch(listQuery)
    }, 16)

    return (
      <VStack width="100%" height="100%" flex={1}>
        <SlantedTitle size="sm" alignSelf="center" marginTop={-15}>
          Add
        </SlantedTitle>
        <VStack width="100%" flexShrink={0}>
          <Input
            backgroundColor={theme.backgroundColorSecondary}
            marginHorizontal={20}
            placeholder="Search restaurants..."
            onChangeText={setQuery}
          />
          <Spacer size="sm" />
        </VStack>
        <ScrollView style={{ width: '100%', flex: 1 }}>
          <VStack>
            {isSearching && (
              <VStack className="rotating" margin="auto" marginVertical={20}>
                <Loader size={16} color={blue} />
              </VStack>
            )}
            {!isSearching && (
              <>
                {!results.length && <Text>No results found, try zooming map out</Text>}
                {results.map((result, index) => {
                  return (
                    <AutocompleteItemView
                      preventNavigate
                      hideIcon
                      key={result.id ?? index}
                      hideBackground
                      onSelect={() => onAddCb(result, index)}
                      target="search"
                      showAddButton
                      index={index}
                      result={result}
                      onAdd={() => onAddCb(result, index)}
                      isAdded={added[result.id]}
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
