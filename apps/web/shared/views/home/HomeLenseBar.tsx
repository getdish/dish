import { LinearGradient } from 'expo-linear-gradient'
import React, { memo, useMemo } from 'react'
import { ScrollView, StyleSheet, Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Taxonomy } from '../../state/Taxonomy'
import { LinkButton } from '../shared/Link'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import HomeFilterBar from './HomeFilterBar'

export default memo(function HomeLenseBar(props: {
  backgroundGradient?: boolean
}) {
  const om = useOvermind()
  const { lastHomeState } = om.state.home

  const lenses = useMemo(
    () =>
      lastHomeState.lenses.map((lense, index) => (
        <React.Fragment key={lense.id}>
          <LenseButton
            lense={lense}
            active={index == lastHomeState.activeLense}
          />
          <Spacer />
        </React.Fragment>
      )),
    [lastHomeState.activeLense, ...lastHomeState.lenses.map((x) => x.id)]
  )

  return (
    <ZStack zIndex={10} right={0} left={0} pointerEvents="none">
      <VStack pointerEvents="auto">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack paddingHorizontal={20} paddingVertical={2}>
            {lenses}
          </HStack>
        </ScrollView>
        <HomeFilterBar />
      </VStack>
      {props.backgroundGradient && (
        <LinearGradient
          colors={['#fff', '#fff', 'transparent']}
          style={[StyleSheet.absoluteFill, { zIndex: -1, marginBottom: -12 }]}
        />
      )}
    </ZStack>
  )
})

export function LenseButton({
  lense,
  active,
}: {
  lense: Taxonomy
  active: boolean
}) {
  const om = useOvermind()
  return (
    <LinkButton
      onPress={() => {
        om.actions.home.setActiveLense(lense)
      }}
    >
      <HStack
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={10}
        paddingVertical={5}
        backgroundColor={active ? '#fff' : 'rgba(255,255,255,0.5)'}
        borderRadius={8}
        shadowRadius={2}
        shadowColor="rgba(0,0,0,0.1)"
        shadowOffset={{ height: 1, width: 0 }}
        borderWidth={1}
        borderColor={`rgba(0,0,0,0.15)`}
      >
        <Text
          style={{
            color: active ? '#000' : '#777',
            fontSize: 16,
            fontWeight: active ? '700' : '500',
          }}
        >
          {lense.icon} {lense.name}
        </Text>
      </HStack>
    </LinkButton>
  )
}
