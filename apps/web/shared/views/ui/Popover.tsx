import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { ToggleLayer, anchor } from 'react-laag'
import { AnchorEnum } from 'react-laag/dist/ToggleLayer/types'
import {
  Platform,
  StyleProp,
  TouchableOpacity,
  ViewComponent,
} from 'react-native'
import ResizeObserver from 'resize-observer-polyfill'

import { VStack, ZStack } from './Stacks'
import { useOverlay } from './useOverlay'

export const ForceShowPopover = createContext<boolean | undefined>(undefined)

export const popoverCloseCbs = new Set<Function>()
export const closeAllPopovers = () => {
  popoverCloseCbs.forEach((cb) => cb())
  popoverCloseCbs.clear()
}

if (Platform.OS == 'web') {
  const handleKeyDown = (e) => {
    if (e.keyCode == 27) {
      // esc
      if (popoverCloseCbs.size) {
        const [first] = [...popoverCloseCbs]
        first?.(false)
        popoverCloseCbs.delete(first)
        e.preventDefault()
      }
    }
  }
  window.addEventListener('keydown', handleKeyDown)
}

export type PopoverProps = {
  inline?: boolean
  anchor?: AnchorEnum
  position?: 'top' | 'left' | 'right' | 'bottom'
  children: React.ReactElement
  contents: React.ReactElement
  isOpen?: boolean
  noArrow?: boolean
  overlay?: boolean
  overlayPointerEvents?: boolean
  onChangeOpen?: (next: boolean) => any
  style?: React.HTMLAttributes<HTMLDivElement>['style']
}

export const Popover = (props: PopoverProps) => {
  const forceShow = useContext(ForceShowPopover)
  const isOpen = typeof forceShow == 'boolean' ? forceShow : props.isOpen
  const onChangeOpenCb = useCallback(props.onChangeOpen, [props.onChangeOpen])
  const closeCb = useRef<Function | null>(null)
  const isControlled = typeof isOpen !== 'undefined'

  useLayoutEffect(() => {
    if (onChangeOpenCb) {
      popoverCloseCbs.add(onChangeOpenCb)
      return () => {
        popoverCloseCbs.delete(onChangeOpenCb!)
      }
    }
  }, [onChangeOpenCb])

  if (Platform.OS == 'web') {
    useOverlay({
      isOpen: isOpen && props.overlay !== false,
      onClick: () => {
        if (!isControlled) {
          closeCb.current?.()
        }
        onChangeOpenCb?.(false)
      },
      pointerEvents: props.overlayPointerEvents,
    })
  }

  if (Platform.OS == 'web') {
    return (
      <ToggleLayer
        ResizeObserver={ResizeObserver}
        {...(isControlled && { isOpen })}
        container={document.body}
        fixed
        renderLayer={({ layerProps, close, arrowStyle }) => {
          if (!props.isOpen) {
            return null
          }
          closeCb.current = close
          return (
            <div
              ref={layerProps.ref}
              className="popover-content see-through"
              style={{
                ...layerProps.style,
                zIndex: 100000,
                pointerEvents: isOpen ? 'auto' : 'none',
              }}
            >
              {props.contents}
              {!props.noArrow && (
                <Arrow
                  style={{
                    position: 'absolute',
                    transformOrigin: 'center',
                    transform: getArrowTranslate(props.position),
                    ...arrowStyle,
                  }}
                />
              )}
            </div>
          )
        }}
        closeOnOutsideClick
        closeOnDisappear="partial"
        placement={{
          // preferX:
          //   props.position === 'left' || props.position === 'right'
          //     ? (props.position.toUpperCase() as any)
          //     : undefined,
          // preferY:
          //   props.position === 'top' || props.position === 'bottom'
          //     ? (props.position.toUpperCase() as any)
          //     : undefined,
          anchor:
            props.anchor ?? props.position === 'top'
              ? anchor.TOP_CENTER
              : props.position == 'left'
              ? anchor.LEFT_CENTER
              : props.position === 'right'
              ? anchor.RIGHT_CENTER
              : anchor.BOTTOM_CENTER,
          autoAdjust: true,
          snapToAnchor: false,
          triggerOffset: 12,
          scrollOffset: 16,
          // preferX: 'RIGHT',
        }}
      >
        {({ isOpen, triggerRef, toggle }) => (
          <div
            ref={triggerRef}
            className={`see-through ${props.inline ? 'inline-flex' : ''}`}
            style={props.style}
          >
            {props.children}
          </div>
        )}
      </ToggleLayer>
    )
  }

  // native: todo
  return null
}

function getArrowTranslate(position) {
  let x = '-50%'
  let y = '0px'
  const OFFSET = 3.5
  if (position === 'left') {
    x = -OFFSET + 'px'
    y = '-50%'
  } else if (position === 'right') {
    x = OFFSET + 'px'
    y = '-50%'
  }
  const rotation = {
    top: 180,
    right: -90,
    left: 90,
    bottom: 0,
  }
  return `translate(${x}, ${y}) rotate(${rotation[position]}deg)`
}

const Arrow = (props: any) => (
  <svg width={14} height={7} {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        fill="#CDCFD0"
        d="M7 .07v1.428l-5.55 5.5L0 6.982zM7 .07v1.428l5.55 5.5L14 6.982z"
      />
      <path fill="#FFF" d="M1.45 7L7 1.498 12.55 7z" />
    </g>
  </svg>
)
