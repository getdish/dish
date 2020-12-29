import React, { Suspense } from 'react'
import {
  HStack,
  LoadingItems,
  StackProps,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { drawerBorderRadius, drawerWidthMax } from '../../constants/constants'
import { PaneControlButtons } from './PaneControlButtons'
import { StackViewCloseButton } from './StackViewCloseButton'
import { PageTitleTag } from './PageTitleTag'

export const StackCloseButton = () => {
  return (
    <PaneControlButtons>
      <StackViewCloseButton />
    </PaneControlButtons>
  )
}

export const StackDrawer = ({
  title,
  closable,
  children,
  fallback,
  ...props
}: StackProps & { title?: string; closable?: boolean; fallback?: any }) => {
  const media = useMedia()
  const theme = useTheme()
  return (
    <HStack
      position="absolute"
      left={media.sm ? 0 : 'auto'}
      right={media.sm ? 0 : 0}
      flex={1}
      maxHeight="100%"
      height="100%"
      minHeight="100%"
      width="100%"
      borderRadius={drawerBorderRadius}
      maxWidth={media.sm ? '100%' : drawerWidthMax}
      minWidth={media.sm ? '100%' : 200}
      justifyContent="flex-end"
      shadowRadius={media.sm ? 6 : 10}
      shadowColor={media.sm ? 'rgba(0,0,0,0.125)' : 'rgba(0,0,0,0.22)'}
    >
      {closable && <StackCloseButton />}
      {!!title && <PageTitleTag>{title}</PageTitleTag>}
      <VStack
        position="relative"
        flex={1}
        borderRadius={drawerBorderRadius}
        maxWidth={media.sm ? '100%' : drawerWidthMax}
        backgroundColor={theme.backgroundColor}
        overflow="hidden"
        {...props}
      >
        <Suspense fallback={fallback ?? <LoadingItems />}>{children}</Suspense>
      </VStack>
    </HStack>
  )
}
