import './Link.css'

import { StackProps, Text, TextProps, prevent, useForceUpdate } from '@dish/ui'
import _ from 'lodash'
import React, { useCallback, useContext, useMemo } from 'react'

import { memoize } from '../../helpers/memoizeWeak'
import { HomeStateItem } from '../../state/home'
import { getNavigateToTags } from '../../state/home-tag-helpers'
import {
  NavigateItem,
  RoutesTable,
  getPathFromParams,
} from '../../state/router'
import { NavigableTag } from '../../state/Tag'
import { omStatic, useOvermindStatic } from '../../state/useOvermind'
import { CurrentStateID } from '../home/CurrentStateID'
import { LinkButtonNamedProps, LinkButtonProps } from './LinkButton'

export type LinkSharedProps = {
  fontWeight?: TextProps['fontWeight']
  fontSize?: TextProps['fontSize']
  lineHeight?: TextProps['lineHeight']
  ellipse?: boolean
  fastClick?: boolean
  replace?: boolean
  stopPropagation?: boolean
  disabledIfActive?: boolean
  tagName?: string
  preventNavigate?: boolean
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
    preventNavigate,
    ...restProps
  } = allProps
  const linkProps = useNormalizeLinkProps(allProps as any)
  const om = useOvermindStatic()
  const item = {
    name: linkProps['name'],
    params: linkProps['params'],
    replace: linkProps.replace,
  }
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
        if (!preventNavigate) {
          om.actions.router.navigate(navItem)
        }
      })
    },
    [navItem, onClick]
  )

  const elementName = tagName ?? 'a'
  const props = {
    href: getPathFromParams(navItem),
    ...restProps,
    onMouseDown: prevent,
    onMouseEnter: linkProps.onMouseEnter,
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
      ellipse={ellipse}
      fontSize={fontSize}
      lineHeight={lineHeight}
      fontWeight={fontWeight}
      display="inherit"
      color={color}
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
  e.preventDefault()
  e.stopPropagation()
  setTimeout(() => {
    cb?.(e)
  })
}

const useNormalizedLink = (
  props: Partial<LinkButtonProps>
): LinkButtonNamedProps | null => {
  const forceUpdate = useForceUpdate()
  const currentStateID = useContext(CurrentStateID)
  const state = window['om'].state.home.states.find(
    (x) => x.id === currentStateID
  )!
  const linkProps = getNormalizedLink(props, state)
  return useMemo(() => {
    if (linkProps) {
      return {
        ...linkProps,
        // @ts-ignore
        onMouseEnter() {
          forceUpdate()
          props['onMouseEnter']?.()
        },
      }
    }
    return null
  }, [linkProps])
}

const getNormalizedLink = memoize(
  (props: Partial<LinkButtonProps>, state: HomeStateItem) => {
    let tags: NavigableTag[] = []

    if ('tags' in props && Array.isArray(props.tags)) {
      tags = props.tags
    } else if ('tag' in props && !!props.tag) {
      if (props.tag.name !== 'Search') {
        tags.push(props.tag)
      }
    }

    tags = tags.filter(Boolean)

    if (tags.length) {
      const tagProps = getNavigateToTags(omStatic, {
        state,
        tags,
        disabledIfActive: props.disabledIfActive,
      })
      const hasOnPress = !!(tagProps?.onPress ?? props.onPress)
      return {
        ...tagProps,
        name: tagProps?.name,
        ...(hasOnPress && {
          onPress: asyncLinkAction((e) => {
            tagProps?.onPress?.(e)
            props.onPress?.(e)
          }),
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

    return null
  }
)

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
