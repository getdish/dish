import './Link.css'

import { idle, series } from '@dish/async'
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
      () => (asyncClick ? idle(40) : null),
      () => {
        if (onPress || onClick) {
          onClick?.(clickEvent!)
          onPress?.(clickEvent)
        } else {
          if (!preventNavigate && !!navItem.name) {
            om.actions.router.navigate(navItem)
          }
        }
        if (replaceSearch) {
          om.actions.home.clearSearch()
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
      color={color}
      textAlign={textAlign}
      // @ts-ignore
      display="inline-flex"
      maxWidth="100%"
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
