import React from 'react'
import { Text, VStack } from 'snackui'

import { brandColor } from '../../constants/colors'
import { RoutesTable } from '../../state/router'
import { isStringChild } from './isStringChild'
import { LinkProps } from './LinkProps'
import { useLink } from './useLink'

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
