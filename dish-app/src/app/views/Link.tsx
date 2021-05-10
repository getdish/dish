import { RoutesTable } from '@dish/router'
import React from 'react'
import { Text } from 'snackui'

import { brandColor } from '../../constants/colors'
import { isStringChild } from '../../helpers/isStringChild'
import { DRouteName } from '../../router'
import { useLink } from '../hooks/useLink'
import { LinkProps } from './LinkProps'

export function Link<Name extends DRouteName = DRouteName>(
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
    display,
    promptLogin,
    href,
    ...textProps
  } = allProps
  const { wrapWithLinkElement } = useLink(allProps)
  return wrapWithLinkElement(
    !!Object.keys(textProps).length || isStringChild(children) ? (
      <Text color={brandColor} display={display as any} {...textProps}>
        {children}
      </Text>
    ) : (
      children
    )
  )
}
