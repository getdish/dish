import { HStack, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { lightRed } from '../../colors'
import { isWeb } from '../../constants'
import { useIsNarrow } from '../../hooks/useIs'
import { useSafeArea } from '../../hooks/useSafeArea'
import { isSearchState } from '../../state/home-helpers'
import { useOvermind } from '../../state/om'
import { BlurView } from '../../views/BlurView'
import { HomeLenseBar } from '../../views/HomeLenseBar'
import { SearchPageDeliveryFilterButtons } from './SearchPageDeliveryFilterButtons'
import { SearchPageFilterBar } from './SearchPageFilterBar'
import { titleHeight } from './titleHeight'

export const SearchPageNavBar = (props: { id: string }) => {
  const isSmall = useIsNarrow()
  const insets = useSafeArea()

  return (
    <VStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      borderBottomColor="#eee"
      backgroundColor={isWeb ? '#fff' : 'rgba(255,255,255,0.5)'}
      borderBottomWidth={1}
      shadowColor="rgba(0,0,0,0.1)"
      shadowRadius={10}
      shadowOffset={{ height: 5, width: 0 }}
      zIndex={1000}
      {...(isSmall && {
        top: 'auto',
        bottom: insets.bottom + 12,
        left: 6,
        right: 'auto',
        maxWidth: '98.5%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: lightRed,
        shadowRadius: 15,
        shadowColor: 'rgba(0,0,0,0.25)',
      })}
    >
      <BlurView borderRadius={10} flex={1}>
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

      <SearchPageDeliveryFilterButtons activeTagIds={state.activeTagIds} />
    </>
  )
})
