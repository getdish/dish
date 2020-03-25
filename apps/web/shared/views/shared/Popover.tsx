import React, { createContext, useContext, useEffect } from 'react'
import PopoverNative from 'react-native-popover-view'
import PopoverWeb, { ArrowContainer } from 'react-tiny-popover'
import { Platform } from 'react-native'

export const ForceShowPopover = createContext<boolean | undefined>(undefined)

export const popoverCloseCbs = new Set<Function>()
export const closeAllPopovers = () => {
  popoverCloseCbs.forEach((cb) => cb())
}

export const Popover = (props: {
  position?: 'top' | 'left' | 'right' | 'bottom'
  children: React.ReactElement
  target: React.ReactElement
  isOpen?: boolean
  onClickOutside?: Function
}) => {
  const forceShow = useContext(ForceShowPopover)

  useEffect(() => {
    if (props.onClickOutside) {
      popoverCloseCbs.add(props.onClickOutside)
      return () => popoverCloseCbs.delete(props.onClickOutside)
    }
  }, [])

  if (Platform.OS == 'web') {
    return (
      <PopoverWeb
        position={props.position}
        isOpen={typeof forceShow == 'boolean' ? forceShow : props.isOpen}
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
            }}
          >
            {props.children}
          </ArrowContainer>
        )}
      >
        {props.target}
      </PopoverWeb>
    )
  }
  // return (
  // <PopoverNative isVisible={props.isOpen}>{props.children}</PopoverNative>
  // )
  return null
}
