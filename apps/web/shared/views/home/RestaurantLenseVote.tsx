import { Box, HoverablePopover, Text } from '@dish/ui'
import React from 'react'

import { LinkButton } from '../ui/LinkButton'
import { HomeLenseBarOnly } from './HomeLenseBar'

export const RestaurantLenseVote = () => {
  return (
    <HoverablePopover
      allowHoverOnContent
      contents={
        <Box pointerEvents="auto">
          <HomeLenseBarOnly activeTagIds={{}} />
        </Box>
      }
    >
      <LinkButton
        backgroundColor="#bbb"
        borderRadius={100}
        paddingVertical={2.5}
        paddingHorizontal={10}
      >
        <Text color="#fff" fontWeight="500" fontSize={13}>
          Tag
        </Text>
      </LinkButton>
    </HoverablePopover>
  )
}
