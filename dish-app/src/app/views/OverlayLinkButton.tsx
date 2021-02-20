import React from 'react'
import { BlurView, useTheme } from 'snackui'

import { RoutesTable } from '../../router'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

export function OverlayLinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>({
  Icon,
  children,
  ...props
}: LinkButtonProps<Name, Params> & { Icon?: any }) {
  const theme = useTheme()
  return (
    <BlurView borderRadius={20} marginHorizontal={5}>
      <LinkButton
        paddingVertical={8}
        paddingHorizontal={12}
        borderRadius={90}
        shadowColor="rgba(0,0,0,0.175)"
        shadowRadius={13}
        shadowOffset={{ width: 0, height: 3 }}
        overflow="hidden"
        pointerEvents="auto"
        hoverStyle={{
          transform: [{ scale: 1.025 }],
          backgroundColor: theme.backgroundColor,
        }}
        icon={
          !Icon || React.isValidElement(Icon) ? (
            Icon
          ) : (
            <Icon size={12} color="rgba(255,255,255,0.5)" />
          )
        }
        {...props}
      >
        {children}
      </LinkButton>
    </BlurView>
  )
}
