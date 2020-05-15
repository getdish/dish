import React from 'react'

import { PopoverProps } from './PopoverProps'

export const Popover = (props: PopoverProps) => {
  return <PopoverMain {...props} />
}

const PopoverMain = React.lazy(() => import('./PopoverMain'))
