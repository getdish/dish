import { CornerLeftUp, X } from '@dish/react-feather'
import React, { memo } from 'react'
import { Button, ButtonProps, VStack, useTheme } from 'snackui'

type CircleButtonProps = ButtonProps & {
  size?: number
  shadowed?: boolean
  subtle?: boolean
}

export const CloseButton = (props: CircleButtonProps) => {
  return (
    <SmallCircleButton {...props}>
      <X size={18} color="#999" />
    </SmallCircleButton>
  )
}

export const BackButton = memo((props: CircleButtonProps) => {
  return (
    <SmallCircleButton {...props}>
      <CornerLeftUp size={props.size} color="#999" />
    </SmallCircleButton>
  )
})

export const SmallCircleButton = ({
  shadowed,
  children,
  width,
  height,
  subtle,
  size = 44,
  ...props
}: CircleButtonProps) => {
  const theme = useTheme()
  return (
    <Button
      borderRadius={1000}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal={0}
      paddingVertical={0}
      {...(shadowed && {
        shadowColor: theme.shadowColor,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      })}
      noTextWrap
      minWidth={width ?? size}
      minHeight={height ?? size}
      maxWidth={width ?? size}
      maxHeight={height ?? size}
      {...props}
    >
      {children}
    </Button>
  )
}
