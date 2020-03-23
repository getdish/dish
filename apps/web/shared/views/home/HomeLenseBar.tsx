import React from 'react'
import { Text, ScrollView } from 'react-native'
import { useOvermind } from '../../state/om'
import { Spacer } from '../shared/Spacer'
import { VStack, HStack } from '../shared/Stacks'
import { Taxonomy } from '../../state/Taxonomy'
import { LinkButton } from '../shared/Link'

export function HomeLenseBar() {
  const om = useOvermind()
  const { lastHomeState } = om.state.home

  return (
    <VStack height={65} paddingVertical={12}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack paddingHorizontal={20} paddingVertical={2}>
          {lastHomeState.lenses.map((lense, index) => (
            <React.Fragment key={lense.id}>
              <LenseButton
                lense={lense}
                active={index == lastHomeState.activeLense}
              />
              <Spacer />
            </React.Fragment>
          ))}
        </HStack>
      </ScrollView>
    </VStack>
  )
}

function LenseButton({ lense, active }: { lense: Taxonomy; active: boolean }) {
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
        paddingHorizontal={8}
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
            fontSize: 15,
            fontWeight: active ? '700' : '500',
          }}
        >
          {lense.icon} {lense.name}
        </Text>
      </HStack>
    </LinkButton>
  )
}
