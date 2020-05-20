import { Restaurant } from '@dish/graph'
import { Box, Popover } from '@dish/ui'
import React, { useState } from 'react'
import { Plus } from 'react-feather'

import { LinkButton } from '../ui/LinkButton'
import { HomeLenseBarOnly } from './HomeLenseBar'

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
          <HomeLenseBarOnly activeTagIds={{}} />
        </Box>
      }
    >
      <LinkButton marginTop={4} onPress={() => setIsOpen((x) => !x)}>
        <Plus size={12} color="#555" />
      </LinkButton>
    </Popover>
  )
}
