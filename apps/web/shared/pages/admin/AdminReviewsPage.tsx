import { LngLat, graphql, order_by, query } from '@dish/graph'
import { HStack, Text, VStack, useDebounceValue } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { memo, useEffect, useState } from 'react'
import { ScrollView } from 'react-native'

import { sanFrancisco } from '../../state/defaultLocationAutocompleteResults'
import { GeocodePlace } from '../../state/home-types'
import { searchLocations } from '../home/searchLocations'
import { AdminListItem } from './AdminListItem'
import { AdminSearchableColumn } from './AdminSearchableColumn'
import { useRowStore } from './SelectionStore'
import { VerticalColumn } from './VerticalColumn'

export class AdminReviewsStore extends Store {
  selectedCityCenter: LngLat = sanFrancisco.center
  selectedRestaurantId = ''
  selectedReviewId = ''

  setSelectedRestaurantId(val: string) {
    this.selectedRestaurantId = val
  }

  setSelectedReviewId(val: string) {
    this.selectedReviewId = val
  }

  setSelectedCityCenter(val: LngLat) {
    this.selectedCityCenter = val
  }
}

export default graphql(function AdminReviewsPage() {
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

const PlacesList = () => {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 100)
  return (
    <AdminSearchableColumn title="Places" onChangeSearch={(x) => setSearch(x)}>
      <PlacesListContent column={0} search={search} />
    </AdminSearchableColumn>
  )
}

const PlacesListContent = graphql(
  ({ search, column }: { search: string; column: number }) => {
    const adminStore = useStore(AdminReviewsStore)
    const [results, setResults] = useState<GeocodePlace[]>([])

    useEffect(() => {
      let cancelled = false
      searchLocations(search).then((locations) => {
        if (!cancelled) {
          setResults(locations)
        }
      })
      return () => {
        cancelled = true
      }
    }, [search])

    return (
      <ScrollView style={{ paddingBottom: 100 }}>
        {results.map((item, index) => {
          return (
            <AdminListItem
              key={item.name + index}
              text={item.name ?? 'no name'}
              id="reviews"
              row={index}
              column={0}
              onSelect={() => {
                adminStore.setSelectedCityCenter({
                  lng: item.center[0],
                  lat: item.center[1],
                })
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
              deletable={index > 0}
              editable={index > 0}
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

const ReviewList = memo(
  graphql(() => {
    const [searchRaw, setSearch] = useState('')
    const search = useDebounceValue(searchRaw, 100)
    return (
      <AdminSearchableColumn
        title="Reviews"
        onChangeSearch={(x) => setSearch(x)}
      >
        <ReviewListContent search={search} column={3} />
      </AdminSearchableColumn>
    )
  })
)

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
                adminStore.selectedRestaurantId = item.id
              }}
              deletable={row > 0}
              editable={row > 0}
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
