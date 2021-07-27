import { CornerLeftUp, X } from '@dish/react-feather'
import React, { memo } from 'react'
import { Button, HStack, StackProps, VStack, useTheme } from 'snackui'

type CircleButtonProps = StackProps & {
  size?: number
  shadowed?: boolean
  subtle?: boolean
}

export const CloseButton = (props: CircleButtonProps) => {
  return (
    <SmallCircleButton {...props}>
      <VStack x={-1}>
        <X size={14} color="#fff" />
      </VStack>
    </SmallCircleButton>
  )
}

export const BackButton = memo((props: CircleButtonProps) => {
  return (
    <SmallCircleButton {...props}>
      <CornerLeftUp size={props.size} color="#fff" />
    </SmallCircleButton>
  )
})

export const SmallCircleButton = ({
  shadowed,
  children,
  width,
  height,
  subtle,
  size = 1,
  ...props
}: CircleButtonProps) => {
  const theme = useTheme()
  return (
    <Button
      borderRadius={1000}
      alignItems="center"
      justifyContent="center"
      {...(shadowed && {
        shadowColor: theme.shadowColorLighter,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
      })}
      width={width ?? size}
      height={height ?? size}
      maxWidth={width ?? size}
      maxHeight={height ?? size}
      {...props}
    >
      {children}
    </Button>
  )
}
