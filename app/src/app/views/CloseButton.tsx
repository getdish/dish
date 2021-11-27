import { Button, ButtonProps } from '@dish/ui'
import { CornerLeftUp, X } from '@tamagui/feather-icons'
import React, { forwardRef, memo } from 'react'

type CircleButtonProps = Omit<ButtonProps, 'size'> & {
  size?: number
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

export const SmallCircleButton = forwardRef(
  ({ children, width, height, size = 44, ...props }: CircleButtonProps, ref) => {
    return (
      <Button
        ref={ref as any}
        borderRadius={1000}
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={0}
        paddingVertical={0}
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
)
