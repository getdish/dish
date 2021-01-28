import React, { useMemo } from 'react'
import { AbsoluteVStack, HStack, useMedia } from 'snackui'

import { useSafeArea } from '../hooks/useSafeArea'
import { PortalItem } from '../Portal'

export function BottomFloatingArea(props: { children: any }) {
  const children = useMemo(() => props.children, [props.children])
  const safeArea = useSafeArea()
  const media = useMedia()
  return (
    <PortalItem id={media.sm ? 'root' : 'drawer'}>
      <AbsoluteVStack
        zIndex={1000000000}
        pointerEvents="none"
        bottom={20 + safeArea.bottom}
        right={20}
        left={20}
      >
        <HStack pointerEvents="auto">{children}</HStack>
      </AbsoluteVStack>
    </PortalItem>
  )
}
