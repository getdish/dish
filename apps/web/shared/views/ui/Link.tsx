import './Link.css'

import { fullyIdle, series } from '@dish/async'
import { Text, prevent } from '@dish/ui'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

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
    replaceSearch,
    tagName,
    preventNavigate,
    className,
    asyncClick,
    textAlign,
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
  const [clickEvent, setClickEvent] = useState(null)
  const navItem: NavigateItem = {
    name,
    params,
    replace,
  }
  const elementName = tagName ?? 'a'

  useEffect(() => {
    if (!clickEvent) return
    return series([
      () => (asyncClick ? fullyIdle(linkActionIdle) : null),
      () => {
        onClick?.(clickEvent!)
        onPress?.(clickEvent)
        if (replaceSearch) {
          om.actions.home.clearSearch()
        }
        if (!preventNavigate) {
          om.actions.router.navigate(navItem)
        }
      },
    ])
  }, [clickEvent])

  const content = (
    <Text
      ellipse={ellipse}
      fontSize={fontSize}
      lineHeight={lineHeight}
      fontWeight={fontWeight}
      // @ts-ignore
      display="inline-flex"
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
      onClick: (e) => {
        prevent(e)
        e.persist()
        setClickEvent(e)
      },
      className: `${className ?? ''}${inline ? ' inline-flex' : ''}`,
      style: {
        cursor: 'pointer',
        maxWidth: '100%',
        flexDirection: 'inherit',
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
