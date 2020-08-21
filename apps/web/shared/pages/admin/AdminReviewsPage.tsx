import { graphql, order_by, query } from '@dish/graph'
import { HStack, Text, VStack, useDebounceValue } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { memo, useState } from 'react'
import { ScrollView } from 'react-native'

import { AdminListItem } from './AdminListItem'
import { AdminSearchableColumn } from './AdminSearchableColumn'
import { useColumnSelection, useRowSelection } from './SelectionStore'
import { VerticalColumn } from './VerticalColumn'

export default graphql(function AdminReviewsPage() {
  return (
    <VStack flex={1} overflow="hidden" width="100%">
      <HStack overflow="hidden" width="100%" flex={1}>
        <ScrollView horizontal>
          <HStack>
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

const RestaurantList = () => {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 100)
  return (
    <AdminSearchableColumn
      title="Restaurants"
      onChangeSearch={(x) => setSearch(x)}
    >
      <RestaurantsListContent search={search} />
    </AdminSearchableColumn>
  )
}

export class ReviewStore extends Store {
  selectedRestaurantId = ''
  selectedReviewId = ''
}

const RestaurantsListContent = graphql(({ search }: { search: string }) => {
  const reviewStore = useStore(ReviewStore)
  const rowStore = useRowSelection({ id: 'reviews', column: 0 })
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

  console.log('what is', results, reviewStore)

  return (
    <ScrollView style={{ paddingBottom: 100 }}>
      {results.map((item, index) => {
        return (
          <AdminListItem
            key={item.id}
            text={item.name ?? 'no name'}
            id="reviews"
            row={index}
            column={0}
            onSelect={() => {
              reviewStore.selectedRestaurantId = item.id
              rowStore.setRow(index)
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
})

const ReviewList = memo(
  graphql(() => {
    const [searchRaw, setSearch] = useState('')
    const search = useDebounceValue(searchRaw, 100)
    return (
      <AdminSearchableColumn
        title="Reviews"
        onChangeSearch={(x) => setSearch(x)}
      >
        <ReviewListContent search={search} />
      </AdminSearchableColumn>
    )
  })
)

const ReviewListContent = graphql(({ search }: { search: string }) => {
  const reviewStore = useStore(ReviewStore)
  const limit = 200
  const [page, setPage] = useState(1)
  const results = query.review({
    where: {
      ...(!!reviewStore.selectedRestaurantId && {
        restaurant_id: reviewStore.selectedRestaurantId as any,
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
      {results.map((item, col) => {
        return (
          <AdminListItem
            key={item.id}
            text={`${item.user.username ?? 'no name'} - ${item.text?.slice(
              0,
              100
            )}`}
            id="reviews"
            row={0}
            column={col}
            onSelect={() => {
              reviewStore.selectedRestaurantId = item.id
            }}
            deletable={col > 0}
            editable={col > 0}
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
})
