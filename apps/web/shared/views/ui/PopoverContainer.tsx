import React from 'react'

import { PopoverProps } from './PopoverProps'

export const Popover = (props: PopoverProps) => {
  return <PopoverMain {...props} />
}

const PopoverMain =
  process.env.TARGET === 'ssr'
    ? require('./Popover').default
    : React.lazy(() => import('./Popover'))
