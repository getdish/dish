import { Button, ButtonProps, Tooltip, combineRefs, themeable, useTheme } from '@dish/ui'
import React, { forwardRef } from 'react'

export type SmallButtonProps = ButtonProps & {
  tooltip?: string | null
}

// todo can make extractable move to dish/ui

export const SmallButton = themeable(
  forwardRef(({ children, tooltip, theme: themeProp, ...rest }: SmallButtonProps, ref) => {
    const theme = useTheme()

    const contents = (
      <Button
        ref={ref}
        borderRadius={200}
        borderColor={theme.borderColor}
        backgroundColor={theme.bg}
        hoverStyle={{
          backgroundColor: theme.bg2,
        }}
        pressStyle={{
          backgroundColor: theme.bg3,
        }}
        {...(themeProp == 'active' && {
          backgroundColor: theme.bg,
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

SmallButton.defaultProps = {
  size: '$3',
}
