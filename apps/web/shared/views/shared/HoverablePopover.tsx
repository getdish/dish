import React, { useState } from 'react'

import Hoverable from './Hoverable'
import { Popover, PopoverProps } from './Popover'

export const HoverablePopover = ({ children, ...props }: PopoverProps) => {
  const [isHovering, setIsHovering] = useState(false)
  return (
    <Popover isOpen={isHovering} {...props}>
      <Hoverable
        onHoverIn={() => setIsHovering(true)}
        onHoverOut={() => setIsHovering(false)}
      >
        {children}
      </Hoverable>
    </Popover>
  )
}
