import { series, sleep } from '@dish/async'
import { graphql, query, resolved } from '@dish/graph'
import { Loader } from '@dish/react-feather'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Input, Text, VStack, useTheme } from 'snackui'

import { blue } from '../../../constants/colors'
import { AutocompleteItemFull } from '../../../helpers/createAutocomplete'
import { createRestaurantAutocomplete } from '../../../helpers/createRestaurantAutocomplete'
import { useRegionQuery } from '../../../helpers/fetchRegion'
import { getFuzzyMatchQuery } from '../../../helpers/getFuzzyMatchQuery'
import { searchRestaurants } from '../../../helpers/searchRestaurants'
import { queryList } from '../../../queries/queryList'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { AutocompleteItemView } from '../../AppAutocomplete'
import { appMapStore } from '../../AppMapStore'
import { SlantedTitle } from '../../views/SlantedTitle'

export const ListAddRestuarant = graphql(
  ({ onAdd, listSlug }: { onAdd: (r: { id: string }) => any; listSlug: string }) => {
    const [list] = queryList(listSlug)
    const listRegion = list.region
    const region = useRegionQuery(listRegion)
    const bbox = region.data?.bbox
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
        async () => {
          if (bbox) {
            // search in region
            // TODO can allow a bit outside the region
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
          } else {
            const { center, span } = appMapStore.nextPosition
            return searchRestaurants(searchQuery, center, {
              lng: Math.max(0.1, span.lng),
              lat: Math.max(0.1, span.lat),
            })
          }
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
    }, [searchQuery, bbox])

    const resultsItems = useMemo(() => {
      return results.map((result, index) => {
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
              const id = await resolved(() => queryRestaurant(slug)[0]?.id)
              onAdd({ id })
            }}
          />
        )
      })
    }, [results])

    return (
      <VStack width="100%" height="100%" flex={1}>
        <SlantedTitle alignSelf="center" marginTop={-15}>
          Add
        </SlantedTitle>
        <VStack width="100%" flexShrink={0}>
          <Input
            backgroundColor={theme.backgroundColorSecondary}
            marginHorizontal={20}
            placeholder="Search restaurants..."
            onChangeText={setQuery}
          />
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
                {resultsItems}
              </>
            )}
          </VStack>
        </ScrollView>
      </VStack>
    )
  }
)
