import { LinearGradient } from 'expo-linear-gradient'
import React, { memo } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { useOvermind } from '../../state/om'
import { getTagId } from '../../state/Tag'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import HomeFilterBar from './HomeFilterBar'
import { LenseButton } from './LenseButton'

export default memo(function HomeLenseBar(props: {
  activeTagIds: { [id: string]: boolean }
  backgroundGradient?: boolean
}) {
  const om = useOvermind()
  return (
    <ZStack zIndex={10} right={0} left={0} pointerEvents="none">
      <VStack pointerEvents="auto">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack paddingHorizontal={20} paddingVertical={4} spacing="sm">
            {om.state.home.allLenseTags.map((lense) => (
              <LenseButton
                key={lense.id}
                lense={lense}
                isActive={props.activeTagIds[getTagId(lense)]}
              />
            ))}
          </HStack>
        </ScrollView>
        <HomeFilterBar activeTagIds={props.activeTagIds} />
      </VStack>
      {props.backgroundGradient && (
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.4)',
            '#fff',
            '#fff',
            '#fff',
            'transparent',
            'transparent',
            'transparent',
          ]}
          style={[
            StyleSheet.absoluteFill,
            { zIndex: -1, marginBottom: -80, marginTop: -30 },
          ]}
        />
      )}
    </ZStack>
  )
})
