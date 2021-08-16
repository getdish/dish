import { isEqual } from '@dish/fast-compare'
import { stylePropsTransform, stylePropsView, validStyles } from '@snackui/helpers'
import React, { forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Pressable,
  PressableProps,
  Text as ReactText,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { fixNativeShadow } from './fixNativeShadow'
import { StaticComponent } from './helpers/extendStaticConfig'
import { spacedChildren } from './helpers/spacedChildren'
import { StaticConfig } from './helpers/StaticConfig'
import { ThemeManagerContext, invertStyleVariableToValue } from './hooks/useTheme'
import { isTouchDevice, isWeb } from './platform'
import { StackProps } from './StackProps'

const loadRNW = !process.env.IS_STATIC && isWeb
const rnw: any = loadRNW ? require('react-native-web/dist/exports/View').internal : null
const forwardPropsList = rnw?.forwardPropsList

const mouseUps = new Set<Function>()

if (typeof document !== 'undefined') {
  document.addEventListener('mouseup', () => {
    mouseUps.forEach((x) => x())
    mouseUps.clear()
  })
}

const setIfChanged = (setter: any, next: Object) => {
  setter((prev) => {
    const n = { ...prev, ...next }
    if (isEqual(prev, n)) {
      return prev
    }
    return n
  })
}

const getPressable = Pressable['type']['render']
const usePressable = (props: PressableProps) => {
  const out = getPressable(props)
  const { children, style, ...pressableProps } = out.props
  return [pressableProps, style] as const
}

export function createComponent<A extends any = StackProps>(componentProps: Partial<StaticConfig>) {
  const sheet = StyleSheet.create({
    defaultStyle: componentProps.defaultProps,
    inline: isWeb
      ? {
          display: 'inline-flex' as any,
        }
      : {},
  })

  const validStyleProps = componentProps.validStyles ?? stylePropsView
  const TextAncestorContext = rnw?.TextAncestorContext

  const component = forwardRef<View, A>((props: StackProps, forwardedRef) => {
    const {
      hitSlop,
      animated,
      children,
      pointerEvents,
      onPress,
      onPressIn,
      onPressOut,
      onHoverIn,
      onHoverOut,
      spacing,
      disabled,
      onMouseEnter,
      onMouseLeave,
      hrefAttrs,
      onMoveShouldSetResponder,
      onMoveShouldSetResponderCapture,
      onResponderEnd,
      onResponderGrant,
      onResponderMove,
      onResponderReject,
      onResponderRelease,
      onResponderStart,
      onResponderTerminate,
      onResponderTerminationRequest,
      onScrollShouldSetResponder,
      onScrollShouldSetResponderCapture,
      onSelectionChangeShouldSetResponder,
      onSelectionChangeShouldSetResponderCapture,
      onStartShouldSetResponder,
      onStartShouldSetResponderCapture,
      onMouseDown,
      onClick,
    } = props

    const manager = useContext(ThemeManagerContext)
    const [state, set_] = useState(() => ({
      hover: false,
      press: false,
      pressIn: false,
      theme: manager.name,
    }))
    const set = setIfChanged.bind(null, set_)

    // from react-native-web
    if (process.env.NODE_ENV !== 'production' && !componentProps.isText && isWeb) {
      React.Children.toArray(props.children).forEach((item) => {
        if (typeof item === 'string') {
          console.error(`Unexpected text node: ${item}. A text node cannot be a child of a <View>.`)
        }
      })
    }

    // from react-native-web
    const hasTextAncestor = isWeb ? useContext(TextAncestorContext) : false
    const hostRef = useRef(null)

    if (isWeb) {
      // from react-native-web
      rnw.useResponderEvents(hostRef, {
        onMoveShouldSetResponder,
        onMoveShouldSetResponderCapture,
        onResponderEnd,
        onResponderGrant,
        onResponderMove,
        onResponderReject,
        onResponderRelease,
        onResponderStart,
        onResponderTerminate,
        onResponderTerminationRequest,
        onScrollShouldSetResponder,
        onScrollShouldSetResponderCapture,
        onSelectionChangeShouldSetResponder,
        onSelectionChangeShouldSetResponderCapture,
        onStartShouldSetResponder,
        onStartShouldSetResponderCapture,
      })
    }

    const isTracking = useRef(false)
    const varToVal = useCallback(
      (variable: string) => {
        isTracking.current = true
        const invert = invertStyleVariableToValue[state.theme || 'light']
        return invert?.[variable] ?? variable
      },
      [state.theme]
    )

    const processedProps = componentProps.preProcessProps?.(props) ?? props
    const { viewProps, psuedos, style } = getSplitStyles(processedProps, validStyleProps, varToVal)

    // hasEverHadEvents prevents repareting if you remove onPress or similar...
    const internal = useRef<{ isMounted: boolean; hasEverHadEvents?: boolean }>()
    if (!internal.current) {
      internal.current = {
        isMounted: true,
      }
    }

    useEffect(() => {
      internal.current!.isMounted = true
      const dispose = manager?.onChangeTheme((name) => {
        if (isTracking.current) {
          set({ theme: name })
        }
      })
      return () => {
        dispose()
        mouseUps.delete(unPress)
        isTracking.current = false
        internal.current!.isMounted = false
      }
    }, [manager])

    const ViewComponent = componentProps.isText
      ? animated
        ? Animated.Text
        : isWeb
        ? hasTextAncestor
          ? 'span'
          : 'div'
        : ReactText
      : animated
      ? Animated.View
      : isWeb
      ? 'div'
      : View

    const numberOfLines = props['numberOfLines']
    const selectable = props['selectable']

    const styles = [
      sheet.defaultStyle,
      hasTextAncestor ? sheet.inline : null,
      // from react-native-web
      ...(isWeb && componentProps.isText
        ? [
            numberOfLines != null && numberOfLines > 1 && { WebkitLineClamp: numberOfLines },
            selectable === true && textStyles.selectable,
            selectable === false && textStyles.notSelectable,
            onPress && textStyles.pressable,
          ]
        : []),
      style,
      !disabled && psuedos && state.hover ? psuedos.hoverStyle || null : null,
      !disabled && psuedos && state.press ? psuedos.pressStyle || null : null,
      disabled ? disabledStyle : null,
    ]

    const supportedProps: any = {
      ...viewProps,
      ...(isWeb && {
        className: null,
        // from react-native-web
        classList: componentProps.isText
          ? [
              cssText.text,
              hasTextAncestor === true && cssText.textHasAncestor,
              numberOfLines === 1 && cssText.textOneLine,
              numberOfLines != null && numberOfLines > 1 && cssText.textMultiLine,
              processedProps.className,
            ]
          : [cssView.view, processedProps.className],
      }),
      style: styles,
    }

    if (pointerEvents) {
      supportedProps.pointerEvents = !isWeb && pointerEvents === 'none' ? 'box-none' : pointerEvents
    }

    if (isWeb) {
      // from react-native-web
      const platformMethodsRef = rnw.usePlatformMethods(supportedProps)
      const setRef = rnw.useMergeRefs(hostRef, platformMethodsRef, forwardedRef)
      supportedProps.ref = setRef
      if (props.href != null && hrefAttrs != null) {
        const { download, rel, target } = hrefAttrs
        if (download != null) {
          supportedProps.download = download
        }
        if (rel != null) {
          supportedProps.rel = rel
        }
        if (typeof target === 'string') {
          supportedProps.target = target.charAt(0) !== '_' ? '_' + target : target
        }
      }
    } else {
      if (forwardedRef) {
        supportedProps.ref = forwardedRef
      }
    }

    if (process.env.NODE_ENV === 'development') {
      if (props['debug']) {
        // prettier-ignore
        console.log(' 🍑 debug\n  🔵 props in: ', props, '\n  🔵 props out: ', viewProps, '\n  🔵 other: ', { supportedProps, styles, psuedos, processedProps }, componentProps.preProcessProps)
      }
    }

    const createEl = isWeb ? rnw.createElement : React.createElement

    //
    // TODO
    //
    // all these press events can be moved into a component that optionally renders if shouldAttach is true
    // and then calls back with props. this would do a few things:
    //   1. isolate logic for all pseudo press/hover stuff into one area more nicely
    //   2. a lot less hooks would be rendered on average
    //   3. should then let us use usePressability on web (should make ViewComponent a View if string)
    //
    //
    // see how framer motion does this:
    //   https://github.com/framer/motion/blob/1d1eb5fd2bc712658a83a7881a3adb68ac56a242/src/motion/features/use-features.tsx#L16
    //

    const attachPress = !!((psuedos && psuedos.pressStyle) || onPress || onPressOut || onPressIn)
    const attachHover =
      isWeb &&
      !!((psuedos && psuedos.hoverStyle) || onHoverIn || onHoverOut || onMouseEnter || onMouseLeave)

    // check presence to prevent reparenting bugs, allows for onPress={x ? function : undefined} usage
    // while avoiding reparenting...
    // once proper reparenting is supported, we can remove this and use that...
    const shouldAttach =
      internal.current.hasEverHadEvents ||
      attachPress ||
      attachHover ||
      'pressStyle' in props ||
      'onPress' in props ||
      'onPressIn' in props ||
      'onPressOut' in props ||
      (isWeb &&
        ('hoverStyle' in props ||
          'onHoverIn' in props ||
          'onHoverOut' in props ||
          'onMouseEnter' in props ||
          'onMouseLeave' in props))

    // never remove events as we wrap in a div (for now, may be able to remove..)
    if (shouldAttach) {
      internal.current.hasEverHadEvents = true
    }

    const unPress = useCallback(() => {
      if (!internal.current!.isMounted) return
      set({
        press: false,
        pressIn: false,
      })
    }, [])

    const events = shouldAttach
      ? {
          ...(!isWeb && {
            // non web
            onPressOut: (e) => {
              unPress()
              onPressOut?.(e)
            },
          }),
          ...(isWeb &&
            !isTouchDevice && {
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
                        set(next)
                      }
                      onHoverIn?.(e)
                      onMouseEnter?.(e)
                    }
                  : undefined,
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
                        set(next)
                      }
                      onHoverOut?.(e)
                      onMouseLeave?.(e)
                    }
                  : undefined,
            }),
          onMouseDown: attachPress
            ? (e) => {
                set({
                  press: true,
                  pressIn: true,
                })
                onPressIn?.(e)
                onMouseDown?.(e)
              }
            : (onPressIn as any),
          onClick: attachPress
            ? (e) => {
                e.preventDefault()
                unPress()
                onPressOut?.(e)
                onPress?.(e)
                onClick?.(e)
              }
            : (onPressOut as any),
        }
      : null

    if (events) {
      if (typeof ViewComponent !== 'string') {
        // TODO once we do the above we can then rely entirely on pressStyle returned here isntead of above pressStyle logic
        const [pressProps] = usePressable({
          disabled,
          hitSlop,
          onPressIn: events.onMouseDown,
          onPressOut: events.onPressOut,
          onPress,
        })
        Object.assign(supportedProps, pressProps)
      } else {
        Object.assign(supportedProps, events)
      }
    }

    let content = createEl(
      ViewComponent,
      supportedProps,
      spacedChildren({
        children,
        spacing,
        flexDirection: componentProps.defaultProps?.flexDirection,
      })
    )

    if (isWeb && componentProps.isText && !hasTextAncestor) {
      // from react-native-web
      content = <TextAncestorContext.Provider value={true}>{content}</TextAncestorContext.Provider>
    }

    return content
  })

  if (process.env.IS_STATIC) {
    const config: StaticConfig = {
      validStyles,
      ...componentProps,
      postProcessStyles: (inStyles) => {
        const { style, psuedos } = getSplitStyles(inStyles)
        const next = {
          ...style.reduce((acc, value) => {
            Object.assign(acc, value)
            return acc
          }, {}),
          ...psuedos,
        }
        if (componentProps.postProcessStyles) {
          return componentProps.postProcessStyles(next)
        }
        return next
      },
      validPropsExtra: {
        ...componentProps.validPropsExtra,
        disabled: true,
        fullscreen: true,
      },
    }
    component['staticConfig'] = config
  }

  return component as any as StaticComponent<A>
}

