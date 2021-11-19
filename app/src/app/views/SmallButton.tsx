import { Button, ButtonProps, Tooltip, combineRefs, themeable, useTheme } from '@dish/ui'
import React, { forwardRef } from 'react'

export type SmallButtonProps = ButtonProps & {
  tooltip?: string | null
}

export const SmallButton = themeable(
  forwardRef(
    ({ children, tooltip, theme: themeProp, textProps, ...rest }: SmallButtonProps, ref) => {
      const theme = useTheme()

      const getContents = (props) => (
        <Button
          {...props}
          ref={combineRefs(props.ref, ref)}
          borderRadius={200}
          borderWidth={0.5}
          borderColor={theme.borderColor}
          backgroundColor={theme.backgroundColor}
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
        return <Tooltip trigger={getContents}>{tooltip}</Tooltip>
      }

      return getContents({})
    }
  )
)
