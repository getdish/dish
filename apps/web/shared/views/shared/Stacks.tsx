import React, { forwardRef, CSSProperties, useRef, useState } from 'react'
import { View, StyleSheet, ViewStyle, ViewProps, Animated } from 'react-native'
import Hoverable from './Hoverable'
import './Stacks.css'

// TODO spacing

const fsStyle = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

export type StackBaseProps = Omit<
  ViewStyle &
    ViewProps & {
      fullscreen?: boolean
      children?: any
      hoverStyle?: ViewStyle
    },
  // because who tf uses alignContent
  'alignContent'
>

const createStack = (defaultStyle?: ViewStyle) => {
  return forwardRef<View, StackBaseProps>(
    (
      {
        children,
        fullscreen,
        pointerEvents,
        style = null,
        hoverStyle = null,
        ...props
      },
      ref
    ) => {
      const content = (extraStyle?: any) => (
        <Animated.View
          ref={ref}
          pointerEvents={pointerEvents}
          style={[
            {
              ...defaultStyle,
              ...(fullscreen && fsStyle),
              ...props,
            },
            style,
            extraStyle,
          ]}
        >
          {children}
        </Animated.View>
      )

      if (hoverStyle) {
        const [isHovered, set] = useState(false)
        return (
          <Hoverable onHoverIn={() => set(true)} onHoverOut={() => set(false)}>
            <div className="see-through">
              {content(isHovered ? hoverStyle : null)}
            </div>
          </Hoverable>
        )
      }

      return content()
    }
  )
}

export const ZStack = createStack({ position: 'absolute' })
export const HStack = createStack({ flexDirection: 'row' })
export const VStack = createStack({ flexDirection: 'column' })
