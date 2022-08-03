import { Button, ButtonProps } from '@dish/ui'
import { CornerLeftUp, X } from '@tamagui/feather-icons'
import React, { forwardRef, memo } from 'react'

export const CloseButton = (props: ButtonProps) => {
  return <SmallCircleButton icon={X} {...props} />
}

export const BackButton = memo((props: ButtonProps) => {
  return <SmallCircleButton icon={CornerLeftUp} {...props} />
})

export const SmallCircleButton = forwardRef(
  ({ children, width, height, size = '$4', ...props }: ButtonProps, ref) => {
    return (
      <Button ref={ref as any} size={size} circular {...props}>
        {children}
      </Button>
    )
  }
)
