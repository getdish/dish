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

export const useLink = (props: LinkProps<any, any>) => {
  const forceUpdate = useForceUpdate()
  const linkProps = getNormalizeLinkProps(props, forceUpdate)
  const cancel = useRef<Function | null>(null)
  const navItem: NavigateItem = {
    name: linkProps.name,
    params: linkProps.params,
    replace: linkProps.replace,
  }

  useEffect(() => {
    return () => {
      cancel.current?.()
    }
  }, [])

  const onPress = (e: any) => {
    if (isWeb) {
      // let it naturally go to target="_blank"
      if (props.target === '_blank') return
      if (e.metaKey || e.ctrlKey) {
        window.open(e.currentTarget.href, '_blank')
        return
      }
    }

    e.preventDefault()
    if (props.asyncClick) {
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

    function nav() {
      console.log('what is', linkProps.onPress)
      if (linkProps.onPress || props.onClick) {
        e.navigate = () => router.navigate(navItem)
        props.onClick?.(e!)
        linkProps.onPress?.(e)
      } else {
        if (!props.preventNavigate && !!navItem.name) {
          router.navigate(navItem)
        }
      }
    }
  }

  return {
    onPress,
    navItem,
    wrapWithLinkElement(children: any) {
      if (Platform.OS === 'web') {
        const element = props.tagName ?? 'a'
        return React.createElement(
          element,
          {
            onClick: onPress,
            className: `display-contents dish-link`,
            href: router.getPathFromParams(navItem),
            onMouseEnter: linkProps.onMouseEnter,
          },
          children
        )
      }
      return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
    },
  }
}

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
    tags,
    tag,
    // rest
    ...textProps
  } = allProps
  const { wrapWithLinkElement } = useLink(allProps)
  return wrapWithLinkElement(<Text color={brandColor} {...textProps} />)
}
