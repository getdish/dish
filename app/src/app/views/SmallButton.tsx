import { Button, ButtonProps, TooltipSimple, themeable } from '@dish/ui'
import React, { forwardRef } from 'react'

export type SmallButtonProps = ButtonProps & {
  tooltip?: string | null
}

// todo can make extractable move to dish/ui

export const SmallButton = themeable(
  forwardRef(
    ({ children, tooltip, theme: themeProp, size = '$3', ...rest }: SmallButtonProps, ref) => {
      const contents = (
        <Button
          ref={ref as any}
          size={size}
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
        return <TooltipSimple label={tooltip}>{contents}</TooltipSimple>
      }

      return contents
    }
  )
)
