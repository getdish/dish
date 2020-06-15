import React, { useState } from 'react'

import { useDebounce } from '../hooks/useDebounce'
import { Hoverable } from './Hoverable'
import { Popover } from './PopoverContainer'
import { PopoverProps } from './PopoverProps'

export const HoverablePopover = ({
  children,
  allowHoverOnContent,
  contents,
  ...props
}: PopoverProps & {
  allowHoverOnContent?: boolean
}) => {
  const [isHovering, set] = useState(false)
  const setIsntHoveringSlow = useDebounce(() => set(false), 200)
  const setIsHoveringSlow = useDebounce(() => set(true), 250)
  const cancelAll = () => {
    setIsHoveringSlow.cancel()
    setIsntHoveringSlow.cancel()
  }
  const setIsntHovering = () => {
    cancelAll()
    setIsntHoveringSlow()
  }
  const setIsHovering = () => {
    cancelAll()
    setIsHoveringSlow()
  }

  const popoverContent = allowHoverOnContent ? (
    <Hoverable onHoverIn={setIsHovering} onHoverOut={setIsntHovering}>
      {contents}
    </Hoverable>
  ) : (
    contents
  )

  return (
    <Popover
      isOpen={isHovering}
      overlayPointerEvents={false}
      overlay={false}
      contents={popoverContent}
      {...props}
    >
      <Hoverable onHoverIn={setIsHovering} onHoverOut={setIsntHovering}>
        {children}
      </Hoverable>
    </Popover>
  )
}
