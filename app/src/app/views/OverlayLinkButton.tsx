import { RoutesTable } from '@dish/router'
import React, { forwardRef } from 'react'

import { DRouteName } from '../../router'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

export const OverlayLinkButton = forwardRef(function OverlayLinkButtonContent<
  Name extends DRouteName = DRouteName,
  Params = RoutesTable[Name]['params']
>({ children, ...props }: LinkButtonProps<Name, Params>, ref) {
  return (
    <LinkButton
      ref={ref}
      paddingVertical={10}
      paddingHorizontal={16}
      marginHorizontal={2}
      borderRadius={90}
      minHeight={46}
      elevation="$3"
      overflow="hidden"
      pointerEvents="auto"
      {...props}
    >
      {children}
    </LinkButton>
  )
})
