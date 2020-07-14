import { HStack, SmallTitle, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { Route, RouteSwitch } from '../../views/router/Route'
import { Link } from '../../views/ui/Link'

export default memo(function AdminPage() {
  return (
    <VStack flex={1} alignItems="center">
      <HStack backgroundColor="#eee" width="100%" spacing={20} padding={5}>
        <Link name="admin">
          <Text fontWeight="700">Admin</Text>
        </Link>
        <Link name="home">Dish ⤴️</Link>
        <Link name="adminTags">Tags</Link>
      </HStack>
      <RouteSwitch>
        <Route name="adminTags">{() => <AdminTagsPage />}</Route>
        <Route name="admin">
          <SmallTitle>Welcome to admin</SmallTitle>
        </Route>
      </RouteSwitch>
    </VStack>
  )
})

const AdminTagsPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./AdminTagsPage').default
    : React.lazy(() => import('./AdminTagsPage'))
