import React from 'react'

export function Hoverable({
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  onHoverMove,
  children,
}: {
  children?: any
  onHoverIn?: any
  onHoverOut?: any
  onHoverMove?: any
  onPressIn?: any
  onPressOut?: any
}) {
  return (
    <span
      className="see-through"
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
      onMouseMove={onHoverMove}
      onMouseDown={onPressIn}
      onClick={onPressOut}
    >
      {children}
    </span>
  )
}
