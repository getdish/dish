import React, { useEffect, useState } from 'react'
import { Button } from 'snackui'

import { RoutesTable, router } from '../../router'
import { useLink } from '../hooks/useLink'
import { LinkButtonProps } from './LinkProps'

export function LinkButton<Name extends keyof RoutesTable = keyof RoutesTable>(
  props: LinkButtonProps<Name, RoutesTable[Name]['params']>
) {
  const [isActive, setIsActive] = useState(false)
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
    enableActiveStyle,
    activeTextStyle,
    textProps,
    opacity,
    disabled,
    ...restProps
  } = props

  useEffect(() => {
    if (!props.enableActiveStyle) {
      return
    }
    if (props.name) {
      let last = false
      const check = (val: string) => {
        const match = val === props.name
        if (match == last) return
        setIsActive(match)
        last = match
      }
      check(router.curPage.name)
      return router.onRouteChange(() => {
        check(router.curPage.name)
      })
    }
  }, [props.name])

  return wrapWithLinkElement(
    <Button
      minHeight={10} // temp react-native
      disabled={disabled}
      {...restProps}
      {...(isActive && props.activeStyle)}
      textProps={isActive ? props.activeTextStyle : textProps}
      opacity={opacity}
      {...(disabled &&
        typeof opacity !== 'number' && {
          opacity: 0.5,
        })}
    >
      {getChildren(props, isActive)}
    </Button>
  )
}

const getChildren = (props: LinkButtonProps, isActive: boolean) => {
  if (typeof props.children === 'function') {
    return props.children(isActive)
  }
  return props.children
}
