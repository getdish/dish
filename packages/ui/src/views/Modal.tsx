import React, { useLayoutEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { useOverlay } from '../hooks/useOverlay'
import { Box } from './Box'
import { StackProps, ZStack } from './Stacks'

export const Modal = ({
  isOpen,
  onClickOutside,
  ...rest
}: StackProps & {
  isOpen: boolean
  onClickOutside?: Function
}) => {
  const zIndex = 10

  const container = useMemo(() => document.createElement('div'), [])
  useLayoutEffect(() => {
    document.getElementById('modals')?.appendChild(container)
    return () => {
      document.getElementById('modals')?.removeChild(container)
    }
  }, [])

  useOverlay({ isOpen, onClick: onClickOutside, zIndex })

  if (process.env.TARGET === 'ssr') {
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
