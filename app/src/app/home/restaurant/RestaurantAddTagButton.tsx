import { LenseButtonBar } from '../../views/LenseButtonBar'
import { LinkButton } from '../../views/LinkButton'
import { Restaurant } from '@dish/graph'
import { Card, Popover } from '@dish/ui'
import { Plus } from '@tamagui/feather-icons'
import React, { useState } from 'react'

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
      <Card>
        <LenseButtonBar />
      </Card>
    </Popover>
  )
}
