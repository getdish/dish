import { LinearGradient } from 'expo-linear-gradient'
import React, { memo } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { HomeActiveTagIds } from '../../state/home'
import { useOvermind } from '../../state/om'
import { getTagId } from '../../state/Tag'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import HomeFilterBar from './HomeFilterBar'
import { LenseButton } from './LenseButton'
import {
  useHomeDrawerWidth,
  useHomeDrawerWidthInner,
} from './useHomeDrawerWidth'

export default memo(function HomeLenseBar(props: {
  activeTagIds: HomeActiveTagIds
  hideLenses?: boolean
}) {
  return (
    <HomeContentTopBar>
      {!props.hideLenses && (
        <HomeLenseBarOnly activeTagIds={props.activeTagIds} />
      )}
      <HomeFilterBar activeTagIds={props.activeTagIds} />
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
          '#fff',
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

export function HomeLenseBarOnly(props: { activeTagIds: HomeActiveTagIds }) {
  const drawerWidth = useHomeDrawerWidthInner()
  const om = useOvermind()
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <HStack
        paddingHorizontal={20}
        spacing="sm"
        minWidth={drawerWidth}
        alignItems="center"
        justifyContent="center"
        // borderRadius={100}
        // borderWidth={1}
        // borderColor="#ddd"
      >
        {om.state.home.allLenseTags.map((lense, index) => (
          <LenseButton
            key={lense.id + index}
            lense={lense}
            isActive={props.activeTagIds[getTagId(lense)]}
            minimal={index > -1}
          />
        ))}
      </HStack>
    </ScrollView>
  )
}
