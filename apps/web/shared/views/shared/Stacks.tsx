import './Stacks.css'

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

export type StackBaseProps = Omit<
  ViewStyle &
    ViewProps & {
      fullscreen?: boolean
      children?: any
      hoverStyle?: ViewStyle
      spacing?: Spacing
      className?: string
      disabled?: boolean // stronger pointer-events: none;
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
        spacing,
        className,
        disabled,
        ...props
      },
      ref
    ) => {
      const innerRef = useRef<any>()
      const [isHovered, set] = useState(false)

      useLayoutEffect(() => {
        if (!className) return
        if (hoverStyle) return
        if (!innerRef.current) return
        const node = innerRef.current?.['_reactInternalFiber']?.child.stateNode
        if (!node) return
        const names = className.split(' ')
        if (disabled) names.push('force-disable')
        names.forEach((x) => node.classList.add(x))
        return () => names.forEach((x) => node.classList.remove(x))
      })

      const getContent = (extraStyle?: any) => {
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
            .flat()
        }
        return (
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
        )
      }

      if (hoverStyle) {
        return (
          <Hoverable onHoverIn={() => set(true)} onHoverOut={() => set(false)}>
            <div
              className={`see-through ${className} ${
                disabled ? 'force-disable' : ''
              }`}
            >
              {getContent(isHovered ? hoverStyle : null)}
            </div>
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
