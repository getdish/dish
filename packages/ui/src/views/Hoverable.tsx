import React from 'react'

import { isBrowser } from '../constants'
import { combineFns } from '../helpers/combineFns'

// import { isHoverEnabled } from './HoverState'

// if we want to do nicer pressleave for pressStyle
// but we need to do it fairly complex, requires a few steps, maybe not worth
// const mousesUp = new Set<Function>()
// if (isBrowser) {
//   document.addEventListener('mouseup', (e) => {
//     mousesUp.forEach((cb) => cb(e))
//     mousesUp.clear()
//   })
// }

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
    onMouseEnter: onHoverIn,
    onMouseLeave: onHoverOut,
    onMouseMove: onHoverMove,
    onMouseDown: onPressIn,
    onClick: onPressOut,
    // prevent hover showing while responder
    // onResponderGrant: () => setShowHover(false),
    // onResponderRelease: () => setShowHover(true),
  })
}
