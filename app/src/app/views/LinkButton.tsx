import { RoutesTable } from '@dish/router'
import React, { forwardRef } from 'react'
import { Button } from 'snackui'

import { DRouteName } from '../../router'
import { useLink } from '../hooks/useLink'
import { LinkButtonProps } from './LinkProps'

export const LinkButton = forwardRef(function LinkButtonContent<
  Name extends DRouteName = DRouteName
>(props: LinkButtonProps<Name, RoutesTable[Name]['params']>, ref) {
  // @ts-ignore
  const { wrapWithLinkElement } = useLink(props)
  const {
    children,
    replace,
    disallowDisableWhenActive,
    tags,
    tag,
    name,
    params,
    onPress,
    isActive,
    activeStyle,
    activeTextStyle,
    textProps,
    opacity,
    theme,
    ...restProps
  } = props
  // const themeName = useThemeName()
  return wrapWithLinkElement(
    <Button
      ref={ref}
      {...restProps}
      {...(isActive && activeStyle)}
      textProps={isActive ? props.activeTextStyle : textProps}
      // {...(theme &&
      //   colorNames.includes(theme as any) &&
      //   themeName === 'dark' && {
      //     theme: `${theme}-dark`,
      //   })}
    >
      {getChildren(props, isActive)}
    </Button>
  )
})

const getChildren = (props: LinkButtonProps, isActive?: boolean) => {
  if (typeof props.children === 'function') {
    return props.children(isActive)
  }
  return props.children
}
