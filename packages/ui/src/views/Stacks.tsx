import _ from 'lodash'
import React, {
  StaticLifecycle,
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'

import { combineRefs } from '../helpers/combineRefs'
import { StaticComponent, StaticConfig } from '../helpers/extendStaticConfig'
import { getNode } from '../helpers/getNode'
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
      onHoverIn?: Function
      onHoverOut?: Function
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
        hoverStyle = null,
        onHoverIn,
        onHoverOut,
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
      const [isHovered, set] = useState(false)

      const cn = `${className ?? ''} ${disabled ? 'force-disable' : ''}`.trim()

      useAttachClassName(cn, innerRef, [
        // dont remembery why hoverStyle but leaving as it likely fixed something
        hoverStyle ? JSON.stringify(hoverStyle) : null,
      ])

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
            isHovered ? hoverStyle : null,
          ]}
        >
          {spacedChildren}
        </View>
      )

      if (
        hoverStyle ||
        onHoverIn ||
        onHoverOut ||
        onMouseEnter ||
        onMouseLeave
      ) {
        content = (
          <Hoverable
            onHoverIn={() => {
              set(true)
              onHoverIn?.()
              onMouseEnter?.()
            }}
            onHoverOut={() => {
              set(false)
              onHoverOut?.()
              onMouseLeave?.()
            }}
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
    },
  }

  return (component as any) as StaticComponent<StackProps>
}

export const ZStack = createStack({ position: 'absolute' })
export const HStack = createStack({ flexDirection: 'row' })
export const VStack = createStack({ flexDirection: 'column' })
