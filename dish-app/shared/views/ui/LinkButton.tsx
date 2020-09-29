import { HStack, Text } from '@dish/ui'
import React, { useEffect, useRef, useState } from 'react'

import { omStatic } from '../../state/omStatic'
import { RoutesTable } from '../../state/router'
import { useLink } from './Link'
import { LinkButtonProps } from './LinkProps'

export function LinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(props: LinkButtonProps<Name, Params>) {
  const containerRef = useRef<any>()
  const [isActive, setIsActive] = useState(false)
  const { wrapWithLinkElement } = useLink(props)

  useEffect(() => {
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
    activeTextStyle,
    tags,
    tag,
    name,
    params,
    onPress,
    ...restProps
  } = props

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
      {typeof children !== 'string' ? (
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
          {...(isActive && activeTextStyle)}
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
