import { LoadingItems, StackProps, VStack } from '@dish/ui'
import React, { Suspense } from 'react'

import { drawerBorderRadius } from '../../constants'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { StackViewCloseButton } from './StackViewCloseButton'

export const HomeStackDrawer = ({
  title,
  closable,
  children,
  fallback = <LoadingItems />,
  ...props
}: StackProps & { title?: string; closable?: boolean; fallback?: any }) => {
  return (
    <VStack
      flex={1}
      borderRadius={drawerBorderRadius}
      position="relative"
      backgroundColor="#fff"
      overflow="hidden"
      shadowRadius={10}
      shadowColor="rgba(0,0,0,0.1)"
      {...props}
    >
      {closable && <StackViewCloseButton />}
      {!!title && <PageTitleTag>{title}</PageTitleTag>}
      <Suspense fallback={fallback}>{children}</Suspense>
    </VStack>
  )
}
