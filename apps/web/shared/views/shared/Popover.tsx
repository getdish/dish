import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'
import { Platform } from 'react-native'
import PopoverWeb, { ArrowContainer } from 'react-tiny-popover'

import { isWorker } from '../../constants'
import { useWaterfall } from './useWaterfall'

export const ForceShowPopover = createContext<boolean | undefined>(undefined)

export const popoverCloseCbs = new Set<Function>()
export const closeAllPopovers = () => {
  popoverCloseCbs.forEach((cb) => cb())
}

export const Popover = (props: {
  position?: 'top' | 'left' | 'right' | 'bottom'
  children: React.ReactElement
  contents: React.ReactElement
  isOpen?: boolean
  overlay?: boolean
  onClickOutside?: Function
}) => {
  const forceShow = useContext(ForceShowPopover)
  const [isMounted, setIsMounted] = useState(false)
  const isOpen = typeof forceShow == 'boolean' ? forceShow : !!props.isOpen

  if (!isWorker) {
    useWaterfall(() => {
      setIsMounted(true)
    })
  }

  useLayoutEffect(() => {
    if (props.onClickOutside) {
      popoverCloseCbs.add(props.onClickOutside)
      return () => {
        popoverCloseCbs.delete(props.onClickOutside!)
      }
    }
  }, [])

  if (Platform.OS == 'web') {
    useLayoutEffect(() => {
      if (props.overlay && isOpen) {
        const node = document.querySelector('#root')
        if (node) {
          const overlayDiv = document.createElement('div')
          overlayDiv.style.background = 'rgba(0,0,0,0.1)'
          overlayDiv.style.position = 'absolute'
          overlayDiv.style.top = '0px'
          overlayDiv.style.right = '0px'
          overlayDiv.style.bottom = '0px'
          overlayDiv.style.left = '0px'
          overlayDiv.style.zIndex = '1'
          overlayDiv.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            if (props.onClickOutside) {
              props.onClickOutside()
            }
          })
          node.parentNode.insertBefore(overlayDiv, node)
          return () => {
            node.parentNode.removeChild(overlayDiv)
          }
        }
      }
    }, [props.overlay, isOpen])
  }

  if (!isMounted) {
    return props.children
  }

  if (Platform.OS == 'web') {
    return (
      <PopoverWeb
        position={props.position}
        isOpen={isOpen}
        padding={20}
        containerStyle={{
          overflow: 'visible',
        }}
        content={({ position, targetRect, popoverRect }) => (
          <ArrowContainer
            position={position}
            targetRect={targetRect}
            popoverRect={popoverRect}
            arrowColor={'white'}
            arrowSize={20}
            arrowStyle={{
              // boxShadow: 'rgba(0,0,0,0.1) 10px 0',
              zIndex: 1000000000,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
              className="see-through"
            >
              {props.contents}
            </div>
          </ArrowContainer>
        )}
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
