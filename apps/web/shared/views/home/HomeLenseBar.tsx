import { LinearGradient } from 'expo-linear-gradient'
import React, { memo } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { useOvermind } from '../../state/om'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import HomeFilterBar from './HomeFilterBar'
import { LenseButton } from './LenseButton'

export default memo(function HomeLenseBar(props: {
  backgroundGradient?: boolean
}) {
  const om = useOvermind()
  return (
    <ZStack zIndex={10} right={0} left={0} pointerEvents="none">
      <VStack pointerEvents="auto">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: -2 }}
        >
          <HStack paddingHorizontal={20} paddingVertical={4} spacing="sm">
            {om.state.home.allLenses.map((lense) => (
              <LenseButton key={lense.id} lense={lense} />
            ))}
          </HStack>
        </ScrollView>
        <HomeFilterBar />
      </VStack>
      {props.backgroundGradient && (
        <LinearGradient
          colors={['#fff', '#fff', 'transparent']}
          style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
        />
      )}
    </ZStack>
  )
})
