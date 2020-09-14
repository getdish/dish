import { StackProps, TextProps } from '@dish/ui'
import React from 'react'
import { TextStyle, ViewStyle } from 'react-native'

import { NavigableTag } from '../../state/NavigableTag'
import { RouteName } from '../../state/router'

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
  replaceSearch?: boolean
  disallowDisableWhenActive?: boolean
  tagName?: string
  preventNavigate?: boolean
  navigateAfterPress?: boolean
  onMouseDown?: Function
  asyncClick?: boolean
  color?: string
  backgroundColor?: string
  paddingHorizontal?: number
  paddingVertical?: number
  borderRadius?: number
  maxWidth?: number | string
}

export type LinkButtonNamedProps<A = any, B = any> = {
  name?: A
  params?: B
  tags?: NavigableTag[]
  tag?: NavigableTag | null
  replace?: boolean
  onPress?: Function
}

export type LinkButtonProps<
  Name extends RouteName = any,
  Params = any
> = StackProps &
  LinkSharedProps & {
    activeStyle?: ViewStyle
    activeTextStyle?: TextStyle
  } & LinkButtonNamedProps<Name, Params>
