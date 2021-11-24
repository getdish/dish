import { Button, ButtonProps, Tooltip, combineRefs, themeable, useTheme } from '@dish/ui'
import React, { forwardRef } from 'react'

export type SmallButtonProps = ButtonProps & {
  tooltip?: string | null
}

export const SmallButton = themeable(
  forwardRef(
    ({ children, tooltip, theme: themeProp, textProps, ...rest }: SmallButtonProps, ref) => {
      const theme = useTheme()

      const contents = (
        <Button
          ref={ref}
          borderRadius={200}
          borderWidth={0.5}
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
        return <Tooltip tooltip={tooltip}>{contents}</Tooltip>
      }

      return contents
    }
  )
)
