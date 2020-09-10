import { Restaurant } from '@dish/graph'
import { Plus } from '@dish/react-feather'
import { Box, Popover } from '@dish/ui'
import React, { useState } from 'react'

import { LinkButton } from '../../views/ui/LinkButton'
import { HomeLenseBar } from './HomeLenseBar'

export const RestaurantAddTagButton = ({
  restaurant,
}: {
  restaurant: Restaurant
}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      isOpen={isOpen}
      onChangeOpen={setIsOpen}
      contents={
        <Box>
          <HomeLenseBar />
        </Box>
      }
    >
      <LinkButton marginTop={4} onPress={() => setIsOpen((x) => !x)}>
        <Plus size={12} color="#555" />
      </LinkButton>
    </Popover>
  )
}
