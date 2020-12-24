import React, { useEffect, useRef, useState } from 'react'
import { HStack, Text } from 'snackui'

import { omStatic } from '../../state/omStatic'
import { RoutesTable } from '../../state/router'
import { isStringChild } from './isStringChild'
import { LinkButtonProps } from './LinkProps'
import { useLink } from './useLink'

export function LinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(props: LinkButtonProps<Name, Params>) {
  const containerRef = useRef<any>()
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
    ...restProps
  } = props

  useEffect(() => {
    if (!props.enableActiveStyle) return
    if (props.name) {
      let last = false
      const check = (val: string) => {
        const match = val === props.name
        if (match == last) return
        setIsActive(match)
        last = match
      }
      check(omStatic.state.router.curPageName)
      return omStatic.reaction((state) => state.router.curPageName, check)
    }
  }, [props.name])

  return wrapWithLinkElement(
    <HStack
      // inline-flex only on web...
      className={`ease-in-out-faster inline-flex`}
      // only handle click events on non-a links (we handle them in Link separately)
      // @ts-ignore
      ref={'name' in props ? null : containerRef}
      pressStyle={{
        ...props.hoverStyle,
        opacity: 0.7,
        transform: [{ scale: 0.96 }],
      }}
      // @ts-ignore
      minHeight={10} // temp react-native
      cursor="pointer"
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
        >
          {getChildren(props, isActive)}
        </Text>
      )}
    </HStack>
  )
}

const getChildren = (props: LinkButtonProps, isActive: boolean) => {
  if (typeof props.children === 'function') {
    return props.children(isActive)
  }
  return props.children
}
