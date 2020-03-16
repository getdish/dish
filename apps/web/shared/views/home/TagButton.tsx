import React from 'react'
import { Text } from 'react-native'
import { HStack } from '../Stacks'

export function TagButton(props: { rank?: number; name: string }) {
  return (
    <HStack
      backgroundColor="purple"
      borderRadius={12}
      alignItems="center"
      shadowColor="rgba(0,0,0,0.1)"
      shadowRadius={4}
      shadowOffset={{ width: 0, height: 2 }}
    >
      {!!props.rank && (
        <Text
          style={{
            fontWeight: 'bold',
            paddingVertical: 3,
            paddingHorizontal: 6,
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
          paddingVertical: 3,
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
