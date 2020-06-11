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
  const setIsntHovering = useDebounce(() => set(false), 400, undefined, [])
  const setIsHovering = () => {
    setIsntHovering.cancel()
    set(true)
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
