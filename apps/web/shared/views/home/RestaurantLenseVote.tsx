import { Box, HoverablePopover, Text } from '@dish/ui'
import React from 'react'
import { Plus } from 'react-feather'

import { LinkButton } from '../ui/LinkButton'
import { HomeLenseBarOnly } from './HomeLenseBar'

export const RestaurantLenseVote = () => {
  return (
    <HoverablePopover
      allowHoverOnContent
      position="bottom"
      contents={
        <Box pointerEvents="auto">
          <HomeLenseBarOnly activeTagIds={{}} />
        </Box>
      }
    >
      <LinkButton
        borderRadius={100}
        paddingVertical={2.5}
        paddingHorizontal={5}
      >
        <Text color="#fff" fontWeight="500" fontSize={12}>
          <Plus size={16} color="#888" />
        </Text>
      </LinkButton>
    </HoverablePopover>
  )
}
