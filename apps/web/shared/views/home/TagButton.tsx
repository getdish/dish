import React from 'react'
import { Text, TextProps } from 'react-native'
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
            fontSize: 13,
            fontWeight: 'bold',
            paddingVertical: 1,
            paddingHorizontal: 8,
            backgroundColor: '#fff',
            height: '100%',
            lineHeight: 23,
          }}
        >
          <SuperScriptText style={{ opacity: 0.5 }}>#</SuperScriptText>
          {props.rank}
        </Text>
      )}
      <Text
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          paddingVertical: 1,
          paddingHorizontal: 8,
          color: '#fff',
          lineHeight: 23,
        }}
      >
        {props.name}
      </Text>
    </HStack>
  )
}

export function SuperScriptText({
  style,
  ...rest
}: TextProps & { children: any }) {
  return (
    <Text
      style={[{ fontSize: 7, textAlignVertical: 'top' }, style]}
      {...rest}
    />
  )
}
