import { isStringChild } from '../../helpers/isStringChild'
import { DRouteName } from '../../router'
import { useLink } from '../hooks/useLink'
import { LinkProps } from './LinkProps'
import { RoutesTable } from '@dish/router'
import { Text, TextAncestorContext, useTheme } from '@dish/ui'
import React, { forwardRef, useContext } from 'react'

export const Link = forwardRef(function Link<Name extends DRouteName = DRouteName>(
  allProps: LinkProps<Name, RoutesTable[Name]['params']>,
  ref
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
    underline,
    target,
    tags,
    tag,
    children,
    display,
    noWrapText,
    promptLogin,
    href,
    ...styleProps
  } = allProps
  const { wrapWithLinkElement } = useLink(allProps, styleProps)
  const isInParagraph = useContext(TextAncestorContext)
  return wrapWithLinkElement(
    isStringChild(children) && !noWrapText ? (
      <Text
        textDecorationLine={
          underline === false ? 'none' : isInParagraph || underline ? 'underline' : 'none'
        }
        color="$colorHover"
        display={display as any}
      >
        {children}
      </Text>
    ) : (
      children
    ),
    ref
  )
})
