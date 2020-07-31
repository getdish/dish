import { HStack, StackProps, Text } from '@dish/ui'
import React, { useLayoutEffect, useRef, useState } from 'react'

import { RoutesTable } from '../../state/router'
import { omStatic, useOvermindStatic } from '../../state/useOvermind'
import { Link } from './Link'
import { LinkButtonProps } from './LinkProps'
import { useNormalizeLinkProps } from './useNormalizedLink'

const getChildren = (props: LinkButtonProps, isActive: boolean) => {
  if (typeof props.children === 'function') {
    return props.children(isActive)
  }
  return props.children
}

export function LinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(allProps: LinkButtonProps<Name, Params>) {
  let restProps: StackProps
  let contents: React.ReactElement
  const containerRef = useRef<any>()
  // this handles the tag/name/params props
  let props = useNormalizeLinkProps(allProps)
  const [isActive, setIsActive] = useState(false)
  const om = useOvermindStatic()

  useLayoutEffect(() => {
    if (props.name) {
      let last = false
      const check = (val: string) => {
        const match = val === props.name
        if (match == last) return
        setIsActive(match)
        last = match
      }
      check(omStatic.state.router.curPageName)
      return om.reaction((state) => state.router.curPageName, check)
    }
  }, [props.name])

  if ('name' in props) {
    const {
      name,
      // @ts-ignore
      params,
      children,
      onPress,
      fontSize,
      ellipse,
      lineHeight,
      fontWeight,
      padding,
      paddingVertical,
      paddingHorizontal,
      disallowDisableWhenActive,
      replace,
      replaceSearch,
      preventNavigate,
      asyncClick,
      textAlign,
      activeTextStyle,
      color,
      alignItems,
      justifyContent,
      ...rest
    } = props
    restProps = rest
    contents = (
      <Link
        name={name}
        params={params}
        replace={replace}
        replaceSearch={replaceSearch}
        onClick={onPress}
        asyncClick={asyncClick ?? true}
        lineHeight={lineHeight}
        fontSize={fontSize}
        fontWeight={fontWeight}
        ellipse={ellipse}
        textAlign={textAlign}
        color={color ?? '#222'}
        preventNavigate={preventNavigate}
        {...(isActive && activeTextStyle)}
        style={{
          padding: getStylePadding({
            padding,
            paddingVertical,
            paddingHorizontal,
          }),
          width: '100%',
          flex: 1,
          alignItems,
          justifyContent,
        }}
      >
        {getChildren(props, isActive)}
      </Link>
    )
  } else {
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
      ...rest
    } = props
    restProps = rest
    contents = (
      <Text
        ellipse={ellipse}
        fontSize={fontSize}
        lineHeight={lineHeight}
        fontWeight={fontWeight}
        textAlign={textAlign}
        flexDirection={props.flexDirection ?? 'row'}
        flexWrap={props.flexWrap}
        color={color}
      >
        {getChildren(props, isActive)}
      </Text>
    )
  }

  return (
    <HStack
      // only handle click events on non-a links (we handle them in Link separately)
      // @ts-ignore
      ref={'name' in props ? null : containerRef}
      pressStyle={{
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
      }}
      {...restProps}
      {...(isActive && allProps.activeStyle)}
      className={`cursor-pointer ${props.className ?? 'ease-in-out-faster'}`}
    >
      {contents}
    </HStack>
  )
}

const getStylePadding = ({
  padding,
  paddingHorizontal,
  paddingVertical,
}: {
  padding: any
  paddingVertical: any
  paddingHorizontal: any
}) => {
  if (paddingHorizontal || paddingVertical) {
    return [paddingVertical ?? padding ?? 0, paddingHorizontal ?? padding ?? 0]
      .map((x) => (typeof x === 'number' ? `${x}px` : x))
      .join(' ')
  }
  return padding
}
