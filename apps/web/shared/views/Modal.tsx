import React from 'react'
import { useLayoutEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { isSSR } from '../constants'
import { Box } from './ui/Box'
import { StackProps, ZStack } from './ui/Stacks'
import { useOverlay } from './ui/useOverlay'

export const Modal = ({
  isOpen,
  onClickOutside,
  ...rest
}: StackProps & {
  isOpen: boolean
  onClickOutside?: Function
}) => {
  const container = useMemo(() => document.createElement('div'), [])
  const zIndex = 10

  useLayoutEffect(() => {
    document.getElementById('modals').appendChild(container)
    return () => {
      document.getElementById('modals').removeChild(container)
    }
  }, [])

  useOverlay({ isOpen, onClick: onClickOutside, zIndex })

  if (isSSR) {
    // for now at least
    return null
  }

  return createPortal(
    <ZStack
      fullscreen
      zIndex={zIndex}
      alignItems="center"
      justifyContent="center"
      pointerEvents="none"
    >
      <Box
        pointerEvents={isOpen ? 'auto' : 'none'}
        opacity={isOpen ? 1 : 0}
        justifyContent="center"
        maxWidth="50%"
        maxHeight="90%"
        {...rest}
      ></Box>
    </ZStack>,
    container
  )
}
