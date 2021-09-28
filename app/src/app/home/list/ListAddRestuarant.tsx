import { series, sleep } from '@dish/async'
import { graphql, query, resolved, slugify, useRefetch } from '@dish/graph'
import { Loader } from '@dish/react-feather'
import { debounce, uniqBy } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Input, Spacer, Text, VStack, useDebounce, useTheme } from 'snackui'

import { blue } from '../../../constants/colors'
import { AutocompleteItemFull } from '../../../helpers/createAutocomplete'
import { createRestaurantAutocomplete } from '../../../helpers/createRestaurantAutocomplete'
import { useRegionQuery } from '../../../helpers/fetchRegion'
import { fuzzySearch } from '../../../helpers/fuzzySearch'
import { getFuzzyMatchQuery } from '../../../helpers/getFuzzyMatchQuery'
import { roundCoord } from '../../../helpers/mapHelpers'
import { searchRestaurants } from '../../../helpers/searchRestaurants'
import { queryList } from '../../../queries/queryList'
import { RegionApiResponse } from '../../../types/homeTypes'
import { geoSearch } from '../../../web/geosearch'
import { appMapStore } from '../../appMapStore'
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

    useEffect(() => {
      const dispose = series([
        () => {
          setIsSearching(true)
        },
        () => sleep(results.length ? 250 : 0),
        () =>
          Promise.all([
            // disable for now
            Promise.resolve([]),
            // searchQuery
            //   ? geoSearch({
            //       query: searchQuery,
            //       ...(appMapStore.nextPosition?.center || appMapStore.position?.center),
            //     })
            //   : Promise.resolve([]),
            bbox ? searchRestaurantsInBBox(bbox, searchQuery) : null,
            searchRestaurantsNearby(searchQuery),
          ]),
        async ([appleSearch = [], boxRes = [], nearbyRes = []]) => {
          const appleNormalized = (appleSearch.places || []).map((place) => {
            return {
              is: 'autocomplete',
              id: place.muid,
              name: place.name,
              slug: slugify(`apple-${place.name}`),
              type: 'restaurant',
              description: `${place.fullThoroughfare}`,
              key: `${place.fullThoroughfare?.split(' ')?.[0] || ''}-${roundCoord(
                place.coordinate.longitude,
                100
              )}-${roundCoord(place.coordinate.latitude, 100)}`,
              icon: '',
            }
          })
          const uniqueResults = uniqBy([...boxRes, ...nearbyRes, ...appleNormalized], (x) => x.key)
          return await fuzzySearch({
            items: uniqueResults,
            query: searchQuery,
            keys: ['name', 'description'],
          })
        },
        async (results) => {
          setResults(results)
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
            placeholder="Add restaurants..."
            autoFocus
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
