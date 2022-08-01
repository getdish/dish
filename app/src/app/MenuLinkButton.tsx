import { appMenuStore } from './AppMenuStore'
import { LinkListItem } from './views/LinkListItem'
import { LinkButtonProps } from './views/LinkProps'
import React from 'react'

export const MenuLinkButton = (props: LinkButtonProps) => {
  return <LinkListItem onPress={appMenuStore.hide} {...props} />
}
