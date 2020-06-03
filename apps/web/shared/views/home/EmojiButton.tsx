import { Circle, Text } from '@dish/ui'
import React from 'react'
import { TouchableOpacity } from 'react-native'

export const EmojiButton = ({
  active,
  children,
  onPress,
  size = 88,
  ...rest
}: any) => {
  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
      <Circle
        size={size}
        backgroundColor={active ? 'yellow' : ''}
        borderColor={'#eee'}
        borderWidth={1}
        hoverStyle={{
          backgroundColor: active ? 'yellow' : 'rgba(0,0,0,0.05)',
        }}
      >
        <Text fontSize={size * 0.45}>{children}</Text>
      </Circle>
    </TouchableOpacity>
  )
}
