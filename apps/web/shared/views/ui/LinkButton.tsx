import { StackProps, VStack, getNode, prevent } from '@dish/ui'
import React, { useEffect, useMemo, useRef } from 'react'
import { Platform, Text, TouchableOpacity, ViewStyle } from 'react-native'

import { RouteName, RoutesTable } from '../../state/router'
import { NavigableTag } from '../../state/Tag'
import {
  Link,
  LinkSharedProps,
  asyncLinkAction,
  getStylePadding,
  useNormalizeLinkProps,
} from './Link'

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
  let pointerEvents: any
  let onPress: any
  let fastClick = false
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
      ...rest
    } = props
    pointerEvents = rest.pointerEvents
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
        fastClick={fastClick}
        padding={getStylePadding({
          padding,
          paddingVertical,
          paddingHorizontal,
        })}
      >
        {children ?? ''}
      </Link>
    )
  } else {
    const {
      children,
      // @ts-ignore
      onPress: onPress_,
      fontSize,
      lineHeight,
      fontWeight,
      ellipse,
      replace,
      fastClick: fastClick_,
      disabledIfActive,
      ...rest
    } = props
    if (fastClick_) {
      fastClick = fastClick_
    }
    pointerEvents = rest.pointerEvents
    onPress = onPress_
    restProps = rest
    contents = (
      <Text
        numberOfLines={ellipse ? 1 : undefined}
        style={{ fontSize, lineHeight, fontWeight }}
      >
        {children ?? ''}
      </Text>
    )
  }

  const onPressCb = useMemo(() => asyncLinkAction(onPress), [onPress])

  const {
    top,
    left,
    right,
    bottom,
    position,
    alignSelf,
    margin,
    ...restRestProps
  } = restProps

  return (
    // NOTE: display inherit, this is to allow turning off pointer events...
    <VStack
      // @ts-ignore
      display="inherit"
      pointerEvents={pointerEvents ?? null}
      // only handle click events on non-a links (we handle them in Link separately)
      ref={'name' in props ? null : containerRef}
      {...props.containerStyle}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        {...(!!onPress && { [fastClick ? 'onPressIn' : 'onPress']: onPressCb })}
        style={{
          top,
          left,
          right,
          bottom,
          position,
          alignSelf,
          margin,
        }}
      >
        <VStack
          flex={typeof props.flex === 'undefined' ? 1 : props.flex}
          {...restRestProps}
        >
          {contents}
        </VStack>
      </TouchableOpacity>
    </VStack>
  )
}
