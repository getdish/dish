import { Circle, CircleProps, Text } from '@dish/ui'
import React from 'react'

export const EmojiButton = ({
  active,
  children,
  size = 88,
  ...props
}: CircleProps & {
  active?: boolean
}) => {
  return (
    <Circle
      size={size}
      backgroundColor={active ? 'yellow' : ''}
      borderColor={'#eee'}
      borderWidth={1}
      hoverStyle={{
        backgroundColor: active ? 'yellow' : 'rgba(0,0,0,0.05)',
      }}
      pressStyle={{
        opacity: 0.6,
      }}
      {...props}
    >
      <Text fontSize={size * 0.45}>{children}</Text>
    </Circle>
  )
}
