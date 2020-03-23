import React from 'react'
import { Text } from 'react-native'
import { HStack } from '../shared/Stacks'

export function TagButton(props: { rank?: number; name: string }) {
  return (
    <HStack
      backgroundColor="purple"
      borderWidth={1}
      borderColor={'#ddd'}
      borderRadius={10}
      overflow="hidden"
      alignItems="center"
      shadowColor="rgba(0,0,0,0.1)"
      shadowRadius={6}
      shadowOffset={{ width: 0, height: 2 }}
    >
      {!!props.rank && (
        <Text
          style={{
            fontWeight: 'bold',
            paddingVertical: 2,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            height: '100%',
            lineHeight: 23,
          }}
        >
          #{props.rank}
        </Text>
      )}
      <Text
        style={{
          fontWeight: 'bold',
          paddingVertical: 2,
          paddingHorizontal: 10,
          color: '#fff',
          lineHeight: 23,
        }}
      >
        {props.name}
      </Text>
    </HStack>
  )
}
