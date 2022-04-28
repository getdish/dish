import { defaultLocationAutocompleteResults } from '../../constants/defaultLocationAutocompleteResults'
import { AutocompleteItem } from '../../helpers/createAutocomplete'
import { locationToAutocomplete, searchLocations } from '../../helpers/searchLocations'
import { SmallTitle } from '../views/SmallTitle'
import { AdminListItem } from './AdminListItem'
import { AdminSearchableColumn } from './AdminSearchableColumn'
import { VerticalColumn } from './VerticalColumn'
import { graphql, order_by, query } from '@dish/graph'
import { fetchBertSentiment } from '@dish/helpers'
import { Separator, Text, XStack, YStack, useDebounceValue } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { useEffect, useState } from 'react'
import { ScrollView, TextInput } from 'react-native'

export class AdminRestaurantStore extends Store {
  selectedCity: AutocompleteItem | null = null
  selectedRestaurantId = ''
  selectedPlaceId = ''

  setSelectedRestaurantId(val: string) {
    this.selectedRestaurantId = val
  }

  setSelectedPlaceId(val: string) {
    this.selectedPlaceId = val
  }

  setSelectedCity(val: AutocompleteItem | null) {
    this.selectedCity = val
  }
}

export default graphql(() => {
  return (
    <YStack flex={1} overflow="hidden" width="100%">
      <XStack overflow="hidden" width="100%" flex={1}>
        <ScrollView horizontal>
          <XStack>
            <VerticalColumn>
              <PlacesList />
            </VerticalColumn>
            <VerticalColumn>
              <RestaurantList />
            </VerticalColumn>
            <VerticalColumn>
              <PlaceList />
            </VerticalColumn>
            <VerticalColumn width={400} maxWidth={400} padding={20}>
              <PlaceDisplay />
            </VerticalColumn>
          </XStack>
        </ScrollView>

        {/* <VerticalColumn>
          <Suspense fallback={<LoadingItems />}>
            <TagEditColumn />
          </Suspense>
        </VerticalColumn> */}
      </XStack>
    </YStack>
  )
})

const PlaceDisplay = graphql(() => {
  const adminStore = useStore(AdminRestaurantStore)
  const [place] = adminStore.selectedPlaceId
    ? query.restaurant({
        where: {
          id: {
            _eq: adminStore.selectedPlaceId,
          },
        },
      })
    : []

  return (
    <>
      {!place && <Text>No Place Selected</Text>}
      {!!place && (
        <ScrollView>
          <YStack space={10}>
            <Text>rating: {place.rating}</Text>
            <Text>username: {place.city}</Text>
            <Text>text: {place.address}</Text>

            <Separator />
          </YStack>
        </ScrollView>
      )}
    </>
  )
})

const Restaurantentiment = (props: { text: string }) => {
  const [aspect, setAspect] = useState('')
  const aspectSlow = useDebounceValue(aspect, 500)
  const [sentiments, setSentiments] = useState([])

  useEffect(() => {
    if (!aspectSlow) return
    const sentences = props.text.split('. ')
    if (sentences.length) {
      Promise.all([
        fetchBertSentiment(props.text).then((response) => {
          return {
            sentiment: response.positive,
            sentence: `(Entire Text - ${aspect})`,
          }
        }),
        ...sentences
          .filter((x) => x.toLowerCase().includes(aspect))
          .map((sentence) => {
            return fetchBertSentiment(sentence).then((response) => {
              return {
                sentiment: response.positive,
                sentence: sentence,
              }
            })
          }),
      ]).then((sentiments) => {
        console.log(sentiments)
        setSentiments(sentiments as any)
      })
    }
  }, [aspectSlow])

  return (
    <YStack space="$6">
      <SmallTitle>Sentiment</SmallTitle>

      <TextInput style={{ borderWidth: 1, padding: 5 }} onChangeText={(text) => setAspect(text)} />

      <Separator />

      {sentiments.map(({ sentiment, sentence }) => {
        return (
          <Text backgroundColor={sentiment === 'Negative' ? '$red10' : '$green10'} key={sentence}>
            {sentence} <strong>({sentiment})</strong>.
          </Text>
        )
      })}
    </YStack>
  )
}

const PlacesList = () => {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 100)
  return (
    <AdminSearchableColumn title="Places" onChangeSearch={(x) => setSearch(x)}>
      <PlacesListContent column={0} search={search} />
    </AdminSearchableColumn>
  )
}

const defaultPlaces: AutocompleteItem[] = [
  {
    name: 'All',
    type: 'orphan',
  },
  ...defaultLocationAutocompleteResults,
]

