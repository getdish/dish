import { RoutesTable } from '@dish/router'
import React, { useContext } from 'react'
import { ParagraphContext, Text, useTheme } from 'snackui'

import { brandColor, red400 } from '../../constants/colors'
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
    underline,
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
  const theme = useTheme()
  const isInParagraph = useContext(ParagraphContext)
  return wrapWithLinkElement(
    !!Object.keys(textProps).length || isStringChild(children) ? (
      <Text
        textDecorationLine={isInParagraph || underline ? 'underline' : 'none'}
        color={theme.colorAlt}
        display={display as any}
        {...(isInParagraph && {
          color: red400,
          hoverStyle: {
            color: `${red400}99`,
          },
        })}
        {...textProps}
      >
        {children}
      </Text>
    ) : (
      children
    )
  )
}
