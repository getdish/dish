import { DRouteName } from '../../router'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'
import { RoutesTable } from '@dish/router'
import { ThemeInverse } from '@tamagui/core'
import React, { forwardRef } from 'react'

export const OverlayLinkButton = forwardRef(function OverlayLinkButtonContent<
  Name extends DRouteName = DRouteName,
  Params = RoutesTable[Name]['params']
>({ children, ...props }: LinkButtonProps<Name, Params>, ref) {
  return (
    <>
      {/* @ts-ignore */}
      <LinkButton ref={ref} chromeless size="$5" elevate pointerEvents="auto" {...props}>
        {children}
      </LinkButton>
    </>
  )
})
