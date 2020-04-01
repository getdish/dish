import React from 'react'
import { Text, TextProps } from 'react-native'

import { HStack } from '../shared/Stacks'

export function TagButton({
  rank,
  name,
  size,
}: {
  rank?: number
  name: string
  size?: 'lg' | 'md'
}) {
  const scale = size == 'lg' ? 1.05 : 1
  const paddingVertical = 1 * scale
  const lineHeight = 22 * scale
  return (
    <HStack
      backgroundColor="purple"
      borderWidth={1}
      borderColor={'#ddd'}
      borderRadius={10 * scale}
      overflow="hidden"
      alignItems="center"
      shadowColor="rgba(0,0,0,0.1)"
      shadowRadius={6 * scale}
      shadowOffset={{ width: 0, height: 2 * scale }}
    >
      {!!rank && (
        <Text
          style={{
            fontSize: 13 * scale,
            fontWeight: 'bold',
            paddingVertical,
            paddingHorizontal: 8 * scale,
            backgroundColor: '#fff',
            height: '100%',
            lineHeight,
          }}
        >
          <SuperScriptText style={{ opacity: 0.5 }}>#</SuperScriptText>
          {rank}
        </Text>
      )}
      <Text
        style={{
          fontSize: 12 * scale,
          fontWeight: 'bold',
          paddingVertical,
          paddingHorizontal: 8 * scale,
          color: '#fff',
          lineHeight,
        }}
      >
        {name}
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
      style={[{ fontSize: 12, textAlignVertical: 'top', opacity: 0.5 }, style]}
      {...rest}
    />
  )
}
