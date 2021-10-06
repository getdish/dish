import { Restaurant } from '@dish/graph'
import { Plus } from '@dish/react-feather'
import React, { useState } from 'react'
import { Box, Popover } from 'snackui'

import { LenseButtonBar } from '../../views/LenseButtonBar'
import { LinkButton } from '../../views/LinkButton'

export const RestaurantAddTagButton = ({ restaurant }: { restaurant: Restaurant }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      isOpen={isOpen}
      onChangeOpen={setIsOpen}
      trigger={(props) => (
        <LinkButton marginTop={4} {...props} onPress={() => setIsOpen((x) => !x)}>
          <Plus size={12} color="#555" />
        </LinkButton>
      )}
    >
      <Box>
        <LenseButtonBar />
      </Box>
    </Popover>
  )
}
