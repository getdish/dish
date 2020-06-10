import { HStack, StackProps } from '@dish/ui'
import React, { memo } from 'react'
import { CornerLeftUp, X } from 'react-feather'
import { GestureResponderEvent, TouchableOpacity } from 'react-native'

type CircleButtonProps = {
  onPress: any
  size?: number
  disabled?: boolean
} & StackProps

export const CloseButton = memo((props: CircleButtonProps) => {
  return (
    <SmallCircleButton {...props}>
      <X size={props.size ?? 14} color="white" />
    </SmallCircleButton>
  )
})

export const BackButton = memo((props: CircleButtonProps) => {
  return (
    <SmallCircleButton {...props}>
      <CornerLeftUp size={props.size} color="white" />
    </SmallCircleButton>
  )
})

export const SmallCircleButton = memo(
  ({
    onPress,
    disabled,
    ...rest
  }: StackProps & { onPress?: (event: GestureResponderEvent) => void }) => {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <HStack
          borderRadius={1000}
          backgroundColor="rgba(0,0,0,0.3)"
          padding={4}
          alignItems="center"
          spacing="xs"
          {...rest}
          hoverStyle={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            ...rest.hoverStyle,
          }}
        />
      </TouchableOpacity>
    )
  }
)
