import React from 'react'

import { Box } from './Box'
import { HoverablePopover } from './HoverablePopover'
import { PopoverProps } from './PopoverProps'
import { Text } from './Text'

export const Tooltip = ({ contents, ...props }: PopoverProps) => {
  return (
    <HoverablePopover
      noArrow
      contents={
        <Box backgroundColor="#000">
          <Text color="#fff">{contents}</Text>
        </Box>
      }
      {...props}
    />
  )
}
