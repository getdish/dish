import {
  AbsoluteYStack,
  Theme,
  XStack,
  YStack,
  useMedia,
  useSafeAreaInsets,
  useTheme,
} from '@dish/ui'
import React, { Suspense, memo } from 'react'
import Svg, { G, Path } from 'react-native-svg'

import { drawerWidthMax } from '../../../constants/constants'
import { titleHeight } from '../../../constants/titleHeight'
import { HomeStateItemSearch } from '../../../types/homeTypes'
import { useLastHomeState } from '../../homeStore'
import { LenseButtonBar } from '../../views/LenseButtonBar'
import { SearchPageFilterBar } from './SearchPageFilterBar'

const InverseRoundedEdge = () => {
  return (
    <Svg width="20px" height="20px" viewBox="0 0 20 20">
      <G stroke="none">
        <Path d="M20,5 L20,20 L5,20 C13.2842712,20 20,13.2842712 20,5 L20,5 Z" fill="#000000" />
      </G>
    </Svg>
  )
}

export const SearchPageNavBar = memo(() => {
  const media = useMedia()
  const theme = useTheme()
  const safeArea = useSafeAreaInsets()

  let content: any

  if (media.sm) {
    content = (
      <Theme name="dark">
        <YStack position="absolute" bottom={0} left={0} right={0} zIndex={1000}>
          {/* *may have been slow dragging when on mobile safari! */}
          <>
            <AbsoluteYStack top={-20} right={0}>
              <InverseRoundedEdge />
            </AbsoluteYStack>
            <AbsoluteYStack top={-20} left={0} scaleX={-1}>
              <InverseRoundedEdge />
            </AbsoluteYStack>
          </>
          <YStack backgroundColor="#000" paddingBottom={safeArea.bottom}>
            <SearchPageNavBarContent />
          </YStack>
        </YStack>
      </Theme>
    )
  } else {
    content = (
      <YStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        maxWidth={drawerWidthMax}
        backgroundColor={theme.backgroundColor}
        shadowColor={theme.shadowColorLighter}
        shadowRadius={6}
        borderTopLeftRadius={media.sm ? 0 : 20}
        borderTopRightRadius={media.sm ? 0 : 20}
        shadowOffset={{ height: 3, width: 0 }}
        zIndex={10000}
      >
        <SearchPageNavBarContent />
      </YStack>
    )
  }

  return <Suspense fallback={null}>{content}</Suspense>
})

const SearchPageNavBarContent = memo(() => {
  const state = useLastHomeState('search') as HomeStateItemSearch | undefined

  return (
    <>
      <YStack
        className="ease-in-out"
        alignItems="center"
        height={titleHeight}
        width="100%"
        maxWidth="100%"
        minWidth="100%"
        paddingHorizontal={16}
        pointerEvents="auto"
        opacity={state ? 1 : 0}
      >
        {state && (
          <XStack width="100%" alignItems="center" justifyContent="space-between" height="100%">
            <XStack height="100%" alignItems="center" justifyContent="center">
              <LenseButtonBar activeTags={state.activeTags} />
            </XStack>

            <YStack flex={1} />

            <SearchPageFilterBar activeTags={state.activeTags} />
          </XStack>
        )}
      </YStack>
    </>
  )
})
