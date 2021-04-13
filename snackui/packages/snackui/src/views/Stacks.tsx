import { stylePropsView } from '@snackui/helpers'
import React, {
  RefObject,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { combineRefs } from '../helpers/combineRefs'
import { StaticComponent } from '../helpers/extendStaticConfig'
import { spacedChildren } from '../helpers/spacedChildren'
import { ActiveThemeContext, invertStyleVariableToValue } from '../hooks/useTheme'
import { isWeb } from '../platform'
import { Spacing } from './Spacer'

export type StackProps = Omit<
  Omit<ViewStyle, 'display'> &
    Omit<ViewProps, 'display'> & {
      ref?: RefObject<View | HTMLElement> | ((node: View | HTMLElement) => any)
      animated?: boolean
      fullscreen?: boolean
      children?: any
      hoverStyle?: ViewStyle | null
      pressStyle?: ViewStyle | null
      focusStyle?: ViewStyle | null
      onHoverIn?: (e: MouseEvent) => any
      onHoverOut?: (e: MouseEvent) => any
      onPress?: (e: GestureResponderEvent) => any
      onPressIn?: (e: GestureResponderEvent) => any
      onPressOut?: (e: GestureResponderEvent) => any
      spacing?: Spacing
      cursor?: string
      pointerEvents?: string
      userSelect?: string
      className?: string
      // stronger version of pointer-events: none;
      disabled?: boolean
      contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'paint' | string
      display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex'
    },
  // because who tf uses alignContent or backfaceVisibility
  'alignContent' | 'backfaceVisibility'
>

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

// somewhat optimized to avoid object creation
const useViewStylePropsSplit = (props: { [key: string]: any }) => {
  const activeTheme = useContext(ActiveThemeContext)

  return useMemo(() => {
    let styleProps: ViewStyle | null = null
    let viewProps: ViewProps | null = null
    for (const key in props) {
      const val = props[key]
      if (stylePropsView[key]) {
        styleProps = styleProps || {}
        styleProps[key] = activeTheme
          ? invertStyleVariableToValue[activeTheme.name]?.[val] ?? val
          : val
      }
    }
    if (styleProps) {
      if (
        styleProps.shadowColor !== props.shadowColor &&
        typeof styleProps.shadowOpacity !== 'undefined'
      ) {
        styleProps.shadowColor = props.shadowColor
      }
    }
    // only if we have to, split out props
    if (styleProps) {
      viewProps = viewProps || {}
      for (const key in props) {
        if (key in styleProps) continue
        viewProps[key] = props[key]
      }
    }
    return [viewProps || props, styleProps] as const
  }, [props, activeTheme])
}

const mouseUps = new Set<Function>()

if (typeof document !== 'undefined') {
  document.addEventListener('mouseup', () => {
    mouseUps.forEach((x) => x())
    mouseUps.clear()
  })
}

const createStack = (defaultProps?: ViewStyle) => {
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
      focusStyle, // TODO
      onHoverIn,
      onHoverOut,
      spacing,
      className,
      disabled,
      // @ts-ignore
      onMouseEnter,
      // @ts-ignore
      onMouseLeave,
    } = props

    const [viewProps, styleProps] = useViewStylePropsSplit(props)
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

    const childrenWithSpacing = useMemo(
      () =>
        spacedChildren({
          children,
          spacing,
          flexDirection: defaultProps?.flexDirection,
        }),
      [spacing, children]
    )

    const ViewComponent = animated ? Animated.View : View

    let content = (
      <ViewComponent
        ref={combineRefs(innerRef, ref) as any}
        {...viewProps}
        // @ts-ignore
        className={className}
        pointerEvents={!isWeb && pointerEvents === 'none' ? 'box-none' : pointerEvents}
        style={[
          defaultProps,
          fullscreen ? fullscreenStyle : null,
          styleProps,
          style,
          state.hover ? hoverStyle : null,
          state.press ? pressStyle : null,
          disabled ? disabledStyle : null,
          isWeb || !styleProps ? null : fixNativeShadow(styleProps),
        ]}
      >
        {childrenWithSpacing}
      </ViewComponent>
    )

    const attachPress = !!(pressStyle || onPress)
    const attachHover = !!(hoverStyle || onHoverIn || onHoverOut || onMouseEnter || onMouseLeave)

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
            ? (e) => {
                let next: Partial<typeof state> = {}
                if (attachHover) {
                  next.hover = true
                }
                if (state.pressIn) {
                  next.press = true
                }
                if (Object.keys(next).length) {
                  set({ ...state, ...next })
                }
                if (attachHover) {
                  onHoverIn?.(e)
                  onMouseEnter?.(e)
                }
              }
            : null,
        onMouseLeave:
          attachHover || attachPress
            ? (e) => {
                let next: Partial<typeof state> = {}
                mouseUps.add(unPress)
                if (attachHover) {
                  next.hover = false
                }
                if (state.pressIn) {
                  next.press = false
                  next.pressIn = false
                }
                if (Object.keys(next).length) {
                  set({ ...state, ...next })
                }
                if (attachHover) {
                  onHoverOut?.(e)
                  onMouseLeave?.(e)
                }
              }
            : null,
        onMouseDown: attachPress
          ? (e) => {
              e.preventDefault()
              set({
                ...state,
                press: true,
                pressIn: true,
              })
              onPressIn?.(e)
            }
          : onPressIn,
        onClick: attachPress
          ? (e) => {
              e.preventDefault()
              set({
                ...state,
                press: false,
                pressIn: false,
              })
              onPressOut?.(e)
              onPress?.(e)
            }
          : onPressOut,
      }

      if (isWeb) {
        content = React.cloneElement(content, events)
      } else {
        if (pointerEvents !== 'none' && !!(onPress || onPressOut)) {
          content = (
            <Pressable
              onPress={(e) => {
                // @ts-ignore
                events.onClick(e)
              }}
              onPressIn={events.onMouseDown as any}
              style={
                styleProps
                  ? {
                      zIndex: styleProps.zIndex,
                      width: styleProps.width,
                      height: styleProps.height,
                      position: styleProps.position,
                    }
                  : null
              }
            >
              {content}
            </Pressable>
          )
        }
      }
    }

    return content
  })

  if (process.env.IS_STATIC) {
    // @ts-expect-error
    component.staticConfig = {
      validStyles: stylePropsView,
      defaultProps,
      expansionProps: {
        fullscreen: fullscreenStyle,
        disabled: disabledStyle,
        shadowColor: fixNativeShadow,
        contain: ({ contain }) => ({
          contain,
        }),
      },
    }
  }

  return (component as any) as StaticComponent<StackProps>
}

const defaultShadowOffset = {
  width: 0,
  height: 0,
}

const matchRgba = /rgba\(\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*,\s*([\d\.]{1,})\s*\)$/
function fixNativeShadow(props: StackProps) {
  let res: any
  if ('shadowColor' in props) {
    res = {
      shadowColor: props.shadowColor,
    }
    if (!('shadowOffset' in props)) {
      res.shadowOffset = defaultShadowOffset
    }
    if (!('shadowOpacity' in props)) {
      res.shadowOpacity = 1
      const color = String(props.shadowColor).trim()
      res = res || {}
      if (color[0] === 'r' && color[3] === 'a') {
        const [_, r, g, b, a] = color.match(matchRgba) ?? []
        if (typeof a !== 'string') {
          console.warn('non valid rgba', color)
          return res
        }
        res.shadowColor = `rgb(${r},${g},${b})`
        res.shadowOpacity = +a
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
  display: 'flex',
})

export const HStack = createStack({
  flexDirection: 'row',
  flexBasis: 'auto',
  display: 'flex',
})

export const VStack = createStack({
  flexDirection: 'column',
  flexBasis: 'auto',
  display: 'flex',
})
