import React from 'react'

import { PopoverProps } from './PopoverProps'

export const Popover = (props: PopoverProps) => {
  return <PopoverMain {...props} />
}

const PopoverMain =
  process.env.TARGET === 'ssr'
    ? require('./PopoverMain').default
    : React.lazy(() => import('./PopoverMain'))
