import React from 'react'

import { slantedBoxStyle } from '../../constants/constants'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

export const SlantedLinkButton = (props: LinkButtonProps) => {
  return <LinkButton {...slantedBoxStyle} {...props} />
}
