import { useStoreInstance } from '@dish/use-store'
import React, { useEffect } from 'react'

import { autocompletesStore } from './AppAutocomplete'
import { AppSmallDrawerView } from './AppSmallDrawerView'
import { drawerStore } from './BottomDrawerStore'

export const AppSmallDrawer = (props: { children: any }) => {
  const autocompletes = useStoreInstance(autocompletesStore)

  useEffect(() => {
    if (autocompletes.visible) {
      drawerStore.setSnapPoint(0)
    } else {
      drawerStore.setSnapPoint(1)
    }
  }, [autocompletes.visible])

  return (
    <>
      <AppSmallDrawerView {...props} />
    </>
  )
}
