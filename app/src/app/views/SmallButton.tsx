import React from 'react'
import { Button, ButtonProps, Tooltip, themeable, useTheme } from 'snackui'

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
        backgroundColor={theme.backgroundColorTransluscent}
        hoverStyle={{
          backgroundColor: theme.backgroundColor,
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