import React from 'react'
import { Text, View } from 'react-native'
import { HStack, VStack } from './Stacks'
import { Spacer } from './Spacer'
export function SmallTitle(props: { children: any }) {
  return (
    <VStack width="100%" alignItems="center" paddingTop={14} paddingBottom={6}>
      <Text
        style={{
          textTransform: 'uppercase',
          letterSpacing: 3,
          opacity: 0.5,
          fontSize: 16,
          fontWeight: '300',
        }}
      >
        {props.children}
      </Text>
      <Spacer />
      <Divider />
    </VStack>
  )
}

const Divider = () => {
  return (
    <HStack width="100%">
      <Spacer flex />
      <View
        style={{ height: 1, flex: 10, backgroundColor: '#000', opacity: 0.05 }}
      />
      <Spacer flex />
    </HStack>
  )
}
