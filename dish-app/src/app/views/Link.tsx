import React from 'react'
import { Text, VStack } from 'snackui'

import { brandColor } from '../../constants/colors'
import { isStringChild } from '../../helpers/isStringChild'
import { RoutesTable } from '../../router'
import { useLink } from '../hooks/useLink'
import { LinkProps } from './LinkProps'

export function Link<Name extends keyof RoutesTable = keyof RoutesTable>(
  allProps: LinkProps<Name, RoutesTable[Name]['params']>
) {
  const {
    // non-text props for useLink
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
    ...textProps
  } = allProps
  const { wrapWithLinkElement } = useLink(allProps)
  return wrapWithLinkElement(
    !!Object.keys(textProps).length || isStringChild(children) ? (
      // @ts-expect-error we are allowing display="inline"
      <Text color={brandColor} {...textProps}>
        {children}
      </Text>
    ) : (
      children
    )
  )
}
