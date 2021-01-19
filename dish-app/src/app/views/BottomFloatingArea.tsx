import { useStoreInstance } from '@dish/use-store'
import React, { useMemo } from 'react'
import { AbsoluteVStack, HStack, useMedia } from 'snackui'

import { drawerStore } from '../drawerStore'
import { useSafeArea } from '../hooks/useSafeArea'

export function BottomFloatingArea(props: { children: any }) {
  const drawer = useStoreInstance(drawerStore)
  const children = useMemo(() => props.children, [props.children])
  const safeArea = useSafeArea()
  const media = useMedia()
  return (
    <AbsoluteVStack
      zIndex={1000000000}
      pointerEvents="none"
      bottom={
        20 + (media.sm ? safeArea.bottom + drawer.bottomOccluded - 400 : 0)
      }
      right={20}
      left={20}
    >
      <HStack pointerEvents="auto">{children}</HStack>
    </AbsoluteVStack>
  )
}
