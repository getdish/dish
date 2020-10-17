import { graphql, order_by, query } from '@dish/graph'
import { Store, useStore } from '@dish/use-store'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { HStack, Text, VStack, useDebounceValue } from 'snackui'

import { useQueryPaginated } from '../../hooks/useQueryPaginated'
import { AdminListItem } from './AdminListItem'
import { AdminSearchableColumn } from './AdminSearchableColumn'
import { PaginationNav } from './PaginationNav'
import { VerticalColumn } from './VerticalColumn'

export class AdminUsersStore extends Store {
  selectedUserId = ''

  setSelectedUserId(val: string) {
    this.selectedUserId = val
  }
}

export default graphql(() => {
  return (
    <VStack flex={1} overflow="hidden" width="100%">
      <HStack overflow="hidden" width="100%" flex={1}>
        <ScrollView horizontal>
          <HStack>
            <VerticalColumn>
              <UsersList />
            </VerticalColumn>
            <VerticalColumn width={400} maxWidth={400} padding={20}>
              <UserDisplay />
            </VerticalColumn>
          </HStack>
        </ScrollView>
      </HStack>
    </VStack>
  )
})

const UsersList = () => {
  const [searchRaw, setSearch] = useState('')
  const search = useDebounceValue(searchRaw, 100)
  return (
    <AdminSearchableColumn title="Places" onChangeSearch={(x) => setSearch(x)}>
      <UsersListContent search={search} />
    </AdminSearchableColumn>
  )
}

const UsersListContent = graphql(({ search }: { search: string }) => {
  const adminStore = useStore(AdminUsersStore)
  const perPage = 50
  const { results, total, totalPages, page, setPage } = useQueryPaginated({
    perPage,
    query: query.user,
    queryAggregate: query.user_aggregate,
    params: {
      where: {
        ...(!!search && {
          username: {
            _ilike: `%${search}%`,
          },
        }),
      },
      order_by: [
        {
          created_at: order_by.asc,
        },
      ],
    },
  })
  return (
    <ScrollView style={{ paddingBottom: 100 }}>
      <PaginationNav totalPages={totalPages} setPage={setPage} page={page} />
      <HStack
        paddingVertical={2}
        alignItems="center"
        justifyContent="center"
        borderBottomColor="#ddd"
        borderBottomWidth={1}
      >
        <Text opacity={0.5}>{total} total</Text>
      </HStack>
      {results.map((item, row) => {
        return (
          <AdminListItem
            key={item.id}
            text={item.username ?? 'no name'}
            id="reviews"
            row={row}
            column={0}
            onSelect={() => {
              adminStore.setSelectedUserId(item.id)
            }}
          />
        )
      })}
    </ScrollView>
  )
})

const UserDisplay = graphql(() => {
  const adminStore = useStore(AdminUsersStore)

  if (!adminStore.selectedUserId) {
    return null
  }

  const user = query.user({
    where: {
      id: {
        _eq: adminStore.selectedUserId,
      },
    },
  })[0]

  return (
    <>
      {!user && <Text>No User Selected</Text>}
      {!!user && (
        <ScrollView>
          <VStack spacing={10}>
            <Text>username: {user.username}</Text>
            <Text>username: {user.email}</Text>
            <Text>has_onboarded: {user.has_onboarded}</Text>
          </VStack>
        </ScrollView>
      )}
    </>
  )
})
