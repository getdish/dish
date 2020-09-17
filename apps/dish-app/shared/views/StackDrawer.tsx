import { HStack, LoadingItems, StackProps, VStack } from '@dish/ui'
import React, { Suspense } from 'react'

import {
  drawerBorderRadius,
  drawerWidthMax,
  searchBarHeight,
} from '../constants'
import { useIsNarrow } from '../hooks/useIs'
import { StackViewCloseButton } from './StackViewCloseButton'
import { PageTitleTag } from './ui/PageTitleTag'

export const StackDrawer = ({
  title,
  closable,
  children,
  fallback,
  ...props
}: StackProps & { title?: string; closable?: boolean; fallback?: any }) => {
  const isSmall = useIsNarrow()
  return (
    <HStack
      position="absolute"
      left={isSmall ? 0 : 0}
      right={isSmall ? 0 : 0}
      flex={1}
      maxHeight="100%"
      height="100%"
      borderRadius={drawerBorderRadius}
      overflow="visible"
      marginTop={isSmall ? 0 : searchBarHeight}
      maxWidth={isSmall ? '100%' : drawerWidthMax}
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
        maxWidth={isSmall ? '100%' : drawerWidthMax}
        shadowRadius={isSmall ? 5 : 10}
        shadowColor="rgba(0,0,0,0.1)"
        shadowOffset={{ height: -2, width: 0 }}
        backgroundColor="#fff"
        contain="strict"
        {...props}
      >
        <Suspense fallback={fallback ?? <LoadingItems />}>{children}</Suspense>
      </VStack>
    </HStack>
  )
}
