import './Link.css'

import { idle, series } from '@dish/async'
import { Text } from '@dish/ui'
import React, { useEffect, useRef, useState } from 'react'

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
  const { onPress, name, params, ...linkProps } = useNormalizeLinkProps(
    restProps as any
  )
  const om = useOvermindStatic()
  const linkRef = useRef<HTMLElement | null>(null)
  const navItem: NavigateItem = {
    name,
    params,
    replace,
  }
  const elementName = tagName ?? 'a'

  useEffect(() => {
    if (!linkRef.current) return
    let cancel = null
    let event = null

    const nav = () => {
      if (onPress || onClick) {
        onClick?.(event!)
        onPress?.(event)
      } else {
        if (!preventNavigate && !!navItem.name) {
          om.actions.router.navigate(navItem)
        }
      }
      if (replaceSearch) {
        om.actions.home.clearSearch()
      }
    }

    const handleClick = (e: any) => {
      e.stopPropagation()
      if (allProps.target) {
        // let it go
      } else {
        e.preventDefault()
        event = e
        if (asyncClick) {
          cancel = series([() => idle(20), nav])
        } else {
          nav()
        }
      }
    }

    linkRef.current.addEventListener('click', handleClick)

    return () => {
      linkRef.current.removeEventListener('click', handleClick)
      if (cancel) {
        nav()
        cancel()
      }
    }
  }, [])

  const props = {
    ref: linkRef,
    href: getPathFromParams(navItem),
    ...linkProps,
    className: `${className ?? ''} dish-link`,
    style,
  }

  return React.createElement<any>(
    elementName,
    props,
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
}
