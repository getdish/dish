import React, { useEffect, useState } from 'react'

/**
 * Loading bar at top of browser
 */

const baseClass = 'BusyIndicator-' + Math.random().toString(36).slice(2)

// Add busy indicator stylesheet
var baseStyle = document.createElement('style')
baseStyle.type = 'text/css'
baseStyle.innerHTML = `
.${baseClass} {
  position: fixed;
  height: 2px;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 100000000000000000000000;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform ease-in 300ms, opacity ease-in 300ms;
  transition-delay: 0;
  opacity: 0;
}
.${baseClass}.active {
  animation: ${baseClass} 5s cubic-bezier(.2,.45,.6,.55);
  animation-fill-mode: forwards;
  opacity: 1;
}

@keyframes ${baseClass} {
  0% {
    transform: scaleX(0);
  }
  10% {
    transform: scaleX(0.3);
  }
  50% {
    transform: scaleX(0.7);
  }
  90% {
    transform: scaleX(0.8);
  }
  100% {
    transform: scaleX(1);
  }
}`
document.getElementsByTagName('head')[0].appendChild(baseStyle)

interface BusyIndicatorProps extends React.HTMLAttributes<any> {
  color?: string
  delayMs?: number
  isBusy?: boolean
}

export function BusyIndicator({
  className,
  color,
  isBusy,
  delayMs,
  style,
  ...props
}: BusyIndicatorProps) {
  let [hasRendered, setHasRendered] = useState(false)
  let isActive = isBusy

  // Prevent the `active` class from being applied on the first render,
  // to allow the CSS animation's delay prop to work even if `isActive`
  // is true when the component is mounted.
  useEffect(() => {
    if (!hasRendered) {
      isActive = false
      let tm = setTimeout(() => setHasRendered(true))
      return () => clearTimeout(tm)
    }
  })

  // Only add the `active` class to this element while the
  // next page is loading, triggering a CSS animation to
  // show or hide the loading bar.
  return React.createElement('div', {
    ...props,
    className: `${baseClass} ${isActive ? 'active' : ''} ${className || ''}`,
    style: {
      backgroundColor: color,
      boxShadow: `0 1px 2px rgba(0, 0, 0, 0.2) inset, 0 0 15px ${color}, 0 0 15px ${color}`,

      ...(isActive
        ? {
            transitionDelay: (delayMs || 0) + 'ms',
          }
        : {}),

      ...style,
    },
  })
}

BusyIndicator.defaultProps = {
  color: '#F54391',
  delayMs: 333,
}
