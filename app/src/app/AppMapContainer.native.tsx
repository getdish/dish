import { AppMapSpotlight } from './AppMapSpotlight'
import { YStack } from '@dish/ui'
import React, { memo } from 'react'

export default memo(function AppMapContainer(props: { children: React.ReactNode }) {
  // TODO handle animations etc
  return (
    <YStack bc="green" fullscreen>
      <AppMapSpotlight />
      {props.children}
    </YStack>
  )
})
