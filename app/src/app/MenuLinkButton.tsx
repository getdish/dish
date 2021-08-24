import React from 'react'

import { appMenuStore } from './AppMenuStore'
import { LinkButton } from './views/LinkButton'
import { LinkButtonProps } from './views/LinkProps'

export const MenuLinkButton = (props: LinkButtonProps) => {
  return (
    <LinkButton
      width="100%"
      paddingVertical={16}
      paddingHorizontal={16}
      borderRadius={0}
      backgroundColor="transparent"
      justifyContent="flex-start"
      onPressOut={appMenuStore.hide}
      {...props}
    />
  )
}
