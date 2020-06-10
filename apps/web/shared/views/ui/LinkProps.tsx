import { StackProps, TextProps } from '@dish/ui'
import React from 'react'

import { NavigableTag } from '../../state/Tag'

export type LinkProps<A, B> = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  LinkSharedProps & {
    name?: A
    params?: B
    replace?: boolean
    inline?: boolean
    padding?: StackProps['padding']
    tag?: NavigableTag
  }

export type LinkSharedProps = {
  fontWeight?: TextProps['fontWeight']
  textAlign?: TextProps['textAlign']
  fontSize?: TextProps['fontSize']
  lineHeight?: TextProps['lineHeight']
  ellipse?: boolean
  fastClick?: boolean
  replace?: boolean
  stopPropagation?: boolean
  disabledIfActive?: boolean
  tagName?: string
  preventNavigate?: boolean
  onMouseDown?: Function
}
