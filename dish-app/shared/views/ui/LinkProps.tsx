import React from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { StackProps, TextProps } from 'snackui'

import { NavigableTag } from '../../state/NavigableTag'
import { RouteName } from '../../state/router'

type AProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export type LinkProps<A, B> = LinkSharedProps & {
  name?: A
  params?: B
  tagName?: string
}

export type LinkSharedProps = Pick<
  AProps,
  'href' | 'target' | 'children' | 'className' | 'onClick'
> & {
  tag?: NavigableTag
  tags?: NavigableTag[]
  replace?: boolean
  ellipse?: boolean
  replaceSearch?: boolean
  disallowDisableWhenActive?: boolean
  preventNavigate?: boolean
  navigateAfterPress?: boolean
  onMouseDown?: Function
  asyncClick?: boolean
  // text styles
  color?: TextProps['color']
  fontWeight?: TextProps['fontWeight']
  textAlign?: TextProps['textAlign']
  fontSize?: TextProps['fontSize']
  lineHeight?: TextProps['lineHeight']
  maxWidth?: TextProps['maxWidth']
  maxHeight?: TextProps['maxHeight']
  backgroundColor?: TextProps['backgroundColor']
  margin?: TextProps['margin']
  marginHorizontal?: TextProps['marginHorizontal']
  marginVertical?: TextProps['marginVertical']
  paddingHorizontal?: TextProps['paddingHorizontal']
  padding?: TextProps['padding']
  paddingVertical?: TextProps['paddingVertical']
  borderRadius?: TextProps['borderRadius']
  flex?: TextProps['flex']
  width?: TextProps['width']
  height?: TextProps['height']
}

export type LinkButtonNamedProps<A = any, B = any> = {
  name?: A
  params?: B
  onPress?: Function
}

export type LinkButtonProps<
  Name extends RouteName = any,
  Params = any
> = StackProps &
  LinkSharedProps & {
    enableActiveStyle?: boolean
    activeStyle?: ViewStyle
  } & LinkButtonNamedProps<Name, Params>
