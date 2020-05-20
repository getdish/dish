import './Link.css'

import _ from 'lodash'
import React, { useCallback, useContext, useMemo } from 'react'
import { Text, TextStyle } from 'react-native'

import { currentStates } from '../../state/home'
import { getNavigateToTags } from '../../state/home-tag-helpers'
import {
  NavigateItem,
  RoutesTable,
  getPathFromParams,
} from '../../state/router'
import { NavigableTag } from '../../state/Tag'
import { useOvermindStatic } from '../../state/useOvermind'
import { CurrentStateID } from '../home/CurrentStateID'
import { LinkButtonNamedProps, LinkButtonProps } from './LinkButton'
import { prevent } from './prevent'
import { StackProps } from './Stacks'

export type LinkSharedProps = {
  fontWeight?: TextStyle['fontWeight']
  fontSize?: TextStyle['fontSize']
  lineHeight?: TextStyle['lineHeight']
  ellipse?: boolean
  fastClick?: boolean
  replace?: boolean
  stopPropagation?: boolean
  disabledIfActive?: boolean
  tagName?: string
}

type LinkProps<A, B> = React.DetailedHTMLProps<
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

export function Link<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(allProps: LinkProps<Name, Params>) {
  const {
    name,
    params,
    inline,
    fontSize,
    fontWeight,
    children,
    ellipse,
    lineHeight,
    fastClick,
    padding,
    color,
    onClick,
    replace,
    tagName,
    ...restProps
  } = allProps
  const linkProps = useNormalizeLinkProps(allProps as any)
  const om = useOvermindStatic()
  const item = _.pick(linkProps as any, 'name', 'params', 'replace')
  const navItem: NavigateItem = useMemo(
    () => ({
      name: name ?? item?.name,
      params: params ?? item?.params,
      replace: !!(replace ?? item?.replace),
    }),
    [name, params, replace, JSON.stringify(item)]
  )

  const handler = useCallback(
    (e) => {
      prevent(e)
      if (onClick) {
        onClick?.(e)
      }
      setTimeout(() => {
        if ('onPress' in linkProps) {
          linkProps?.onPress?.()
        }
        om.actions.router.navigate(navItem)
      })
    },
    [navItem, onClick]
  )

  const elementName = tagName ?? 'a'
  const props = {
    href: getPathFromParams(navItem),
    ...restProps,
    onMouseDown: prevent,
    onClick: prevent,
    [fastClick ? 'onMouseDown' : 'onClick']: handler,
    className: `${inline ? 'inline-flex' : ' flex'}`,
    style: {
      cursor: 'pointer',
      maxWidth: '100%',
      flex: 1,
      padding,
    },
  }
  const content = (
    <Text
      numberOfLines={ellipse ? 1 : undefined}
      style={
        {
          fontSize,
          lineHeight,
          fontWeight,
          display: 'inherit',
          color,
        } as any
      }
    >
      {children}
    </Text>
  )

  return React.createElement(elementName, props, content)
}

export const useNormalizeLinkProps = (
  props: Partial<LinkButtonProps>
): LinkButtonProps => {
  const normalized = useNormalizedLink(props)
  const next = { ...props, ...normalized }
  if ('tag' in next) {
    delete next['tag']
  }
  if ('tags' in next) {
    delete next['tags']
  }
  return next
}

export const asyncLinkAction = (cb?: Function) => (e) => {
  e.persist()
  e?.preventDefault()
  e?.stopPropagation()
  setTimeout(() => {
    cb?.(e)
  })
}

const useNormalizedLink = (
  props: Partial<LinkButtonProps>
): LinkButtonNamedProps => {
  const currentStateID = useContext(CurrentStateID)
  let tags: NavigableTag[] = []

  if ('tag' in props && !!props.tag) {
    if (props.tag.name !== 'Search') {
      tags.push(props.tag)
    }
  }
  if ('tags' in props && Array.isArray(props.tags)) {
    tags = props.tags
  }

  if (tags.length) {
    const state = currentStates.find((x) => x.id === currentStateID)
    const tagProps = getNavigateToTags(window['om'], {
      state,
      tags,
      disabledIfActive: props.disabledIfActive,
    })
    return {
      ...tagProps,
      onPress: asyncLinkAction((e) => {
        tagProps.onPress?.(e)
        props.onPress?.(e)
      }),
    }
  }

  if ('name' in props) {
    return {
      name: props.name,
      params: props.params,
      replace: props.replace,
      onPress: props.onPress,
    }
  }
}

export const getStylePadding = ({
  padding,
  paddingHorizontal,
  paddingVertical,
}: {
  padding: any
  paddingVertical: any
  paddingHorizontal: any
}) => {
  if (paddingHorizontal || paddingVertical) {
    return [paddingVertical ?? padding ?? 0, paddingHorizontal ?? padding ?? 0]
      .map((x) => (typeof x === 'number' ? `${x}px` : x))
      .join(' ')
  }
  return padding
}
