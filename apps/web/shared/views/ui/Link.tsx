import './Link.css'

import { idle, series } from '@dish/async'
import { NavigateItem } from '@dish/router'
import { Text } from '@dish/ui'
import React, { useEffect, useRef } from 'react'

import { RoutesTable, router } from '../../state/router'
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
  const linkRef = useRef<HTMLElement | null>(null)
  const navItem: NavigateItem = {
    name,
    params,
    replace,
  }
  const elementName = tagName ?? 'a'

  useEffect(() => {
    if (!linkRef.current) return
    let cancel: Function | null = null
    let event = null

    const nav = () => {
      if (onPress || onClick) {
        onClick?.(event!)
        onPress?.(event)
      } else {
        if (!preventNavigate && !!navItem.name) {
          router.navigate(navItem)
        }
      }
    }

    const handleClick = (e: any) => {
      e.stopPropagation()
      if (allProps.target) {
        // let it go
      } else {
        e.preventDefault()
        event = e
        cancel = series([() => idle(asyncClick ? 100 : 10), nav])
      }
    }

    linkRef.current?.addEventListener('click', handleClick)

    return () => {
      linkRef.current?.removeEventListener('click', handleClick)
      if (cancel) {
        console.warn(
          'TEST SKIPPING THIS TO SEE IF IT WAS CAUSING LOOP, DID YOU WANT TO NAV?',
          navItem
        )
        // nav()
        // cancel()
      }
    }
  }, [])

  const props = {
    ref: linkRef,
    href: router.getPathFromParams(navItem),
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
