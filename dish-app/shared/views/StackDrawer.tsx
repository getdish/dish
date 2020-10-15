import { HStack, LoadingItems, StackProps, VStack } from '@dish/ui'
import React, { Suspense } from 'react'

import { drawerBorderRadius, drawerWidthMax } from '../constants'
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
      left={isSmall ? 0 : 'auto'}
      right={isSmall ? 0 : 0}
      flex={1}
      maxHeight="100%"
      height="100%"
      minHeight="100%"
      width="100%"
      borderRadius={drawerBorderRadius}
      maxWidth={isSmall ? '100%' : drawerWidthMax}
      minWidth={isSmall ? '100%' : 200}
      justifyContent="flex-end"
      shadowRadius={isSmall ? 6 : 10}
      shadowColor="rgba(0,0,0,0.22)"
    >
      {closable && (
        <StackViewCloseButton
          right={isSmall ? 10 : -14}
          top={isSmall ? 10 : -3}
        />
      )}
      {!!title && <PageTitleTag>{title}</PageTitleTag>}
      <VStack
        position="relative"
        flex={1}
        borderRadius={drawerBorderRadius}
        maxWidth={isSmall ? '100%' : drawerWidthMax}
        backgroundColor="#fff"
        {...props}
      >
        <Suspense fallback={fallback ?? <LoadingItems />}>{children}</Suspense>
      </VStack>
    </HStack>
  )
}
