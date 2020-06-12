import './Link.css'

import { Text, prevent } from '@dish/ui'
import React from 'react'

import {
  NavigateItem,
  RoutesTable,
  getPathFromParams,
} from '../../state/router'
import { useOvermindStatic } from '../../state/useOvermind'
import { combineFns } from './combineFns'
import { LinkProps } from './LinkProps'
import { useNormalizeLinkProps } from './useNormalizedLink'

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
    className,
    textAlign,
    ...restProps
  } = allProps
  const { onPress, onMouseDown, ...linkProps } = useNormalizeLinkProps(
    allProps as any
  )
  const om = useOvermindStatic()
  const item = {
    name: linkProps['name'],
    params: linkProps['params'],
    replace: linkProps.replace,
  }
  const navItem: NavigateItem = {
    name: name ?? item?.name,
    params: params ?? item?.params,
    replace: !!(replace ?? item?.replace),
  }
  const elementName = tagName ?? 'a'
  const handleClick = (e) => {
    if (allProps.href) {
      e.stopPropagation()
      return
    }
    prevent(e)
    if (onClick) {
      onClick?.(e)
    }
    setTimeout(() => {
      onPress?.()
      if (!preventNavigate) {
        om.actions.router.navigate(navItem)
      }
    })
  }
  const content = (
    <Text
      ellipse={ellipse}
      fontSize={fontSize}
      lineHeight={lineHeight}
      fontWeight={fontWeight}
      display="inherit"
      color={color}
      textAlign={textAlign}
    >
      {children}
    </Text>
  )
  return React.createElement(
    elementName,
    {
      href: getPathFromParams(navItem),
      ...restProps,
      onMouseDown: combineFns(
        onMouseDown,
        restProps['onMouseDown'],
        fastClick ? handleClick : null
      ),
      ...(!fastClick && {
        onClick: handleClick,
      }),
      className: `${className ?? ''} ${inline ? 'inline-flex' : ' flex'}`,
      style: {
        cursor: 'pointer',
        maxWidth: '100%',
        flex: 1,
        padding,
      },
    },
    content
  )
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
