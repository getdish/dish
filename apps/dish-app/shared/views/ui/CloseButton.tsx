import { CornerLeftUp, X } from '@dish/react-feather'
import { HStack, StackProps } from '@dish/ui'
import React, { memo } from 'react'

type CircleButtonProps = StackProps & {
  size?: number
}

export const CloseButton = memo((props: CircleButtonProps) => {
  return (
    <SmallCircleButton {...props}>
      <X size={props.size ?? 14} color="white" style={{ marginTop: 1 }} />
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
      padding={3}
      alignItems="center"
      justifyContent="center"
      spacing="xs"
      {...props}
      hoverStyle={{
        backgroundColor: 'rgba(0,0,0,0.2)',
        ...props.hoverStyle,
      }}
      pressStyle={{
        opacity: 0.6,
        ...props.pressStyle,
      }}
    />
  )
}
