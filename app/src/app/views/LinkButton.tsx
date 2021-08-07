import { RoutesTable } from '@dish/router'
import React from 'react'
import { useThemeName } from 'snackui'
import { Button } from 'snackui'

import { colorNames } from '../../constants/colors'
import { DRouteName } from '../../router'
import { useLink } from '../hooks/useLink'
import { LinkButtonProps } from './LinkProps'

export function LinkButton<Name extends DRouteName = DRouteName>(
  props: LinkButtonProps<Name, RoutesTable[Name]['params']>
) {
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
}

const getChildren = (props: LinkButtonProps, isActive?: boolean) => {
  if (typeof props.children === 'function') {
    return props.children(isActive)
  }
  return props.children
}
