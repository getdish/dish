import './Link.css'

import { idle, series, sleep } from '@dish/async'
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
    navigateAfterPress,
    ...restProps
  } = allProps
  const { onPress, name, params, ...linkProps } = useNormalizeLinkProps(
    restProps as any
  )
  const cancel = useRef<Function | null>(null)
  const linkRef = useRef<HTMLElement | null>(null)
  const navItem: NavigateItem = {
    name,
    params,
    replace,
  }
  const elementName = tagName ?? 'a'

  useEffect(() => {
    return () => {
      cancel.current?.()
    }
  }, [])

  const props = {
    ref: linkRef,
    href: router.getPathFromParams(navItem),
    onClick: (e: any) => {
      e.stopPropagation()
      if (window['prevent_']) {
        return
      }
      if (allProps.target) {
        // let it go
      } else {
        e.preventDefault()
        event = e
        if (asyncClick) {
          cancel.current = series([
            () => sleep(50),
            () => {
              cancel.current = null
              nav()
            },
          ])
        } else {
          nav()
        }
      }
      function nav() {
        console.warn('nav', onPress, onClick, preventNavigate)
        if (onPress || onClick) {
          e.navigate = () => router.navigate(navItem)
          onClick?.(e!)
          onPress?.(e)
        } else {
          if (!preventNavigate && !!navItem.name) {
            router.navigate(navItem)
          }
        }
      }
    },
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
