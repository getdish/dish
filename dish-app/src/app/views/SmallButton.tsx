import React from 'react'
import { Button, ButtonProps, Tooltip, themeable, useTheme } from 'snackui'

import { isWeb } from '../../constants/constants'

export type SmallButtonProps = ButtonProps & {
  tooltip?: string
}

export const SmallButton = themeable(
  ({ children, tooltip, theme: themeProp, ...rest }: SmallButtonProps) => {
    const theme = useTheme()

    let contents = (
      <Button
        borderRadius={200}
        borderWidth={1}
        borderColor={theme.borderColor}
        {...(isWeb && {
          minHeight: 36,
          minWidth: 44,
        })}
        {...(!isWeb && {
          minHeight: 42,
          minWidth: 48,
        })}
        backgroundColor={theme.backgroundColorTransluscent}
        hoverStyle={{
          backgroundColor: theme.backgroundColorTransluscent,
        }}
        {...rest}
      >
        {children}
      </Button>
    )

    if (tooltip) {
      return <Tooltip contents={tooltip}>{contents}</Tooltip>
    }

    return contents
  }
)
