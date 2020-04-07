import { useLayoutEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { StackBaseProps, ZStack } from './shared/Stacks'
import { Tooltip } from './shared/Tooltip'
import { useOverlay } from './shared/useOverlay'

export const Modal = ({
  isOpen,
  onClickOutside,
  ...rest
}: StackBaseProps & {
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

  return createPortal(
    <ZStack
      fullscreen
      zIndex={zIndex}
      alignItems="center"
      justifyContent="center"
      pointerEvents="none"
    >
      <Tooltip
        pointerEvents={isOpen ? 'auto' : 'none'}
        opacity={isOpen ? 1 : 0}
        justifyContent="center"
        maxWidth="50%"
        maxHeight="90%"
        {...rest}
      ></Tooltip>
    </ZStack>,
    container
  )
}
