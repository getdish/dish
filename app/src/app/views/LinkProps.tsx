import React from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { ButtonProps, StackProps, TextProps } from 'snackui'

import { DRouteName } from '../../router'
import { NavigableTag } from '../../types/tagTypes'

type AProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export type LinkProps<A, B> = LinkSharedProps &
  Omit<TextProps, 'display'> & {
    display?: TextProps['display'] | 'inline'
    name?: A | null
    // @ts-ignore
    params?: B
    tagName?: string
    underline?: boolean
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
  promptLogin?: boolean
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

export type LinkButtonProps<Name extends DRouteName = any, Params = any> = StackProps &
  ButtonProps &
  LinkSharedProps & {
    tooltip?: string
    isActive?: boolean
    activeStyle?: ViewStyle
    activeTextStyle?: TextStyle
  } & LinkButtonNamedProps<Name, Params>
