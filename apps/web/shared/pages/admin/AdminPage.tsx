import { VStack } from '@dish/ui'
import React, { memo } from 'react'

import { Route } from '../../views/router/Route'

export default memo(function AdminPage() {
  return (
    <VStack flex={1} alignItems="center">
      <Route name="adminDishes">{() => <AdminDishes />}</Route>
    </VStack>
  )
})

const AdminDishes =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./AdminDishesPage').default
    : React.lazy(() => import('./AdminDishesPage'))
