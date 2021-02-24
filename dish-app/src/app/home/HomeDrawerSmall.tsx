import { series, sleep } from '@dish/async'
import { useStoreInstance } from '@dish/use-store'
import React, { useEffect } from 'react'

import { autocompletesStore } from '../AppAutocomplete'
import { drawerStore } from '../drawerStore'
import { HomeDrawerSmallView } from './HomeDrawerSmallView'

export const HomeDrawerSmall = (props: { children: any }) => {
  const autocompletes = useStoreInstance(autocompletesStore)

  useEffect(() => {
    return series([
      () => sleep(200),
      () => {
        if (autocompletes.visible) {
          drawerStore.setSnapIndex(0)
        } else {
          drawerStore.setSnapIndex(1)
        }
      },
    ])
  }, [autocompletes.visible])

  return (
    <>
      <HomeDrawerSmallView {...props} />
    </>
  )
}
