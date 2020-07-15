import './Link.css'

import { idle, series } from '@dish/async'
import { Text } from '@dish/ui'
import React, { useEffect, useState } from 'react'

import {
  NavigateItem,
  RoutesTable,
  getPathFromParams,
} from '../../state/router'
import { useOvermindStatic } from '../../state/useOvermind'
import { LinkProps } from './LinkProps'
import { useNormalizeLinkProps } from './useNormalizedLink'

export function Link<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(allProps: LinkProps<Name, Params>) {
  const {
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
    style,
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
      // idle helps our pressOut animations run smoother...
      () => (asyncClick ? idle(20) : null),
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
        setClickEvent(null)
      },
    ])
  }, [clickEvent, name, params, replace])

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
        e.stopPropagation()
        if (allProps.target) {
          // let it go
        } else {
          e.preventDefault()
          e.persist()
          setClickEvent(e)
        }
      },
      className,
      style: {
        cursor: 'pointer',
        maxWidth: '100%',
        flexDirection: 'inherit',
        ...style,
      },
    },
    content
  )
}
