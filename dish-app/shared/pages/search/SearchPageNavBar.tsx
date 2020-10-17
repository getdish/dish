import { useStore } from '@dish/use-store'
import React, { memo } from 'react'
import Svg, { G, Path } from 'react-native-svg'
import { AbsoluteVStack, BlurView, HStack, VStack } from 'snackui'

import { BottomDrawerStore } from '../../BottomDrawerStore'
import { isWeb } from '../../constants'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { useIsNarrow } from '../../hooks/useIs'
import { useSafeArea } from '../../hooks/useSafeArea'
import { isSearchState } from '../../state/home-helpers'
import { useOvermind } from '../../state/om'
import { HomeLenseBar } from '../../views/HomeLenseBar'
import { SearchPageFilterBar } from './SearchPageFilterBar'
import { titleHeight } from './titleHeight'

const InverseRoundedEdge = () => {
  return (
    <Svg width="20px" height="20px" viewBox="0 0 20 20">
      <G stroke="none">
        <Path
          d="M20,5 L20,20 L5,20 C13.2842712,20 20,13.2842712 20,5 L20,5 Z"
          fill="#000000"
        />
      </G>
    </Svg>
  )
}

export const SearchPageNavBar = (props: { id: string }) => {
  const isSmall = useIsNarrow()
  const borderRadius = isSmall ? 20 : 0

  if (isSmall) {
    return (
      <VStack position="absolute" bottom={0} left={0} right={0} zIndex={1000}>
        <AbsoluteVStack top={-20} right={0}>
          <InverseRoundedEdge />
        </AbsoluteVStack>
        <AbsoluteVStack top={-20} left={0} transform={[{ scaleX: -1 }]}>
          <InverseRoundedEdge />
        </AbsoluteVStack>
        <BlurView fallbackBackgroundColor="#000" blurType="dark">
          <SearchPageNavBarContent stateId={props.id} />
        </BlurView>
      </VStack>
    )
  }

  return (
    <VStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      backgroundColor={isWeb ? '#fff' : `rgba(255,255,255,0.25)`}
      shadowColor="rgba(0,0,0,0.07)"
      shadowRadius={8}
      borderRadius={borderRadius}
      shadowOffset={{ height: 3, width: 0 }}
      zIndex={1000}
      {...(isSmall && {
        top: 'auto',
        bottom: 0,
        left: 6,
        right: 'auto',
        maxWidth: '98.5%',
        backgroundColor: '#000',
      })}
    >
      <BlurView blurType="light" borderRadius={borderRadius - 2} flex={1}>
        <SearchPageNavBarContent stateId={props.id} />
      </BlurView>
    </VStack>
  )
}

const SearchPageNavBarContent = memo(({ stateId }: { stateId: string }) => {
  const om = useOvermind()
  const state = om.state.home.allStates[stateId]

  if (!isSearchState(state)) {
    return null
  }

  return (
    <>
      <VStack
        alignItems="center"
        height={titleHeight}
        width="100%"
        maxWidth="100%"
        minWidth="100%"
        paddingHorizontal={16}
        pointerEvents="auto"
      >
        <HStack
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          height="100%"
        >
          <HStack
            height="100%"
            marginTop={10}
            alignItems="center"
            justifyContent="center"
          >
            <HomeLenseBar activeTagIds={state.activeTagIds} />
          </HStack>

          <VStack flex={1} minWidth={20} />

          <SearchPageFilterBar activeTagIds={state.activeTagIds} />
        </HStack>
      </VStack>
    </>
  )
})
