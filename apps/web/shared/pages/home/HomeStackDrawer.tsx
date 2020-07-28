import { LoadingItems, StackProps, VStack } from '@dish/ui'
import React, { Suspense } from 'react'

import {
  drawerBorderRadius,
  drawerWidthMax,
  searchBarHeight,
} from '../../constants'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { StackViewCloseButton } from './StackViewCloseButton'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const HomeStackDrawer = ({
  title,
  closable,
  children,
  fallback,
  ...props
}: StackProps & { title?: string; closable?: boolean; fallback?: any }) => {
  const isSmall = useMediaQueryIsSmall()
  return (
    <VStack
      position="absolute"
      right={0}
      flex={1}
      maxHeight="100%"
      height="100%"
      borderRadius={drawerBorderRadius}
      backgroundColor="#fff"
      overflow="visible"
      marginTop={isSmall ? -10 : searchBarHeight}
      maxWidth={drawerWidthMax}
      width="100%"
    >
      {closable && (
        <StackViewCloseButton
          right={isSmall ? 10 : -14}
          top={isSmall ? 10 : -5}
          backgroundColor="#fff"
          padding={5}
          borderRadius={20}
          shadowColor="rgba(0,0,0,0.1)"
          shadowRadius={5}
          shadowOffset={{ width: 2, height: 0 }}
        />
      )}
      {!!title && <PageTitleTag>{title}</PageTitleTag>}
      <VStack
        className="HomeStackDrawer"
        position="relative"
        borderRadius={drawerBorderRadius}
        overflow="hidden"
        shadowRadius={10}
        shadowColor="rgba(0,0,0,0.1)"
        flex={1}
        {...props}
      >
        <Suspense fallback={fallback ?? <LoadingItems />}>{children}</Suspense>
      </VStack>
    </VStack>
  )
}
