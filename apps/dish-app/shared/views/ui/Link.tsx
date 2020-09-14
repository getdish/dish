import { series, sleep } from '@dish/async'
import { NavigateItem } from '@dish/router'
import { Text, useForceUpdate } from '@dish/ui'
import React, { useEffect, useRef } from 'react'
import { Platform, View } from 'react-native'

import { brandColor } from '../../colors'
import { RoutesTable, router } from '../../state/router'
import { LinkProps } from './LinkProps'
import { getNormalizeLinkProps } from './useNormalizedLink'

export function Link<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>(allProps: LinkProps<Name, Params>) {
  const {
    fontSize,
    fontWeight,
    children,
    ellipse,
    lineHeight,
    color = brandColor,
    onClick,
    replaceSearch,
    tagName,
    className,
    asyncClick,
    textAlign,
    navigateAfterPress,
    style,

    // container style props
    backgroundColor,
    paddingHorizontal,
    paddingVertical,
    padding,
    maxHeight,
    width,
    height,
    flex,
    borderRadius,

    // rest
    ...restProps
  } = allProps

  const containerStyle = {
    backgroundColor,
    paddingHorizontal,
    paddingVertical,
    padding,
    maxHeight,
    width,
    height,
    flex,
    borderRadius,
  }

  const forceUpdate = useForceUpdate()
  const {
    onPress,
    name,
    params,
    replace,
    preventNavigate,
    ...linkProps
  } = getNormalizeLinkProps(restProps as any, forceUpdate)
  const cancel = useRef<Function | null>(null)
  const linkRef = useRef<HTMLElement | null>(null)
  const navItem: NavigateItem = {
    name,
    params,
    replace,
  }
  const elementName = Platform.OS === 'web' ? tagName ?? 'a' : View

  useEffect(() => {
    return () => {
      cancel.current?.()
    }
  }, [])

  const clickEventName = Platform.OS === 'web' ? 'onClick' : 'onPress'
  const clickEvent = (e: any) => {
    if (allProps.target) {
      // let it go
    } else {
      e.preventDefault()
      if (asyncClick) {
        cancel.current = series([
          () => sleep(50),
          () => {
            cancel.current = null
            nav()
          },
        ])
      } else {
        nav()
      }
    }
    function nav() {
      if (onPress || onClick) {
        e.navigate = () => router.navigate(navItem)
        onClick?.(e!)
        onPress?.(e)
      } else {
        if (!preventNavigate && !!navItem.name) {
          router.navigate(navItem)
        }
      }
    }
  }

  const props = {
    ref: linkRef,
    ...(Platform.OS === 'web'
      ? {
          onClick: clickEvent,
          className: `${className ?? ''} dish-link`,
          href: router.getPathFromParams(navItem),
        }
      : {
          onPress: clickEvent,
        }),
    ...linkProps,
    style: style ? { ...style, containerStyle } : containerStyle,
  }

  return React.createElement<any>(
    elementName,
    props,
    <Text
      fontSize={fontSize}
      lineHeight={lineHeight}
      fontWeight={fontWeight}
      color={color}
      backgroundColor={backgroundColor}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      borderRadius={borderRadius}
      padding={padding}
      flex={flex}
      width={width}
      height={height}
      textAlign={textAlign}
      // @ts-ignore
      display="inline-flex"
      // @ts-ignore
      alignItems={style?.alignItems}
      // @ts-ignore
      justifyContent={style?.justifyContent}
      // must be after display, etc to override
      ellipse={ellipse}
      {...(style?.flex && {
        flex: style.flex as any,
        display: 'flex',
      })}
    >
      {children}
    </Text>
  )
}
