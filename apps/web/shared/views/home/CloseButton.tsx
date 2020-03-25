import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from '../shared/Icon'
import { Circle } from '../shared/Circle'
import { StackBaseProps } from '../shared/Stacks'

export function CloseButton({
  onPress,
  size = 16,
  disabled,
  ...rest
}: {
  onPress: any
  size?: number
  disabled?: boolean
} & StackBaseProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Circle
        size={size * 1.45}
        backgroundColor="#ccc"
        {...rest}
        hoverStyle={{ backgroundColor: '#999', ...rest.hoverStyle }}
      >
        <Icon name="x" size={size} color="white" />
      </Circle>
    </TouchableOpacity>
  )
}