const cssView = isWeb
  ? rnw?.css.create({
      view: {
        // why necessary?
        margin: 0,
      },
    })
  : {}

const cssText = isWeb
  ? rnw?.css.create({
      text: {
        color: 'black',
        display: 'inline',
        font: '14px System',
        margin: 0,
        padding: 0,
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      },
      textHasAncestor: {
        color: 'inherit',
        font: 'inherit',
        whiteSpace: 'inherit',
      },
      textOneLine: {
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      textMultiLine: {
        display: '-webkit-box',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        WebkitBoxOrient: 'vertical',
      },
    })
  : {}

const displayContentsStyle = { display: 'contents' }

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

const mapTransformKeys = {
  x: 'translateX',
  y: 'translateY',
}

const mergeTransform = (obj: ViewStyle, key: string, val: any) => {
  const transform = obj.transform
    ? Array.isArray(obj.transform)
      ? obj.transform
      : [obj.transform]
    : []
  // @ts-expect-error
  transform.push({ [mapTransformKeys[key] || key]: val })
  obj.transform = transform
}

const textStyles = isWeb
  ? StyleSheet.create({
      notSelectable: {
        // @ts-ignore
        userSelect: 'none',
      },
      selectable: {
        // @ts-ignore
        userSelect: 'text',
      },
      pressable: {
        // @ts-ignore
        cursor: 'pointer',
      },
    })
  : {}

const defaultVarToVal = (x: any) => x

const getSplitStyles = (
  props: { [key: string]: any },
  validStyleProps: Object = validStyles,
  // convert from var to theme value
  varToVal: (key: string) => string = defaultVarToVal
) => {
  let psuedos: { hoverStyle?: ViewStyle; pressStyle?: ViewStyle } | null = null
  let viewProps: ViewProps = {}
  let style: any[] = []
  let cur: ViewStyle | null = null
  for (const key in props) {
    let val = props[key]
    if (key === 'style' || (key[0] === '_' && key.startsWith('_style'))) {
      if (cur) {
        // process last
        fixNativeShadow(cur, true)
        style.push(cur)
        cur = null
      }
      fixNativeShadow(val, true)
      style.push(val)
      continue
    }
    if (key === 'fullscreen') {
      cur = cur || {}
      Object.assign(cur, fullscreenStyle)
      continue
    }
    // expand flex so it merged with flexShrink etc properly
    if (key === 'flex') {
      cur = cur || {}
      // see spec for flex shorthand https://developer.mozilla.org/en-US/docs/Web/CSS/flex
      Object.assign(cur, {
        flexGrow: val,
        flexShrink: 1,
      })
      continue
    }
    if (!isWeb && key === 'pointerEvents') {
      viewProps[key] = val
      continue
    }
    // is style
    const isPseudo = key === 'hoverStyle' || key === 'pressStyle' || key === 'focusStyle'
    if (validStyleProps[key] || isPseudo) {
      if (isPseudo) {
        if (!val) continue
        psuedos = psuedos || {}
        const pseudoStyle: ViewStyle = {}
        for (const subKey in val) {
          const sval = varToVal(val[subKey])
          if (subKey in stylePropsTransform) {
            mergeTransform(pseudoStyle, subKey, sval)
            continue
          } else {
            pseudoStyle[subKey] = sval
          }
        }
        fixNativeShadow(pseudoStyle, true)
        psuedos[key] = pseudoStyle
        continue
      }
      // get value from theme
      val = varToVal(val)
      // transforms
      if (key in stylePropsTransform) {
        cur = cur || {}
        mergeTransform(cur, key, val)
        continue
      }
      cur = cur || {}
      cur[key] = val
      continue
    }
    if (
      !isWeb ||
      // dont need to validate when in static mode itll validate client-side
      (!forwardPropsList ? true : key in forwardPropsList) ||
      (key[0] === 'd' && key.startsWith('data-'))
    ) {
      // if no match, prop
      viewProps[key] = val
    }
  }
  // push last style
  if (cur) {
    fixNativeShadow(cur, true)
    style.push(cur)
  }
  // if (process.env.NODE_ENV === 'development') {
  //   if (props['debug']) {
  //     try {
  //       console.log(' processed styles:', JSON.stringify({ props, viewProps, style }, null, 2))
  //     } catch {
  //       console.log(' processed styles:', { props, viewProps, style })
  //     }
  //   }
  // }
  return {
    viewProps,
    style,
    psuedos,
  }
}
