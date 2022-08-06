import { AppMapSpotlight } from './AppMapSpotlight'
import { drawerStore } from './drawerStore'
import { YStack } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import React, { memo } from 'react'

export default memo(function AppMapContainer(props: { children: React.ReactNode }) {
  const drawer = useStoreInstance(drawerStore)
  const y = -300 + drawer.mapHeight / 2

  // TODO handle animations etc
  return (
    <YStack fullscreen y={y}>
      <AppMapSpotlight />
      {props.children}
    </YStack>
  )
})
