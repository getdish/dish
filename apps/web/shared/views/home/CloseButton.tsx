import { HStack, StackProps } from '@dish/ui'
import React, { memo } from 'react'
import { CornerLeftUp, X } from 'react-feather'

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

export const SmallCircleButton = (props: StackProps) => {
  return (
    <HStack
      borderRadius={1000}
      backgroundColor="rgba(0,0,0,0.3)"
      padding={4}
      alignItems="center"
      spacing="xs"
      {...props}
      hoverStyle={{
        backgroundColor: 'rgba(0,0,0,0.4)',
        ...props.hoverStyle,
      }}
      pressStyle={{
        opacity: 0.6,
        ...props.pressStyle,
      }}
    />
  )
}
