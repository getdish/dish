import React from 'react'
import { createPortal } from 'react-dom'
import { Platform } from 'react-native'

import { useOverlay } from '../hooks/useOverlay'
import { Box } from './Box'
import { AbsoluteVStack, StackProps } from './Stacks'

export const Modal = ({
  isOpen,
  onClickOutside,
  ...rest
}: StackProps & {
  isOpen: boolean
  onClickOutside?: Function
}) => {
  const zIndex = 10

  useOverlay({ isOpen, onClick: onClickOutside, zIndex })

  if (process.env.TARGET === 'ssr') {
    // for now at least
    return null
  }

  const content = (
    <AbsoluteVStack
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
      />
    </AbsoluteVStack>
  )

  if (Platform.OS === 'web') {
    return createPortal(content, document.getElementById('modals')!)
  }

  return content
}
