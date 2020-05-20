import React, { useState } from 'react'

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
  const [isHovering, setIsHovering] = useState(false)

  const contentsEl = allowHoverOnContent ? (
    <Hoverable
      onHoverIn={() => setIsHovering(true)}
      onHoverOut={() => setIsHovering(false)}
    >
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
      contents={contentsEl}
      {...props}
    >
      <Hoverable
        onHoverIn={() => setIsHovering(true)}
        onHoverOut={() => setIsHovering(false)}
      >
        {children}
      </Hoverable>
    </Popover>
  )
}
