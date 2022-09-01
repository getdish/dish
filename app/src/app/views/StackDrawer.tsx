import { drawerBorderRadius, drawerWidthMax } from '../../constants/constants'
import { STACK_ANIMATION_DURATION } from '../home/HomeStackView'
import { HomeSuspense } from '../home/HomeSuspense'
import { useIsMobileDevice } from '../useIsMobileDevice'
import { StackCloseButton } from './StackCloseButton'
import { series, sleep } from '@dish/async'
import { isSafari } from '@dish/helpers'
import {
  AbsoluteYStack,
  LoadingItems,
  PortalHost,
  PortalItem,
  YStack,
  YStackProps,
  isWeb,
  useMedia,
  useTheme,
} from '@dish/ui'
import { default as React, useEffect, useState } from 'react'

export type StackDrawerProps = YStackProps & {
  title?: string
  closable?: boolean
  fallback?: any
  topLeftControls?: any
  onClose?: () => void
}

export const StackDrawer = ({
  title,
  closable,
  children,
  fallback,
  topLeftControls,
  onClose,
  disabled,
  ...props
}: StackDrawerProps) => {
  const media = useMedia()
  const [isLoaded, setIsLoaded] = useState(false)
  // const isPhone = useIsMobileDevice()

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
      {closable && <StackCloseButton onClose={onClose} />}
    </>
  )

  useEffect(() => {
    return series([
      // dont show right away to get animation
      () => sleep(STACK_ANIMATION_DURATION / 2),
      () => setIsLoaded(true),
    ])
  }, [])

  return (
    <>
      <YStack
        left={media.md ? 0 : 'auto'}
        right={media.md ? 0 : 0}
        height="100%"
        minHeight="100%"
        width="100%"
        borderRadius={drawerBorderRadius}
        maxWidth={media.md ? '100%' : drawerWidthMax}
        minWidth={media.md ? '100%' : 200}
        justifyContent="flex-end"
        shadowRadius={9}
        shadowColor="$shadowColor"
      >
        {disabled ? null : (
          <PortalItem hostName="stack-drawer-controls">{controls}</PortalItem>
        )}
        <YStack
          // keep this nested, fix-overflow hides box-shadow otherwise
          className={'safari-fix-overflow' + ' blur2x'}
          // this doesnt work in chrome
          position="relative"
          flexGrow={1}
          flexShrink={1}
          borderRadius={drawerBorderRadius}
          maxWidth={media.sm ? '100%' : drawerWidthMax}
          overflow="hidden"
          {...props}
        >
          <YStack fullscreen backgroundColor="$colorMid" o={isSafari ? 0.5 : 0.9} />
          <YStack fullscreen backgroundColor="$backgroundSoft" o={isSafari ? 0.5 : 0.9} />
          <YStack zi={100}>
            <HomeSuspense fallback={fallback ?? <LoadingItems />}>
              {isLoaded ? children : null}
            </HomeSuspense>
          </YStack>
        </YStack>
      </YStack>
    </>
  )
}

export const StackDrawerControlsPortal = () => {
  return (
    <YStack pe="auto" zi={1000000} pos="absolute" top={0} right={0}>
      <PortalHost name="stack-drawer-controls" />
    </YStack>
  )
}
