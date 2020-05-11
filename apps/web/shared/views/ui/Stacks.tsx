import _ from 'lodash'
import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'

import { combineRefs } from '../../helpers/combineRefs'
import Hoverable from './Hoverable'
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
      disabled?: boolean // stronger pointer-events: none;
    },
  // because who tf uses alignContent or backfaceVisibility
  'alignContent' | 'backfaceVisibility'
>

const createStack = (defaultStyle?: ViewStyle) => {
  return forwardRef<View, StackProps>(
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
      onHoverIn = onHoverIn || onMouseEnter
      onHoverOut = onHoverOut || onMouseLeave

      const innerRef = useRef<any>()
      const [isHovered, set] = useState(false)

      const cn = `${className ?? ''} ${disabled ? 'force-disable' : ''}`.trim()

      useLayoutEffect(() => {
        if (!cn) return
        if (!innerRef.current) return
        const getNode = () =>
          innerRef.current?.['_reactInternalFiber']?.child.stateNode
        const node = getNode()
        if (!node) return
        const names = cn.trim().split(' ').filter(Boolean)

        function addClassNames() {
          const cl = new Set(node.classList)
          for (const name of names) {
            if (!cl.has(name)) {
              node.classList.add(name)
            }
          }
        }

        addClassNames()

        const observer = new MutationObserver(() => {
          addClassNames()
        })
        observer.observe(node, {
          attributes: true,
        })

        return () => {
          observer.disconnect()
          names.forEach((x) => node.classList.remove(x))
        }
      }, [JSON.stringify(hoverStyle), cn, innerRef.current])

      let spacedChildren = children
      if (typeof spacing !== 'undefined') {
        const childArr = React.Children.toArray(children)
        spacedChildren = _.flatMap(
          childArr
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

      if (hoverStyle || onHoverIn || onHoverOut) {
        content = (
          <Hoverable
            onHoverIn={() => {
              set(true)
              onHoverIn?.()
            }}
            onHoverOut={() => {
              set(false)
              onHoverOut?.()
            }}
          >
            {content}
          </Hoverable>
        )
      }

      return content
    }
  )
}

export const ZStack = createStack({ position: 'absolute' })
export const HStack = createStack({ flexDirection: 'row' })
export const VStack = createStack({ flexDirection: 'column' })
