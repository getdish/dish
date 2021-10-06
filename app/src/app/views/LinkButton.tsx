import { RoutesTable } from '@dish/router'
import React, { forwardRef } from 'react'
import { Button, Tooltip, combineRefs } from 'snackui'

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
    tooltip,
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
  const getElement = (innerProps) =>
    wrapWithLinkElement(
      <Button
        {...restProps}
        ref={combineRefs(innerProps.ref, ref)}
        {...(isActive && activeStyle)}
        textProps={isActive ? props.activeTextStyle : textProps}
      >
        {getChildren(props, isActive)}
      </Button>
    )
  if (!!tooltip) {
    return <Tooltip trigger={getElement}>{tooltip}</Tooltip>
  }
  return getElement({})
})

const getChildren = (props: LinkButtonProps, isActive?: boolean) => {
  if (typeof props.children === 'function') {
    return props.children(isActive)
  }
  return props.children
}
