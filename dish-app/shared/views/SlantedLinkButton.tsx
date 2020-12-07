import React from 'react'

import { LinkButton } from './ui/LinkButton'
import { LinkButtonProps } from './ui/LinkProps'
import { slantedBoxStyle } from './ui/SlantedBox'

export const SlantedLinkButton = (props: LinkButtonProps) => {
  // @ts-expect-error incompatibility with snack-ui types
  return <LinkButton {...slantedBoxStyle} {...props} />
}
