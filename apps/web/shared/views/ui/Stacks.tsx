import _ from 'lodash'
import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
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
  // because who tf uses alignContent
  'alignContent'
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

      useLayoutEffect(() => {
        if (!className) return
        if (hoverStyle) return
        if (!innerRef.current) return
        const node = innerRef.current?.['_reactInternalFiber']?.child.stateNode
        if (!node) return
        const names = className.trim().split(' ').filter(Boolean)
        names.forEach((x) => node.classList.add(x))
        return () => names.forEach((x) => node.classList.remove(x))
      }, [className])

      const getContent = (extraStyle?: any) => {
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
        return (
          <div
            className={`${className ? className : 'display-contents'} ${
              disabled ? 'force-disable' : ''
            }`}
          >
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
                extraStyle,
              ]}
            >
              {spacedChildren}
            </View>
          </div>
        )
      }

      if (hoverStyle || onHoverIn || onHoverOut) {
        return (
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
            {getContent(isHovered ? hoverStyle : null)}
          </Hoverable>
        )
      }

      return getContent()
    }
  )
}

export const ZStack = createStack({ position: 'absolute' })
export const HStack = createStack({ flexDirection: 'row' })
export const VStack = createStack({ flexDirection: 'column' })
