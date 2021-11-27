import { AbsoluteYStack, Theme, YStack, useMedia } from '@dish/ui'
import React, { Suspense } from 'react'

import {
  searchBarBorderRadius,
  searchBarHeight,
  searchBarMaxWidth,
  zIndexSearchBarFloating,
} from '../constants/constants'
import { AppSearchBarContents } from './AppSearchBarContents'
import { useCurrentLenseColor } from './hooks/useCurrentLenseColor'

// export const parentIds = {
//   small: 'searchbar-small',
//   large: 'searchbar-large',
// }

export const AppSearchBarFloating = () => {
  const media = useMedia()
  const { name } = useCurrentLenseColor()
  const height = searchBarHeight + 9

  if (media.sm) {
    return null
  }

  // useLayoutEffect(() => {
  //   if (isInitial.current) {
  //     isInitial.current = false
  //     return
  //   }
  //   const parent = parentIds[media.sm ? 'large' : 'small']
  //   const newParent = parentIds[media.sm ? 'small' : 'large']
  //   sendReparentableChild(parent, newParent, 0, 0)
  // }, [media.sm])
  const barThemeName = media.sm ? null : name

  return (
    <Theme name={barThemeName}>
      <AbsoluteYStack
        className="searchbar-container ease-in-out"
        zIndex={zIndexSearchBarFloating}
        pos="absolute"
        ai="center"
        pe="none"
        left={0}
        right={0}
        top={0}
      >
        {/* container */}
        <AbsoluteYStack top={0} left={-20} right={-20} ai="center">
          {/* bg/shadows */}
          <YStack pos="relative" ai="center" jc="center" w="100%" h={height}>
            {/* SHADOW AND BACKGROUND */}
            <AbsoluteYStack
              br={searchBarBorderRadius}
              className="searchbar-shadow"
              overflow="hidden"
              zIndex={102}
              opacity={1}
              fullscreen
              h={height}
              jc="center"
              ai="center"
              bc="$bg"
              shadowColor="#000"
              shadowOpacity={0.25}
              shadowOffset={{ height: 0, width: 0 }}
              shadowRadius={5}
            />
            <YStack
              w="100%"
              pos="relative"
              zi={104}
              f={1}
              h={height}
              pr={10}
              jc="center"
              mw={searchBarMaxWidth}
              ai="center"
            >
              <Suspense fallback={null}>
                <AppSearchBarContents />
              </Suspense>
            </YStack>
          </YStack>
        </AbsoluteYStack>
      </AbsoluteYStack>
    </Theme>
  )
}
