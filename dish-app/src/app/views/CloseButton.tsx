import { CornerLeftUp, X } from '@dish/react-feather'
import React, { memo } from 'react'
import { HStack, StackProps, useTheme } from 'snackui'

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
  const theme = useTheme()
  return (
    <HStack
      borderRadius={1000}
      backgroundColor={theme.colorTertiary}
      padding={6}
      alignItems="center"
      justifyContent="center"
      hoverStyle={{
        backgroundColor: theme.colorSecondary,
      }}
      pressStyle={{
        backgroundColor: '#222',
      }}
      {...props}
    />
  )
}
