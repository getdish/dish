import React, { memo } from 'react'
import { TouchableOpacity } from 'react-native'

import { Circle } from '../ui/Circle'
import { Icon } from '../ui/Icon'
import { StackBaseProps } from '../ui/Stacks'

type CircleButtonProps = {
  onPress: any
  size?: number
  disabled?: boolean
} & StackBaseProps

export const CloseButton = memo((props: CircleButtonProps) => {
  return (
    <SmallCircleButton {...props}>
      <Icon name="x" size={props.size} color="white" />
    </SmallCircleButton>
  )
})

export const BackButton = memo((props: CircleButtonProps) => {
  return (
    <SmallCircleButton {...props}>
      <Icon name="corner-left-up" size={props.size} color="white" />
    </SmallCircleButton>
  )
})

export const SmallCircleButton = memo(
  ({ onPress, size = 14, disabled, ...rest }: CircleButtonProps) => {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <Circle
          size={size * 1.45}
          backgroundColor="#ccc"
          {...rest}
          hoverStyle={{ backgroundColor: '#999', ...rest.hoverStyle }}
        />
      </TouchableOpacity>
    )
  }
)
