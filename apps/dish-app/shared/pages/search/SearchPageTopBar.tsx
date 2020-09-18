import { HStack, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'

import { useAppDrawerWidth } from '../../hooks/useAppDrawerWidth'
import { isSearchState } from '../../state/home-helpers'
import { useOvermind } from '../../state/om'
import { HomeLenseBar } from '../../views/HomeLenseBar'
import { titleHeight, topBarVPad } from './SearchPage'
import { SearchPageDeliveryFilterButtons } from './SearchPageDeliveryFilterButtons'
import { SearchPageFilterBar } from './SearchPageFilterBar'

export const SearchPageTopBar = memo(({ stateId }: { stateId: string }) => {
  const om = useOvermind()
  const state = om.state.home.allStates[stateId]
  const drawerWidth = useAppDrawerWidth()

  if (!isSearchState(state)) {
    return null
  }

  return (
    <VStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      borderBottomColor="#eee"
      backgroundColor="#fff"
      borderBottomWidth={1}
      shadowColor="rgba(0,0,0,0.1)"
      shadowRadius={10}
      zIndex={1000}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ width: '100%', minWidth: '100%' }}
        contentContainerStyle={{
          minWidth: drawerWidth - 20,
          maxWidth: drawerWidth,
        }}
      >
        <VStack
          alignItems="center"
          height={titleHeight}
          width="100%"
          maxWidth="100%"
          minWidth="100%"
          overflow="hidden"
          paddingHorizontal={12}
        >
          <HStack
            paddingHorizontal={18}
            width="100%"
            minWidth={drawerWidth}
            alignItems="center"
            justifyContent="space-between"
            height="100%"
          >
            <HStack
              height="100%"
              marginTop={-10}
              alignItems="center"
              justifyContent="center"
            >
              <HomeLenseBar activeTagIds={state.activeTagIds} />
            </HStack>

            <VStack flex={1} minWidth={36} />

            <SearchPageFilterBar activeTagIds={state.activeTagIds} />
          </HStack>
        </VStack>

        <SearchPageDeliveryFilterButtons activeTagIds={state.activeTagIds} />
      </ScrollView>
    </VStack>
  )
})
