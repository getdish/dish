import { Button, ButtonProps } from '@dish/ui'
import { CornerLeftUp, X } from '@tamagui/feather-icons'
import React, { forwardRef, memo } from 'react'

type CircleButtonProps = ButtonProps

export const CloseButton = (props: CircleButtonProps) => {
  return <SmallCircleButton size="$5" icon={X} {...props} />
}

export const BackButton = memo((props: CircleButtonProps) => {
  return <SmallCircleButton icon={CornerLeftUp} {...props} />
})

export const SmallCircleButton = forwardRef(
  ({ children, width, height, size = 44, ...props }: CircleButtonProps, ref) => {
    return (
      <Button ref={ref as any} circular size={size} {...props}>
        {children}
      </Button>
    )
  }
)
