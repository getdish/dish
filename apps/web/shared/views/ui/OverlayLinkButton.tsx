import React from 'react'

import { RoutesTable } from '../../state/router'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

export function OverlayLinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(props: LinkButtonProps<Name, Params>) {
  return (
    <LinkButton
      backgroundColor="#fff"
      paddingVertical={9}
      paddingHorizontal={14}
      borderRadius={90}
      shadowColor="rgba(0,0,0,0.175)"
      shadowRadius={13}
      shadowOffset={{ width: 0, height: 3 }}
      overflow="hidden"
      {...props}
    />
  )
}
