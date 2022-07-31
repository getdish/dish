import { isStringChild } from '../../helpers/isStringChild'
import { DRouteName } from '../../router'
import { useLink } from '../hooks/useLink'
import { LinkProps } from './LinkProps'
import { RoutesTable } from '@dish/router'
import { SizableText, Text, TextAncestorContext, useTheme } from '@dish/ui'
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
    asChild,
    size,
    ...styleProps
  } = allProps
  const { wrapWithLinkElement } = useLink(allProps, styleProps, asChild)
  const isInParagraph = useContext(TextAncestorContext)
  return wrapWithLinkElement(
    isStringChild(children) && !noWrapText ? (
      <SizableText
        textDecorationLine={
          underline === false ? 'none' : isInParagraph || underline ? 'underline' : 'none'
        }
        color="$colorHover"
        fontFamily="$body"
        display={display as any}
        size={size}
      >
        {children}
      </SizableText>
    ) : (
      children
    ),
    ref
  )
})
