import { CornerLeftUp, X } from '@dish/react-feather'
import React, { memo } from 'react'
import { HStack, StackProps } from 'snackui'

type CircleButtonProps = StackProps & {
  size?: number
}

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
      backgroundColor="#999"
      padding={6}
      alignItems="center"
      justifyContent="center"
      hoverStyle={{
        backgroundColor: 'rgba(150,150,150,0.85)',
      }}
      pressStyle={{
        backgroundColor: '#222',
      }}
      {...props}
    />
  )
}
