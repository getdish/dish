import React, { memo } from 'react'
import { StyleSheet, Text } from 'react-native'

import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { HomeActiveTagIds, HomeStateItemSearch } from '../../state/home'
import { useOvermind } from '../../state/om'
import { getTagId } from '../../state/Tag'
import { Box } from '../ui/Box'
import { Divider } from '../ui/Divider'
import { HoverablePopover } from '../ui/HoverablePopover'
import { Icon } from '../ui/Icon'
import { LinearGradient } from '../ui/LinearGradient'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import HomeFilterBar from './HomeFilterBar'
import { LenseButton } from './LenseButton'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'

export default memo(function HomeLenseBar(props: {
  stateIndex: number
  hideLenses?: boolean
}) {
  const om = useOvermind()
  const state = om.state.home.states[props.stateIndex] as HomeStateItemSearch
  console.log('state', props.stateIndex, state)
  const activeTagIds =
    state?.activeTagIds ?? om.state.home.lastHomeState.activeTagIds
  return (
    <HomeContentTopBar>
      {!props.hideLenses && <HomeLenseBarOnly activeTagIds={activeTagIds} />}
      <HomeFilterBar activeTagIds={activeTagIds} />
    </HomeContentTopBar>
  )
})

export function HomeContentTopBar(props: { children: any }) {
  return (
    <ZStack zIndex={10} right={0} left={0} pointerEvents="none">
      <VStack pointerEvents="auto" spacing="sm">
        {props.children}
      </VStack>
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.4)',
          '#fff',
          '#fff',
          'transparent',
          'transparent',
          'transparent',
          'transparent',
          'transparent',
          'transparent',
          'transparent',
        ]}
        style={[
          StyleSheet.absoluteFill,
          { zIndex: -1, marginBottom: -80, marginTop: -30 },
        ]}
      />
    </ZStack>
  )
}

export const HomeLenseBarOnly = memo(
  (props: { activeTagIds: HomeActiveTagIds }) => {
    const drawerWidth = useHomeDrawerWidthInner()
    const om = useOvermind()
    return (
      <HStack
        minWidth={drawerWidth}
        alignItems="center"
        justifyContent="center"
        spacing
      >
        <Divider backgroundColor="#000" flex />
        <HStack
          borderRadius={100}
          // borderColor="#eee"
          // borderWidth={1}
          padding={6}
          alignItems="center"
          justifyContent="center"
          spacing={4}
        >
          {om.state.home.allLenseTags.map((lense, index) => (
            <LenseButton
              key={lense.id + index}
              lense={lense}
              isActive={props.activeTagIds[getTagId(lense)]}
              minimal={index > -1}
            />
          ))}

          <HoverablePopover
            position="right"
            contents={
              <Box>
                <Text>12312321</Text>
              </Box>
            }
          >
            <Icon name="ChevronDown" color="#999" size={20} />
          </HoverablePopover>
        </HStack>
        <Divider backgroundColor="#000" flex />
      </HStack>
    )
  }
)
