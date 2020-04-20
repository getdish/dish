import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
} from 'react'
import { ToggleLayer, Transition, anchor } from 'react-laag'
import { Platform, TouchableOpacity } from 'react-native'
import ResizeObserver from 'resize-observer-polyfill'

import { VStack, ZStack } from './Stacks'
import { useOverlay } from './useOverlay'

export const ForceShowPopover = createContext<boolean | undefined>(undefined)

export const popoverCloseCbs = new Set<Function>()
export const closeAllPopovers = () => {
  popoverCloseCbs.forEach((cb) => cb())
}

export type PopoverProps = {
  position?: 'top' | 'left' | 'right' | 'bottom'
  children: React.ReactElement
  contents: React.ReactElement
  isOpen?: boolean
  noArrow?: boolean
  overlay?: boolean
  overlayPointerEvents?: boolean
  onChangeOpen?: (next: boolean) => any
}

export const Popover = (props: PopoverProps) => {
  const forceShow = useContext(ForceShowPopover)
  const isOpen = typeof forceShow == 'boolean' ? forceShow : !!props.isOpen

  const close = useCallback(props.onChangeOpen, [props.onChangeOpen])

  useLayoutEffect(() => {
    if (close) {
      popoverCloseCbs.add(close)
      return () => {
        popoverCloseCbs.delete(close!)
      }
    }
  }, [close])

  if (Platform.OS == 'web') {
    useOverlay({
      isOpen: isOpen && props.overlay !== false,
      onClick: close,
      pointerEvents: props.overlayPointerEvents,
    })
  }

  if (Platform.OS == 'web') {
    return (
      <ToggleLayer
        ResizeObserver={ResizeObserver}
        {...(typeof isOpen !== 'undefined' && { isOpen })}
        container={document.body}
        fixed
        renderLayer={({ layerProps, close, arrowStyle }) => {
          if (!props.isOpen) {
            return null
          }
          return (
            <div
              ref={layerProps.ref}
              style={{
                ...layerProps.style,
              }}
            >
              <div
                style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                className="popover-content see-through"
                onClick={close}
              >
                {props.contents}
              </div>
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
          anchor: anchor.BOTTOM_CENTER,
          autoAdjust: true,
          snapToAnchor: false,
          triggerOffset: 12,
          scrollOffset: 16,
          // preferX: 'RIGHT',
        }}
      >
        {({ isOpen, triggerRef, toggle }) => (
          <div ref={triggerRef} className="see-through">
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
