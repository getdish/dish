import React, { forwardRef, useRef, useState } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'

import { combineRefs } from '../helpers/combineRefs'
import { StaticComponent } from '../helpers/extendStaticConfig'
import { useAttachClassName } from '../hooks/useAttachClassName'
import { Hoverable } from './Hoverable'
import { Spacer, Spacing } from './Spacer'

const fsStyle = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

export type StackProps = Omit<
  ViewStyle &
    ViewProps & {
      fullscreen?: boolean
      children?: any
      hoverStyle?: ViewStyle
      pressStyle?: ViewStyle
      onHoverIn?: Function
      onHoverOut?: Function
      onPressIn?: Function
      onPressOut?: Function
      spacing?: Spacing
      className?: string
      // stronger version of pointer-events: none;
      disabled?: boolean
      contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'paint'
    },
  // because who tf uses alignContent or backfaceVisibility
  'alignContent' | 'backfaceVisibility'
>

const createStack = (defaultStyle?: ViewStyle) => {
  const component = forwardRef<View, StackProps>(
    (
      {
        children,
        fullscreen,
        pointerEvents,
        style = null,
        pressStyle = null,
        onPressIn,
        onPressOut,
        hoverStyle = null,
        onHoverIn,
        onHoverOut,
        // @ts-ignore
        onMouseDown,
        // @ts-ignore
        onMouseUp,
        // @ts-ignore
        onMouseEnter,
        // @ts-ignore
        onMouseLeave,
        // @ts-ignore
        onMouseMove,
        // @ts-ignore
        onResponderGrant,
        // @ts-ignore
        onResponderRelease,
        spacing,
        className,
        disabled,
        ...props
      },
      ref
    ) => {
      const innerRef = useRef<any>()
      const [isHovered, setHvr] = useState(false)
      const [isPressed, setPrs] = useState(false)
      const cn = `${className ?? ''} ${disabled ? 'force-disable' : ''}`.trim()

      useAttachClassName(cn, innerRef)

      let spacedChildren = children
      if (typeof spacing !== 'undefined') {
        const childArr = React.Children.toArray(children)
        spacedChildren = childArr
          .filter((x) => !!x)
          .map((x, i) =>
            i === childArr.length - 1
              ? x
              : [
                  x,
                  <Spacer
                    key={i}
                    size={spacing}
                    direction={
                      defaultStyle?.flexDirection === 'row'
                        ? 'horizontal'
                        : 'vertical'
                    }
                  />,
                ]
          )
      }

      if (props['debug']) {
        console.log([
          {
            ...defaultStyle,
            ...(fullscreen && fsStyle),
            ...props,
          },
          style,
          isHovered ? hoverStyle : null,
          isPressed ? pressStyle : null,
        ])
      }

      let content = (
        <View
          ref={combineRefs(innerRef, ref)}
          pointerEvents={pointerEvents}
          style={[
            {
              ...defaultStyle,
              ...(fullscreen && fsStyle),
              ...props,
            },
            style,
            isHovered ? hoverStyle : null,
            isPressed ? pressStyle : null,
          ]}
        >
          {spacedChildren}
        </View>
      )

      const attachPress = !!(pressStyle || onPressIn || onPressOut)
      const attachHover = !!(
        hoverStyle ||
        onHoverIn ||
        onHoverOut ||
        onMouseEnter ||
        onMouseLeave
      )

      if (attachHover || attachPress) {
        content = (
          <Hoverable
            {...(!!attachHover && {
              onHoverIn: () => {
                setHvr(true)
                onHoverIn?.()
                onMouseEnter?.()
              },
              onHoverOut: () => {
                setHvr(false)
                onHoverOut?.()
                onMouseLeave?.()
              },
            })}
            {...(!!attachPress && {
              onPressIn: (e) => {
                e.preventDefault()
                setPrs(true)
                onPressIn?.(e)
                // onMouseDown?.(e)
              },
              onPressOut: (e) => {
                e.preventDefault()
                setPrs(false)
                onPressOut?.(e)
                // onMouseUp?.(e)
              },
            })}
          >
            {content}
          </Hoverable>
        )
      }

      return content
    }
  )

  // @ts-ignore
  component.staticConfig = {
    defaultStyle,
    styleExpansionProps: {
      fullscreen: fsStyle,
      contain: (val) => ({
        contain: val,
      }),
      disabled: {
        pointerEvents: 'none',
      },
    },
  }

  return (component as any) as StaticComponent<StackProps>
}

export const ZStack = createStack({ position: 'absolute' })
export const HStack = createStack({ flexDirection: 'row' })
export const VStack = createStack({ flexDirection: 'column' })
