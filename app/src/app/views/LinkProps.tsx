import { DRouteName } from '../../router'
import { NavigableTag } from '../../types/tagTypes'
import { ButtonProps, SizableTextProps, TextProps, YStackProps } from '@dish/ui'
import React from 'react'
import { TextStyle } from 'react-native'

type AProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export type LinkProps<A, B> = LinkSharedProps &
  Omit<SizableTextProps, 'display' | 'tag'> & {
    display?: SizableTextProps['display'] | 'inline'
    name?: A | null
    // @ts-ignore
    params?: B
    tagName?: string
    underline?: boolean
    noWrapText?: boolean
    disableDisplayContents?: boolean
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

export type LinkButtonProps<Name extends DRouteName = any, Params = any> = YStackProps &
  ButtonProps &
  LinkSharedProps & {
    tooltip?: string
    isActive?: boolean
    activeTextStyle?: TextStyle
  } & LinkButtonNamedProps<Name, Params>
