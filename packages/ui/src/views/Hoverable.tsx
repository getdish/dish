import React from 'react'

import { isHoverEnabled } from './HoverState'

export function Hoverable(props: {
  children?: any
  onHoverIn?: Function
  onHoverOut?: Function
  onHoverMove?: Function
}) {
  const { onHoverIn, onHoverOut, onHoverMove, children } = props
  const [isHovered, setHovered] = React.useState(false)
  const [showHover, setShowHover] = React.useState(true)

  function handleMouseEnter() {
    if (isHoverEnabled() && !isHovered) {
      console.log('mouse enter', isHoverEnabled(), props)
      onHoverIn?.()
      setHovered(true)
    }
  }

  function handleMouseLeave() {
    if (isHovered) {
      onHoverOut?.()
      setHovered(false)
    }
  }

  const child =
    typeof children === 'function' ? children(showHover && isHovered) : children

  return React.cloneElement(React.Children.only(child), {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseMove: onHoverMove,
    // prevent hover showing while responder
    onResponderGrant: () => setShowHover(false),
    onResponderRelease: () => setShowHover(true),
  })
}

Hoverable.displayName = 'Hoverable'
