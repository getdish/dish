import { Restaurant } from '@dish/models'
import React, { useState } from 'react'
import { Text } from 'react-native'

import { Box } from '../ui/Box'
import { Icon } from '../ui/Icon'
import { LinkButton } from '../ui/Link'
import { Popover } from '../ui/Popover'
import { HStack } from '../ui/Stacks'
import HomeLenseBar, { HomeLenseBarOnly } from './HomeLenseBar'
import { getTagElements } from './RestaurantTagsRow'

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
        <Icon name="Plus" size={12} color="#555" />
      </LinkButton>
    </Popover>
  )
}
