import React from 'react'
import { Text, VStack } from 'snackui'

import { brandColor } from '../../colors'
import { RoutesTable, router } from '../../state/router'
import { isStringChild } from './isStringChild'
import { LinkProps } from './LinkProps'
import { useLink } from './useLink'

export function nav(navItem: any, linkProps: any, props: any, e: any) {
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
    children,
    // rest
    ...textProps
  } = allProps
  const { wrapWithLinkElement } = useLink(allProps)
  return wrapWithLinkElement(
    isStringChild(children) ? (
      <Text color={brandColor} {...textProps}>
        {children}
      </Text>
    ) : (
      children
    )
  )
}
