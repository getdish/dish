import { StackProps, TextProps } from '@dish/ui'
import React from 'react'
import { ViewStyle } from 'react-native'

import { RouteName } from '../../state/router'
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
  replace?: boolean
  disallowDisableWhenActive?: boolean
  tagName?: string
  preventNavigate?: boolean
  onMouseDown?: Function
  asyncClick?: boolean
  navigateAfterPress?: boolean
}

export type LinkButtonNamedProps<A = any, B = any> = {
  name: A
  params?: B
  replace?: boolean
  onPress?: any
}

export type LinkButtonProps<
  Name extends RouteName = any,
  Params = any
> = StackProps &
  LinkSharedProps &
  (
    | LinkButtonNamedProps<Name, Params>
    | {
        onPress?: any
      }
    | {
        tag: NavigableTag | null
        onPress?: Function
      }
    | {
        tags: NavigableTag[]
        onPress?: Function
      }
  )
