import React from 'react'

import { Box } from './Box'
import { HoverablePopover } from './HoverablePopover'
import { PopoverProps } from './PopoverProps'
import { Text } from './Text'

export type TooltipProps = Omit<PopoverProps, 'contents'> & { contents: any }

export const Tooltip = ({ contents, ...props }: TooltipProps) => {
  return (
    <HoverablePopover
      noArrow
      contents={
        <Box backgroundColor="#000" paddingHorizontal={9} borderRadius={1000}>
          <Text fontSize={14} color="#fff">
            {contents}
          </Text>
        </Box>
      }
      {...props}
    />
  )
}
