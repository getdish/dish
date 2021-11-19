import { series, sleep } from '@dish/async'
import { AbsoluteYStack, LoadingItems, StackProps, YStack, useMedia, useTheme } from '@dish/ui'
import { default as React, useEffect, useState } from 'react'

import { drawerBorderRadius, drawerWidthMax } from '../../constants/constants'
import { STACK_ANIMATION_DURATION } from '../home/HomeStackView'
import { HomeSuspense } from '../home/HomeSuspense'
import { useIsMobilePhone } from '../useIsMobilePhone'
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
  const isPhone = useIsMobilePhone()

  const controls = (
    <>
      {!!topLeftControls && (
        <AbsoluteYStack
          className="top-left-controls"
          zIndex={1000000000000}
          left={media.sm ? 6 : 12}
          top={media.sm ? 6 : 72}
        >
          {topLeftControls}
        </AbsoluteYStack>
      )}
      {closable && <StackCloseButton />}
    </>
  )

  if (isPhone) {
    return (
      <>
        {controls}
        <HomeSuspense fallback={fallback ?? <LoadingItems />}>{children}</HomeSuspense>
      </>
    )
  }

  useEffect(() => {
    return series([
      // dont show right away to get animation
      () => sleep(STACK_ANIMATION_DURATION / 2),
      () => setIsLoaded(true),
    ])
  }, [])

  return (
    <>
      <AbsoluteYStack
        position="absolute"
        left={media.sm ? 0 : 'auto'}
        right={media.sm ? 0 : 0}
        maxHeight="100%"
        height="100%"
        minHeight="100%"
        width="100%"
        borderRadius={drawerBorderRadius}
        maxWidth={media.sm ? '100%' : drawerWidthMax}
        minWidth={media.sm ? '100%' : 200}
        justifyContent="flex-end"
        shadowRadius={9}
        shadowColor={theme.shadowColor}
      >
        {controls}
        <YStack
          // keep this nested, fix-overflow hides box-shadow otherwise
          className="safari-fix-overflow"
          position="relative"
          flexGrow={1}
          flexShrink={1}
          borderRadius={drawerBorderRadius}
          maxWidth={media.sm ? '100%' : drawerWidthMax}
          backgroundColor={theme.backgroundColor}
          overflow="hidden"
          {...props}
        >
          <HomeSuspense fallback={fallback ?? <LoadingItems />}>
            {isLoaded ? children : null}
          </HomeSuspense>
        </YStack>
      </AbsoluteYStack>
    </>
  )
}
