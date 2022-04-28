import { Button, ButtonProps, Tooltip, themeable } from '@dish/ui'
import React, { forwardRef } from 'react'

export type SmallButtonProps = ButtonProps & {
  tooltip?: string | null
}

// todo can make extractable move to dish/ui

export const SmallButton = themeable(
  forwardRef(({ children, tooltip, theme: themeProp, ...rest }: SmallButtonProps, ref) => {
    const contents = (
      <Button
        ref={ref as any}
        borderRadius={200}
        hoverStyle={{
          backgroundColor: '$backgroundHover',
        }}
        pressStyle={{
          backgroundColor: '$backgroundPress',
        }}
        {...(themeProp == 'active' && {
          backgroundColor: '$background',
        })}
        {...rest}
      >
        {children}
      </Button>
    )

    if (tooltip) {
      return <Tooltip contents={tooltip}>{contents}</Tooltip>
    }

    return contents
  })
)

// @ts-expect-error
SmallButton.defaultProps = {
  size: '$3',
}
