import React from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { ButtonProps, StackProps, TextProps } from 'snackui'

import { RouteName } from '../../router'
import { NavigableTag } from '../../types/tagTypes'

type AProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export type LinkProps<A, B> = LinkSharedProps &
  Omit<TextProps, 'display'> & {
    display?: TextProps['display'] | 'inline'
    name?: A
    // @ts-ignore
    params?: B
    tagName?: string
  }

export type LinkSharedProps = Pick<
  AProps,
  'href' | 'target' | 'children' | 'className' | 'onClick'
> & {
  tag?: Partial<NavigableTag> | null
  tags?: Partial<NavigableTag>[] | null
  replace?: boolean
  stopPropagation?: boolean
  replaceSearch?: boolean
  disallowDisableWhenActive?: boolean
  preventNavigate?: boolean
  navigateAfterPress?: boolean
  asyncClick?: boolean
  onMouseDown?: Function | null
}

export type LinkButtonNamedProps<A = any, B = any> = {
  name?: A | null
  params?: B | null
  onPress?: Function
}

export type LinkButtonProps<
  Name extends RouteName = any,
  Params = any
> = StackProps &
  ButtonProps &
  LinkSharedProps & {
    enableActiveStyle?: boolean
    activeStyle?: ViewStyle
    activeTextStyle?: TextStyle
  } & LinkButtonNamedProps<Name, Params>
