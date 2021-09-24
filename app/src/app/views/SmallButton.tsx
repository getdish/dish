import React from 'react'
import { Button, ButtonProps, Tooltip, themeable, useTheme } from 'snackui'

export type SmallButtonProps = ButtonProps & {
  tooltip?: string | null
}

export const SmallButton = themeable(
  ({ children, tooltip, theme: themeProp, textProps, ...rest }: SmallButtonProps) => {
    const theme = useTheme()

    let contents = (
      <Button
        borderRadius={200}
        borderWidth={0.5}
        borderColor={theme.borderColor}
        backgroundColor={theme.backgroundColor}
        // borderColor={theme.borderColor}
        // backgroundColor={theme.backgroundColorTransluscent}
        hoverStyle={{
          backgroundColor: theme.backgroundColorSecondary,
        }}
        pressStyle={{
          backgroundColor: theme.backgroundColorTertiary,
        }}
        {...(themeProp == 'active' && {
          backgroundColor: theme.backgroundColor,
        })}
        height={44}
        maxHeight={44}
        minWidth={44}
        textProps={{
          fontSize: 13,
          ...textProps,
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
