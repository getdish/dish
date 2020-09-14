import { series, sleep } from '@dish/async'
import { NavigateItem } from '@dish/router'
import { Text, VStack, useForceUpdate } from '@dish/ui'
import React, { useEffect, useRef } from 'react'
import { Platform, TouchableOpacity } from 'react-native'

import { brandColor } from '../../colors'
import { isWeb } from '../../constants'
import { RoutesTable, router } from '../../state/router'
import { LinkProps } from './LinkProps'
import { getNormalizeLinkProps } from './useNormalizedLink'

export function Link<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(allProps: LinkProps<Name, Params>) {
  const {
    onClick,
    replaceSearch,
    disallowDisableWhenActive,
    preventNavigate,
    navigateAfterPress,
    onMouseDown,
    asyncClick,
    name,
    params,
    replace,
    target,

    // rest
    ...textProps
  } = allProps

  const forceUpdate = useForceUpdate()
  const linkProps = getNormalizeLinkProps(
    {
      name,
      params,
      replace,
      replaceSearch,
      disallowDisableWhenActive,
      preventNavigate,
      navigateAfterPress,
      onMouseDown,
    },
    forceUpdate
  )
  const cancel = useRef<Function | null>(null)
  const linkRef = useRef<HTMLAnchorElement | null>(null)
  const navItem: NavigateItem = {
    name,
    params,
    replace,
  }

  useEffect(() => {
    return () => {
      cancel.current?.()
    }
  }, [])

  const clickEvent = (e: any) => {
    if (target) {
      // let it go
    } else {
      e.preventDefault()
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
      if (linkProps.onPress || onClick) {
        e.navigate = () => router.navigate(navItem)
        onClick?.(e!)
        linkProps.onPress?.(e)
      } else {
        if (!preventNavigate && !!navItem.name) {
          router.navigate(navItem)
        }
      }
    }
  }

  const textContent = <Text color={brandColor} {...textProps} />

  if (Platform.OS === 'web') {
    return (
      <a
        ref={linkRef}
        onClick={clickEvent}
        className={`display-contents dish-link`}
        href={router.getPathFromParams(navItem)}
        onMouseEnter={linkProps.onMouseEnter}
      >
        {textContent}
      </a>
    )
  }

  return <TouchableOpacity onPress={clickEvent}>{textContent}</TouchableOpacity>
}
