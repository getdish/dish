import React, {
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { isWeb, isWebIOS } from '../constants'
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
  Omit<ViewStyle, 'display'> &
    Omit<ViewProps, 'display'> & {
      ref?: RefObject<View>
      animated?: boolean
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
  const component = forwardRef<View, StackProps>((props, ref) => {
    const {
      children,
      animated,
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
      ...styleProps
    } = props
    const innerRef = useRef<any>()
    const isMounted = useRef(false)

    useEffect(() => {
      return () => {
        mouseUps.delete(unPress)
        isMounted.current = false
      }
    }, [])

    const [state, set] = useState({
      hover: false,
      press: false,
      pressIn: false,
    })

    useAttachClassName(className, innerRef)

    const spacedChildren = useMemo(() => {
      if (typeof spacing === 'undefined') {
        return children
      }
      const next: any[] = []
      const childrenList = React.Children.toArray(children)
      const len = childrenList.length
      const spacer = (
        <Spacer
          size={spacing}
          direction={
            defaultStyle?.flexDirection === 'row' ? 'horizontal' : 'vertical'
          }
        />
      )
      for (const [index, child] of childrenList.entries()) {
        next.push(child)
        if (index === len - 1) {
          break
        }
        next.push(<React.Fragment key={index}>{spacer}</React.Fragment>)
      }
      return next
    }, [children])

    const ViewComponent = animated ? Animated.View : View
    let content = (
      <ViewComponent
        ref={combineRefs(innerRef, ref)}
        pointerEvents={
          !isWeb && pointerEvents === 'none' ? 'box-none' : pointerEvents
        }
        style={[
          defaultStyle,
          fullscreen ? fullscreenStyle : null,
          styleProps,
          style,
          state.hover ? hoverStyle : null,
          state.press ? pressStyle : null,
          disabled ? disabledStyle : null,
          isWeb ? null : fixNativeShadow(styleProps),
        ]}
      >
        {spacedChildren}
      </ViewComponent>
    )

    const attachPress = !!(pressStyle || onPress)
    const attachHover = !!(
      hoverStyle ||
      onHoverIn ||
      onHoverOut ||
      onMouseEnter ||
      onMouseLeave
    )

    const unPress = useCallback(() => {
      if (!isMounted.current) return
      set((x) => ({
        ...x,
        press: false,
        pressIn: false,
      }))
    }, [])

    if (attachHover || attachPress || onPressOut || onPressIn) {
      const events = {
        onMouseEnter:
          attachHover || attachPress
            ? () => {
                let next: Partial<typeof state> = {}
                if (attachHover) {
                  if (!isWebIOS) {
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
                mouseUps.add(unPress)
                if (attachHover) {
                  if (!isWebIOS) {
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
          : onPressIn,
        onClick: attachPress
          ? (e) => {
              e.preventDefault()
              onPressOut?.(e)
              onPress?.(e)
              set({
                ...state,
                press: false,
                pressIn: false,
              })
            }
          : onPressOut,
      }

      if (isWeb) {
        content = React.cloneElement(content, events)
      } else {
        if (pointerEvents !== 'none' && !!(onPress || onPressOut)) {
          content = (
            <TouchableOpacity
              onPress={(e) => {
                // @ts-ignore
                events.onClick(e)
              }}
              onPressIn={events.onMouseDown as any}
              style={{
                zIndex: styleProps.zIndex,
                width: styleProps.width,
                height: styleProps.height,
                position: styleProps.position,
              }}
            >
              {content}
            </TouchableOpacity>
          )
        }
      }
    }

    return content
  })

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

const defaultShadowOffset = {
  width: 0,
  height: 0,
}

function fixNativeShadow(props: any) {
  let res
  if ('shadowColor' in props) {
    if (!('shadowOffset' in props)) {
      res = {
        shadowOffset: defaultShadowOffset,
      }
    }
    if (!('shadowOpacity' in props)) {
      const color = props.shadowColor as string
      res = res || {}
      if (color[0] === 'r' && color[4] === 'a') {
        const alphaIndex = color.lastIndexOf(',') + 1
        const alpha = +color.slice(alphaIndex).replace(')', '')
        if (isNaN(alpha)) {
          console.warn('nan', color)
        } else {
          res.shadowOpacity = alpha
        }
      } else {
        res.shadowOpacity = 1
      }
    }
  }
  return res
}

export const AbsoluteVStack = createStack({
  position: 'absolute',
  flexDirection: 'column',
  flexBasis: 'auto',
})

export const HStack = createStack({
  flexDirection: 'row',
  flexBasis: 'auto',
})

export const VStack = createStack({
  flexDirection: 'column',
  flexBasis: 'auto',
})
