import { NavigableItems, NavigateItem, RoutesTable } from '@dish/router'

import { router } from '../router'

export function getShouldNavigate(navItem: NavigateItem<RoutesTable, NavigableItems<RoutesTable>>) {
  return router.getShouldNavigate(navItem as any)
}
