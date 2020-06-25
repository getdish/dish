import './Link.css'

import { fullyIdle } from '@dish/async'
import { Text, prevent } from '@dish/ui'
import React from 'react'

import {
  NavigateItem,
  RoutesTable,
  getPathFromParams,
} from '../../state/router'
import { useOvermindStatic } from '../../state/useOvermind'
import { LinkProps } from './LinkProps'
import { linkActionIdle, useNormalizeLinkProps } from './useNormalizedLink'

export function Link<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(allProps: LinkProps<Name, Params>) {
  const {
    inline,
    fontSize,
    fontWeight,
    children,
    ellipse,
    lineHeight,
    padding,
    color,
    onClick,
    replace,
    tagName,
    preventNavigate,
    className,
    asyncClick,
    textAlign,
    navigateAfterPress,
    ...restProps
  } = allProps
  const {
    onPress,
    onMouseDown,
    name,
    params,
    ...linkProps
  } = useNormalizeLinkProps(restProps as any) as any
  const om = useOvermindStatic()
  const navItem: NavigateItem = {
    name,
    params,
    replace: linkProps['replace'],
  }
  const elementName = tagName ?? 'a'
  const handleClick = async (e) => {
    if (allProps.href) {
      e.stopPropagation()
      return
    }
    prevent(e)
    if (asyncClick) {
      await fullyIdle(linkActionIdle)
    }
    if (onClick) {
      onClick?.(e)
    } else if (onPress) {
      onPress?.()
      if (navigateAfterPress) {
        om.actions.router.navigate(navItem)
      }
    } else {
      if (!preventNavigate) {
        om.actions.router.navigate(navItem)
      }
    }
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
      onMouseDown,
      ...linkProps,
      onClick: handleClick,
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
