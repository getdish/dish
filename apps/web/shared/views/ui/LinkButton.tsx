import { StackProps, Text, VStack, getNode, prevent } from '@dish/ui'
import React, { useEffect, useMemo, useRef } from 'react'
import { Platform, ViewStyle } from 'react-native'

import { RouteName, RoutesTable } from '../../state/router'
import { NavigableTag } from '../../state/Tag'
import { Link, getStylePadding } from './Link'
import { LinkSharedProps } from './LinkProps'
import { asyncLinkAction, useNormalizeLinkProps } from './useNormalizedLink'

export type LinkButtonNamedProps<A = any, B = any> = {
  name: A
  params?: B
  replace?: boolean
  onPress?: any
}

export type LinkButtonProps<
  Name extends RouteName = any,
  Params = any
> = StackProps &
  LinkSharedProps & {
    containerStyle?: ViewStyle
  } & (
    | LinkButtonNamedProps<Name, Params>
    | {
        onPress?: any
      }
    | {
        tag: NavigableTag | null
        onPress?: Function
      }
    | {
        tags: NavigableTag[]
        onPress?: Function
      }
  )

export function LinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(allProps: LinkButtonProps<Name, Params>) {
  let restProps: StackProps
  let contents: React.ReactElement
  let onPress: any
  let props = useNormalizeLinkProps(allProps)
  const containerRef = useRef<any>()
  const stopProp = allProps.stopPropagation ?? true

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (stopProp && containerRef.current) {
        const div = getNode(containerRef.current)
        if (div) {
          div.addEventListener('click', prevent)
          return () => div.removeEventListener('click', prevent)
        }
      }
    }
  }, [containerRef.current, stopProp])

  if ('name' in props) {
    const {
      name,
      params,
      children,
      onPress,
      fontSize,
      ellipse,
      fastClick,
      lineHeight,
      fontWeight,
      padding,
      paddingVertical,
      paddingHorizontal,
      disabledIfActive,
      replace,
      preventNavigate,
      textAlign,
      ...rest
    } = props
    restProps = rest
    contents = (
      <Link
        name={name}
        params={params}
        replace={replace}
        onClick={onPress}
        lineHeight={lineHeight}
        fontSize={fontSize}
        fontWeight={fontWeight}
        ellipse={ellipse}
        textAlign={textAlign}
        fastClick={fastClick}
        padding={getStylePadding({
          padding,
          paddingVertical,
          paddingHorizontal,
        })}
        preventNavigate={preventNavigate}
      >
        {children ?? ''}
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
      disabledIfActive,
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
      >
        {children ?? ''}
      </Text>
    )
  }

  const onPressCb = onPress ? () => asyncLinkAction(onPress) : null

  return (
    <VStack
      // only handle click events on non-a links (we handle them in Link separately)
      // @ts-ignore
      ref={'name' in props ? null : containerRef}
      className="ease-in-out-fast"
      pressStyle={{
        opacity: 0.7,
        transform: [{ scale: 0.945 }],
      }}
      {...props.containerStyle}
      {...restProps}
      {...(props.fastClick
        ? { onPressIn: onPressCb }
        : { onPressOut: onPressCb })}
    >
      {contents}
    </VStack>
  )
}
