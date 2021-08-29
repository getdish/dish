import { RoutesTable } from '@dish/router'
import React from 'react'

import { DRouteName } from '../../router'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

export function OverlayLinkButton<
  Name extends DRouteName = DRouteName,
  Params = RoutesTable[Name]['params']
>({ Icon, children, ...props }: LinkButtonProps<Name, Params> & { Icon?: any }) {
  return (
    <LinkButton
      paddingVertical={10}
      paddingHorizontal={16}
      marginHorizontal={2}
      borderRadius={90}
      minHeight={46}
      shadowColor="rgba(0,0,0,0.3)"
      shadowRadius={10}
      shadowOffset={{ width: 0, height: 2 }}
      overflow="hidden"
      pointerEvents="auto"
      textProps={{
        fontWeight: '600',
        fontSize: 14,
      }}
      icon={!Icon || React.isValidElement(Icon) ? Icon : <Icon size={16} color="#fff" />}
      {...props}
    >
      {children}
    </LinkButton>
  )
}
