import { HStack, LoadingItems, StackProps, VStack } from '@dish/ui'
import React, { Suspense } from 'react'

import {
  drawerBorderRadius,
  drawerPad,
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
    <HStack
      position="absolute"
      left={isSmall ? -5 : 0}
      right={isSmall ? -5 : 0}
      flex={1}
      maxHeight="100%"
      height="100%"
      borderRadius={drawerBorderRadius}
      overflow="visible"
      marginTop={isSmall ? 0 : searchBarHeight}
      maxWidth={drawerWidthMax}
      minWidth="100%"
      justifyContent="flex-end"
    >
      {closable && !isSmall && (
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
        position="relative"
        flex={1}
        borderRadius={drawerBorderRadius}
        overflow="hidden"
        shadowRadius={isSmall ? 5 : 10}
        maxWidth={drawerWidthMax}
        shadowColor="rgba(0,0,0,0.1)"
        backgroundColor="#fff"
        {...props}
      >
        <Suspense fallback={fallback ?? <LoadingItems />}>{children}</Suspense>
      </VStack>
    </HStack>
  )
}
