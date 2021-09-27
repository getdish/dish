import { CornerLeftUp, X } from '@dish/react-feather'
import React, { forwardRef, memo } from 'react'
import { Button, ButtonProps } from 'snackui'

type CircleButtonProps = ButtonProps & {
  size?: number
  shadowed?: boolean
}

export const CloseButton = (props: CircleButtonProps) => {
  return (
    <SmallCircleButton shadowed {...props}>
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
  ({ shadowed, children, width, height, size = 44, ...props }: CircleButtonProps, ref) => {
    return (
      <Button
        ref={ref as any}
        borderRadius={1000}
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={0}
        paddingVertical={0}
        {...(shadowed && {
          elevation: 1,
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
)
