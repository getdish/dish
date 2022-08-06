import { AbsoluteYStack, PortalItem, XStack, useMedia } from '@dish/ui'
import React, { useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export function BottomFloatingArea(props: { children: any }) {
  const children = useMemo(() => props.children, [props.children])
  const media = useMedia()
  return (
    <PortalItem hostName={media.sm ? 'root' : 'drawer'}>
      <SafeAreaView>
        <AbsoluteYStack
          zIndex={1000000000}
          pointerEvents="none"
          bottom={20}
          right={20}
          left={20}
        >
          <XStack pointerEvents="auto">{children}</XStack>
        </AbsoluteYStack>
      </SafeAreaView>
    </PortalItem>
  )
}
