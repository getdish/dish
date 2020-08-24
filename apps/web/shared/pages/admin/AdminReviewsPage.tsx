import { graphql, order_by, query } from '@dish/graph'
import { HStack, Text, VStack, useDebounceValue } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'

import { defaultLocationAutocompleteResults } from '../../state/defaultLocationAutocompleteResults'
import { AutocompleteItem } from '../../state/home-types'
import {
  locationToAutocomplete,
  searchLocations,
} from '../home/searchLocations'
import { AdminListItem } from './AdminListItem'
import { AdminSearchableColumn } from './AdminSearchableColumn'
import { VerticalColumn } from './VerticalColumn'

export class AdminReviewsStore extends Store {
  selectedCity: AutocompleteItem | null = null
  selectedRestaurantId = ''
  selectedReviewId = ''

  setSelectedRestaurantId(val: string) {
    this.selectedRestaurantId = val
  }

  setSelectedReviewId(val: string) {
    this.selectedReviewId = val
  }

  setSelectedCity(val: AutocompleteItem) {
    this.selectedCity = val
  }
}

export default graphql(() => {
  return (
    <VStack flex={1} overflow="hidden" width="100%">
      <HStack overflow="hidden" width="100%" flex={1}>
        <ScrollView horizontal>
          <HStack>
            <VerticalColumn>
              <PlacesList />
            </VerticalColumn>
            <VerticalColumn>
              <RestaurantList />
            </VerticalColumn>
            <VerticalColumn>
              <ReviewList />
            </VerticalColumn>
            <VerticalColumn width={400} maxWidth={400} padding={20}>
              <ReviewDisplay />
            </VerticalColumn>
          </HStack>
        </ScrollView>

        {/* <VerticalColumn>
          <Suspense fallback={<LoadingItems />}>
            <TagEditColumn />
          </Suspense>
        </VerticalColumn> */}
      </HStack>
    </VStack>
  )
})

const ReviewDisplay = graphql(() => {
  const adminStore = useStore(AdminReviewsStore)
  console.log('adminStore.selectedReviewId', adminStore.selectedReviewId)
  const [review] = adminStore.selectedReviewId
    ? query.review({
        where: {
          id: {
            _eq: adminStore.selectedReviewId,
          },
        },
      })
    : []

  return (
    <>
      {!review && <Text>No Review Selected</Text>}
      {!!review && (
        <VStack>
          <Text>{review.rating}</Text>
          <Text>{review.username}</Text>
          <Text>{review.sentiments}</Text>
          <Text>{review.text}</Text>
          <Text>{review.categories}</Text>
        </VStack>
      )}
    </>
  )
})

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
    type: 'all',
  },
  ...defaultLocationAutocompleteResults,
]

const PlacesListContent = graphql(
  ({ search, column }: { search: string; column: number }) => {
    const adminStore = useStore(AdminReviewsStore)
    const [results, setResults] = useState<AutocompleteItem[]>(defaultPlaces)

    useEffect(() => {
      let cancelled = false
      searchLocations(search).then((locations) => {
        if (!cancelled) {
          setResults([
            ...defaultPlaces,
            ...locations.map(locationToAutocomplete),
          ])
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
              id="reviews"
              row={row}
              column={column}
              onSelect={() => {
                if (item.type === 'all') {
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
  }
)

const RestaurantList = () => {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 100)
  return (
    <AdminSearchableColumn
      title="Restaurants"
      onChangeSearch={(x) => setSearch(x)}
    >
      <RestaurantsListContent column={1} search={search} />
    </AdminSearchableColumn>
  )
}

const RestaurantsListContent = graphql(
  ({ search, column }: { search: string; column: number }) => {
    const adminStore = useStore(AdminReviewsStore)
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
        ...(selectedCity && {
          location: {
            _st_d_within: {
              // search outside current bounds a bit
              distance: 1,
              from: {
                type: 'Point',
                coordinates: [selectedCity.center.lng, selectedCity.center.lat],
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
              id="reviews"
              row={index}
              column={column}
              onSelect={() => {
                adminStore.setSelectedRestaurantId(item.id)
              }}
            />
          )
        })}

        {results.length === limit && (
          <HStack
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
          </HStack>
        )}
      </ScrollView>
    )
  }
)

const ReviewList = () => {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 100)
  return (
    <AdminSearchableColumn title="Reviews" onChangeSearch={(x) => setSearch(x)}>
      <ReviewListContent search={search} column={2} />
    </AdminSearchableColumn>
  )
}

const ReviewListContent = graphql(
  ({ search, column }: { search: string; column: number }) => {
    const adminStore = useStore(AdminReviewsStore)
    const limit = 200
    const [page, setPage] = useState(1)
    const results = query.review({
      where: {
        ...(!!adminStore.selectedRestaurantId && {
          restaurant_id: {
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
              text={`${item.user.username ?? 'no name'} - ${item.text?.slice(
                0,
                100
              )}`}
              id="reviews"
              row={row}
              column={column}
              onSelect={() => {
                adminStore.setSelectedReviewId(item.id)
              }}
            />
          )
        })}

        {results.length === limit && (
          <HStack
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
          </HStack>
        )}
      </ScrollView>
    )
  }
)
