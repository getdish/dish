import React, { memo } from 'react'
import { ChevronRight } from 'react-feather'
import { StyleSheet, Text } from 'react-native'

import { HomeActiveTagIds, HomeStateItemSearch } from '../../state/home'
import { getTagId } from '../../state/Tag'
import { useOvermind } from '../../state/useOvermind'
import { Box } from '../ui/Box'
import { HoverablePopover } from '../ui/HoverablePopover'
import { LinearGradient } from '../ui/LinearGradient'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import HomeFilterBar from './HomeFilterBar'
import { LenseButton } from './LenseButton'

export default memo(function HomeLenseBar(props: {
  stateIndex: number
  hideLenses?: boolean
  relative?: boolean
  spacer?: any
}) {
  const om = useOvermind()
  const state = om.state.home.states[props.stateIndex] as HomeStateItemSearch
  const activeTagIds =
    state?.activeTagIds ?? om.state.home.lastHomeState.activeTagIds
  const content = (
    <>
      {!props.hideLenses && <HomeLenseBarOnly activeTagIds={activeTagIds} />}
      {props.spacer}
      <HomeFilterBar activeTagIds={activeTagIds} />
    </>
  )
  if (props.relative) {
    return content
  }
  return <HomeContentTopBar>{content}</HomeContentTopBar>
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
    const om = useOvermind()
    return (
      <HStack
        // minWidth={drawerWidth}
        alignItems="flex-end"
        justifyContent="flex-end"
        spacing
      >
        {/* <Divider backgroundColor="#000" flex /> */}
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
            <ChevronRight color="#999" size={20} />
          </HoverablePopover>
        </HStack>
        {/* <Divider backgroundColor="#000" flex /> */}
      </HStack>
    )
  }
)
