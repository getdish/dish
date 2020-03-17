import React from 'react'
import { Text } from 'react-native'
export function SmallTitle(props: { children: any }) {
  return (
    <Text
      style={{
        textTransform: 'uppercase',
        letterSpacing: 2,
        opacity: 0.5,
        fontSize: 16,
      }}
    >
      {props.children}
    </Text>
  )
}
