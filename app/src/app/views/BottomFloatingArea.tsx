import { AbsoluteYStack, XStack, useMedia, useSafeAreaInsets } from '@dish/ui'
import React, { useMemo } from 'react'

import { PortalItem } from '../Portal'

export function BottomFloatingArea(props: { children: any }) {
  const children = useMemo(() => props.children, [props.children])
  const safeArea = useSafeAreaInsets()
  const media = useMedia()
  return (
    <PortalItem id={media.sm ? 'root' : 'drawer'}>
      <AbsoluteYStack
        zIndex={1000000000}
        pointerEvents="none"
        bottom={20 + safeArea.bottom}
        right={20}
        left={20}
      >
        <XStack pointerEvents="auto">{children}</XStack>
      </AbsoluteYStack>
    </PortalItem>
  )
}
