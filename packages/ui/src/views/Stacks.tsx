import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'

import { isIOS } from '../constants'
import { combineRefs } from '../helpers/combineRefs'
import { StaticComponent } from '../helpers/extendStaticConfig'
import { useAttachClassName } from '../hooks/useAttachClassName'
import { Spacer, Spacing } from './Spacer'

const fullscreenStyle: StackProps = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

const disabledStyle: StackProps = {
  pointerEvents: 'none',
  userSelect: 'none',
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
      cursor?: string
      pointerEvents?: string
      userSelect?: string
      className?: string
      // stronger version of pointer-events: none;
      disabled?: boolean
      contain?:
        | 'none'
        | 'strict'
        | 'content'
        | 'size'
        | 'layout'
        | 'paint'
        | string
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
      const isMounted = useRef(false)
      useEffect(() => {
        return () => {
          isMounted.current = false
        }
      })
      const [state, set] = useState({
        hover: false,
        press: false,
        pressIn: false,
      })

      useAttachClassName(className, innerRef)

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
            defaultStyle,
            fullscreen ? fullscreenStyle : null,
            props,
            style,
            state.hover ? hoverStyle : null,
            state.press ? pressStyle : null,
            disabled ? disabledStyle : null,
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
        content = React.cloneElement(content, {
          onMouseEnter:
            attachHover || attachPress
              ? () => {
                  let next: Partial<typeof state> = {}
                  if (attachHover) {
                    if (!isIOS) {
                      next.hover = true
                    }
                    onHoverIn?.()
                    onMouseEnter?.()
                  }
                  if (state.pressIn) {
                    next.press = true
                  }
                  if (Object.keys(next).length) {
                    set({ ...state, ...next })
                  }
                }
              : null,
          onMouseLeave:
            attachHover || attachPress
              ? () => {
                  let next: Partial<typeof state> = {}
                  mouseUps.add(() => {
                    if (!isMounted.current) return
                    set((x) => ({
                      ...x,
                      press: false,
                      pressIn: false,
                    }))
                  })
                  if (attachHover) {
                    if (!isIOS) {
                      next.hover = false
                    }
                    onHoverOut?.()
                    onMouseLeave?.()
                  }
                  if (state.pressIn) {
                    next.press = false
                  }
                  if (Object.keys(next).length) {
                    set({ ...state, ...next })
                  }
                }
              : null,
          onMouseDown: attachPress
            ? (e) => {
                e.preventDefault()
                onPressIn?.(e)
                set({
                  ...state,
                  press: true,
                  pressIn: true,
                })
              }
            : null,
          onClick: attachPress
            ? (e) => {
                e.preventDefault()
                e.stopPropagation()
                onPressOut?.(e)
                onPress?.(e)
                set({
                  ...state,
                  press: false,
                  pressIn: false,
                })
              }
            : null,
        })
      }

      return content
    }
  )

  // @ts-ignore
  component.staticConfig = {
    defaultStyle,
    styleExpansionProps: {
      fullscreen: fullscreenStyle,
      disabled: disabledStyle,
      contain: ({ contain }) => ({
        contain,
      }),
    },
  }

  return (component as any) as StaticComponent<StackProps>
}

export const AbsoluteVStack = createStack({
  position: 'absolute',
  flexDirection: 'column',
})
export const HStack = createStack({ flexDirection: 'row' })
export const VStack = createStack({ flexDirection: 'column' })
