import React, { useEffect, useRef, useState } from 'react'
import { Button, HStack, Text } from 'snackui'

import { isStringChild } from '../../helpers/isStringChild'
import { RoutesTable, router } from '../../router'
import { useLink } from '../hooks/useLink'
import { LinkButtonProps } from './LinkProps'

export function LinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(props: LinkButtonProps<Name, Params>) {
  const [isActive, setIsActive] = useState(false)
  const { wrapWithLinkElement } = useLink(props)

  const {
    children,
    fontSize,
    lineHeight,
    fontWeight,
    textAlign,
    ellipse,
    replace,
    color,
    disallowDisableWhenActive,
    tags,
    tag,
    name,
    params,
    onPress,
    enableActiveStyle,
    activeTextStyle,
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
      {...restProps}
      {...(isActive && props.activeStyle)}
    >
      {!isStringChild(props.children) ? (
        getChildren(props, isActive)
      ) : (
        <Text
          ellipse={ellipse}
          fontSize={fontSize}
          lineHeight={lineHeight}
          fontWeight={fontWeight}
          textAlign={textAlign}
          flexDirection={props.flexDirection ?? 'row'}
          flexWrap={props.flexWrap}
          color={color}
          cursor={props.disabled ? 'default' : 'pointer'}
          opacity={props.disabled ? 0.5 : 1}
          {...(isActive && props.activeTextStyle)}
        >
          {getChildren(props, isActive)}
        </Text>
      )}
    </Button>
  )
}

const getChildren = (props: LinkButtonProps, isActive: boolean) => {
  if (typeof props.children === 'function') {
    return props.children(isActive)
  }
  return props.children
}
