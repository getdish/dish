import React from 'react'

import { Box } from './Box'
import { HoverablePopover } from './HoverablePopover'
import { PopoverProps } from './PopoverProps'
import { Text } from './Text'

export const Tooltip = ({
  contents,
  ...props
}: Omit<PopoverProps, 'contents'> & { contents: any }) => {
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
