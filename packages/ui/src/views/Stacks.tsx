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
    Omit<ViewProps, 'display'> & {
      // give it a descriptive name for static extraction (TODO)
      name?: string
      fullscreen?: boolean
      children?: any
      hoverStyle?: ViewStyle | null
      pressStyle?: ViewStyle | null
      onHoverIn?: Function
      onHoverOut?: Function
      onPress?: Function
      onPressIn?: Function
      onPressOut?: Function
      spacing?: Spacing
      className?: string
      // stronger version of pointer-events: none;
      disabled?: boolean
      contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'paint'
      display?:
        | 'inherit'
        | 'none'
        | 'inline'
        | 'block'
        | 'contents'
        | 'flex'
        | 'inline-flex'
    },
  // because who tf uses alignContent or backfaceVisibility
  'alignContent' | 'backfaceVisibility'
>

const mouseUps = new Set<Function>()
if (typeof document !== 'undefined') {
  document.addEventListener('mouseup', () => {
    mouseUps.forEach((x) => x())
    mouseUps.clear()
  })
}

const createStack = (defaultStyle?: ViewStyle) => {
  const component = forwardRef<View, StackProps>(
    (
      {
        children,
        fullscreen,
        pointerEvents,
        style = null,
        pressStyle = null,
        onPress,
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
      const [state, set] = useState({
        hover: false,
        press: false,
        pressIn: false,
      })
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
            state.hover ? hoverStyle : null,
            state.press ? pressStyle : null,
          ]}
        >
          {spacedChildren}
        </View>
      )

      const attachPress = !!(pressStyle || onPressIn || onPressOut || onPress)
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
            {...(!!(attachHover || attachPress) && {
              onHoverIn: () => {
                let next = { ...state }
                if (attachHover) {
                  next.hover = true
                  onHoverIn?.()
                  onMouseEnter?.()
                }
                if (state.pressIn) {
                  next.press = true
                }
                set(next)
              },
              onHoverOut: () => {
                let next = { ...state }
                mouseUps.add(() => {
                  set((x) => ({
                    ...x,
                    press: false,
                    pressIn: false,
                  }))
                })
                if (attachHover) {
                  next.hover = false
                  onHoverOut?.()
                  onMouseLeave?.()
                }
                if (state.pressIn) {
                  next.press = false
                }
                set(next)
              },
            })}
            {...(!!attachPress && {
              onPressIn: (e) => {
                e.preventDefault()
                set({
                  ...state,
                  press: true,
                  pressIn: true,
                })
                onPressIn?.(e)
              },
              onPressOut: (e) => {
                e.preventDefault()
                set({
                  ...state,
                  press: false,
                  pressIn: false,
                })
                onPressOut?.(e)
                onPress?.(e)
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
      contain: ({ contain }) => ({
        contain,
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
