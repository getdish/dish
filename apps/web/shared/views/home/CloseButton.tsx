import React from 'react'
import { TouchableOpacity } from 'react-native'

import { Circle } from '../shared/Circle'
import { Icon } from '../shared/Icon'
import { StackBaseProps } from '../shared/Stacks'

export function CloseButton({
  onPress,
  size = 14,
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