const PlacesListContent = graphql(({ search, column }: { search: string; column: number }) => {
  const adminStore = useStore(AdminRestaurantStore)
  const [results, setResults] = useState<AutocompleteItem[]>(defaultPlaces)

  useEffect(() => {
    let cancelled = false
    searchLocations(search).then((locations) => {
      if (!cancelled) {
        setResults([...defaultPlaces, ...locations.map(locationToAutocomplete)])
      }
    })
    return () => {
      cancelled = true
    }
  }, [search])

  return (
    <ScrollView style={{ paddingBottom: 100 }}>
      {results.map((item, row) => {
        return (
          <AdminListItem
            key={item.name + row}
            text={item.name ?? 'no name'}
            id="restaurant"
            row={row}
            column={column}
            onSelect={() => {
              if (item.type === 'orphan') {
                adminStore.setSelectedCity(null)
              } else {
                adminStore.setSelectedCity(item)
              }
            }}
          />
        )
      })}
    </ScrollView>
  )
})

const RestaurantList = () => {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 100)
  return (
    <AdminSearchableColumn title="Restaurants" onChangeSearch={(x) => setSearch(x)}>
      <RestaurantsListContent column={1} search={search} />
    </AdminSearchableColumn>
  )
}

const RestaurantsListContent = graphql(({ search, column }: { search: string; column: number }) => {
  const adminStore = useStore(AdminRestaurantStore)
  const { selectedCity } = adminStore
  const limit = 200
  const [page, setPage] = useState(1)
  const results = query.restaurant({
    where: {
      name: {
        ...(!!search && {
          _ilike: `%${search}%`,
        }),
        _neq: '',
      },
      ...(selectedCity &&
        'center' in selectedCity && {
          location: {
            _st_d_within: {
              // search outside current bounds a bit
              distance: 1,
              from: {
                type: 'Point',
                coordinates: [selectedCity.center?.lng, selectedCity.center?.lat],
              },
            },
          },
        }),
    },
    limit: limit,
    offset: (page - 1) * limit,
    order_by: [
      {
        name: order_by.asc,
      },
    ],
  })

  return (
    <ScrollView style={{ paddingBottom: 100 }}>
      {results.map((item, index) => {
        return (
          <AdminListItem
            key={item.id}
            text={item.name ?? 'no name'}
            id="restaurant"
            row={index}
            column={column}
            onSelect={() => {
              adminStore.setSelectedRestaurantId(item.id)
            }}
          />
        )
      })}

      {results.length === limit && (
        <XStack
          height={32}
          padding={6}
          hoverStyle={{
            backgroundColor: '#f2f2f2',
          }}
          onPress={() => {
            setPage((x) => x + 1)
          }}
        >
          <Text>Next page</Text>
        </XStack>
      )}
    </ScrollView>
  )
})

const PlaceList = () => {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 100)
  return (
    <AdminSearchableColumn title="Restaurant" onChangeSearch={(x) => setSearch(x)}>
      {/* <Suspense fallback="Loading...xd"> */}
      <PlaceListContent search={search} column={2} />
      {/* </Suspense> */}
    </AdminSearchableColumn>
  )
}

const PlaceListContent = graphql(({ search, column }: { search: string; column: number }) => {
  const adminStore = useStore(AdminRestaurantStore)
  const limit = 200
  const [page, setPage] = useState(1)
  const results = query.restaurant({
    where: {
      ...(!!adminStore.selectedRestaurantId && {
        id: {
          _eq: adminStore.selectedRestaurantId,
        },
      }),
      ...(!!search && {
        text: {
          _ilike: `%${search}%`,
          _neq: '',
        },
      }),
    },
    limit: limit,
    offset: (page - 1) * limit,
    order_by: [
      {
        id: order_by.asc,
      },
    ],
  })

  return (
    <ScrollView style={{ paddingBottom: 100 }}>
      {results.map((item, row) => {
        return (
          <AdminListItem
            key={item.id}
            text={`${item.name} - ${item.address}`}
            id="restaurant"
            row={row}
            column={column}
            onSelect={() => {
              adminStore.setSelectedPlaceId(item.id)
            }}
          />
        )
      })}

      {results.length === limit && (
        <XStack
          height={32}
          padding={6}
          hoverStyle={{
            backgroundColor: '#f2f2f2',
          }}
          onPress={() => {
            setPage((x) => x + 1)
          }}
        >
          <Text>Next page</Text>
        </XStack>
      )}
    </ScrollView>
  )
})
