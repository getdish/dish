import { BlurView, HStack, VStack } from '@dish/ui'
import { useStore } from '@dish/use-store'
import React, { memo } from 'react'

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

export const SearchPageNavBar = (props: { id: string }) => {
  const isSmall = useIsNarrow()
  const insets = useSafeArea()
  const lensergb = useCurrentLenseColor()
  const borderRadius = isSmall ? 28 : 0
  const drawerStore = useStore(BottomDrawerStore)

  return (
    <VStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      backgroundColor={isWeb ? '#fff' : `rgba(${lensergb.join(',')},0.25)`}
      shadowColor="rgba(0,0,0,0.08)"
      shadowRadius={10}
      borderRadius={borderRadius}
      shadowOffset={{ height: 3, width: 0 }}
      zIndex={1000}
      {...(isSmall && {
        top: 'auto',
        bottom: insets.bottom + 12 + (drawerStore.snapIndex === 2 ? -10 : 0),
        left: 6,
        right: 'auto',
        maxWidth: '98.5%',
        // borderWidth: 2,
        // borderColor: '#fff',
        shadowRadius: 7,
        shadowColor: 'rgba(0,0,0,0.25)',
      })}
    >
      <BlurView blurType="xlight" borderRadius={borderRadius - 2} flex={1}>
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
        paddingHorizontal={12}
      >
        <HStack
          width="100%"
          // minWidth={drawerWidth}
          alignItems="center"
          justifyContent="space-between"
          height="100%"
        >
          <HStack
            height="100%"
            marginTop={6}
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
