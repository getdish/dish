import React, { Suspense, memo } from 'react'
import Svg, { G, Path } from 'react-native-svg'
import {
  AbsoluteVStack,
  HStack,
  Theme,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { drawerWidthMax } from '../../../constants/constants'
import { titleHeight } from '../../../constants/titleHeight'
import { useSafeArea } from '../../hooks/useSafeArea'
import { useHomeStore } from '../../homeStore'
import { isSearchState } from '../../../helpers/homeStateHelpers'
import { HomeLenseBar } from '../../views/HomeLenseBar'
import { SearchPageFilterBar } from './SearchPageFilterBar'

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
  const media = useMedia()
  const theme = useTheme()
  const safeArea = useSafeArea()

  let content: any

  if (media.sm) {
    content = (
      <Theme name="dark">
        <VStack position="absolute" bottom={0} left={0} right={0} zIndex={1000}>
          <AbsoluteVStack top={-20} right={0}>
            <InverseRoundedEdge />
          </AbsoluteVStack>
          <AbsoluteVStack top={-20} left={0} transform={[{ scaleX: -1 }]}>
            <InverseRoundedEdge />
          </AbsoluteVStack>
          <VStack backgroundColor="#000" paddingBottom={safeArea.bottom}>
            <SearchPageNavBarContent stateId={props.id} />
          </VStack>
        </VStack>
      </Theme>
    )
  } else {
    content = (
      <VStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        maxWidth={drawerWidthMax}
        backgroundColor={theme.backgroundColor}
        shadowColor="rgba(0,0,0,0.04)"
        shadowRadius={6}
        borderRadius={media.sm ? 20 : 0}
        shadowOffset={{ height: 3, width: 0 }}
        zIndex={10000}
      >
        <SearchPageNavBarContent stateId={props.id} />
      </VStack>
    )
  }

  return <Suspense fallback={null}>{content}</Suspense>
}

const SearchPageNavBarContent = memo(({ stateId }: { stateId: string }) => {
  const home = useHomeStore()
  const state = home.allStates[stateId]

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
          <HStack height="100%" alignItems="center" justifyContent="center">
            <HomeLenseBar activeTags={state.activeTags} />
          </HStack>

          <VStack flex={1} />

          <SearchPageFilterBar activeTags={state.activeTags} />
        </HStack>
      </VStack>
    </>
  )
})
