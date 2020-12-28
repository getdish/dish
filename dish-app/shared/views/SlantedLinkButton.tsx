import React from 'react'

import { slantedBoxStyle } from '../constants'
import { LinkButton } from './ui/LinkButton'
import { LinkButtonProps } from './ui/LinkProps'

export const SlantedLinkButton = (props: LinkButtonProps) => {
  return <LinkButton {...slantedBoxStyle} {...props} />
}
