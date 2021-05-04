import { series, sleep } from '@dish/async'
import React, { useEffect, useState } from 'react'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
  StackProps,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { drawerBorderRadius, drawerWidthMax } from '../../constants/constants'
import { STACK_ANIMATION_DURATION } from '../home/HomeStackView'
import { HomeSuspense } from '../home/HomeSuspense'
import { PageTitleTag } from './PageTitleTag'
import { StackCloseButton } from './StackCloseButton'

export type StackDrawerProps = StackProps & {
  title?: string
  closable?: boolean
  fallback?: any
  topLeftControls?: any
}

export const StackDrawer = ({
  title,
  closable,
  children,
  fallback,
  topLeftControls,
  ...props
}: StackDrawerProps) => {
  const media = useMedia()
  const theme = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    return series([
      // dont show right away to get animation
      () => sleep(STACK_ANIMATION_DURATION),
      () => setIsLoaded(true),
    ])
  }, [])

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
      shadowRadius={7}
      shadowColor={theme.shadowColor}
    >
      {!!topLeftControls && (
        <AbsoluteVStack
          className="top-left-controls"
          zIndex={1000000000000}
          left={media.sm ? 6 : 12}
          top={media.sm ? 6 : 72}
        >
          {topLeftControls}
        </AbsoluteVStack>
      )}
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
        <HomeSuspense fallback={fallback ?? <LoadingItems />}>
          {isLoaded ? children : null}
        </HomeSuspense>
      </VStack>
    </HStack>
  )
}
