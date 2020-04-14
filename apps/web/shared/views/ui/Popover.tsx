import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'
import { Platform } from 'react-native'
import PopoverWeb, { ArrowContainer } from 'react-tiny-popover'

import { isWorker } from '../../constants'
import { useOverlay } from './useOverlay'
import { useWaterfall } from './useWaterfall'

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
  const [isMounted, setIsMounted] = useState(false)
  const isOpen = typeof forceShow == 'boolean' ? forceShow : !!props.isOpen

  if (!isWorker) {
    useWaterfall(() => {
      setIsMounted(true)
    })
  }

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

  if (!isMounted) {
    return props.children
  }

  if (Platform.OS == 'web') {
    const content = (
      <div
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        className="see-through"
      >
        {props.contents}
      </div>
    )

    return (
      <PopoverWeb
        position={props.position}
        isOpen={isOpen}
        padding={15}
        containerStyle={{
          overflow: 'visible',
          position: 'absolute',
          // @ts-ignore
          zIndex: 10000000,
        }}
        content={({ position, targetRect, popoverRect }) =>
          props.noArrow ? (
            content
          ) : (
            <ArrowContainer
              position={position}
              targetRect={targetRect}
              popoverRect={popoverRect}
              style={{
                zIndex: 100000000,
              }}
              arrowColor={'white'}
              arrowSize={10}
              arrowStyle={{
                zIndex: 1000000000,
                pointerEvents: 'none',
              }}
            >
              {content}
            </ArrowContainer>
          )
        }
      >
        {props.children}
      </PopoverWeb>
    )
  }
  // return (
  // <PopoverNative isVisible={props.isOpen}>{props.children}</PopoverNative>
  // )
  return null
}
