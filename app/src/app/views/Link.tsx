import { RoutesTable } from '@dish/router'
import { ParagraphContext, Text, useTheme } from '@dish/ui'
import React, { forwardRef, useContext } from 'react'

import { red400 } from '../../constants/colors'
import { isStringChild } from '../../helpers/isStringChild'
import { DRouteName } from '../../router'
import { useLink } from '../hooks/useLink'
import { LinkProps } from './LinkProps'

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
    promptLogin,
    href,
    ...styleProps
  } = allProps
  const { wrapWithLinkElement } = useLink(allProps, styleProps)
  const theme = useTheme()
  const isInParagraph = useContext(ParagraphContext)
  return wrapWithLinkElement(
    isStringChild(children) ? (
      <Text
        textDecorationLine={
          underline === false ? 'none' : isInParagraph || underline ? 'underline' : 'none'
        }
        color={theme.colorAlt}
        display={display as any}
        {...(isInParagraph && {
          color: red400,
          hoverStyle: {
            color: `${red400}99`,
          },
        })}
      >
        {children}
      </Text>
    ) : (
      children
    ),
    ref
  )
})
