import React from 'react'

import { isBrowser } from '../constants'
import { combineFns } from '../helpers/combineFns'

// import { isHoverEnabled } from './HoverState'

const mousesUp = new Set<Function>()

if (isBrowser) {
  document.addEventListener('mouseup', (e) => {
    mousesUp.forEach((cb) => cb(e))
    mousesUp.clear()
  })
}

export function Hoverable({
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  onHoverMove,
  children,
}: {
  children?: any
  onHoverIn?: Function
  onHoverOut?: Function
  onHoverMove?: Function
  onPressIn?: Function
  onPressOut?: Function
}) {
  return React.cloneElement(React.Children.only(children), {
    onMouseEnter: combineFns(onHoverIn),
    onMouseLeave: combineFns(onPressOut, onHoverOut),
    onMouseMove: onHoverMove,
    onMouseDown: onPressIn,
    onMouseUp: onPressOut,
    // prevent hover showing while responder
    // onResponderGrant: () => setShowHover(false),
    // onResponderRelease: () => setShowHover(true),
  })
}
