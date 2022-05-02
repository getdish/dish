import { LenseButtonBar } from '../../views/LenseButtonBar'
import { LinkButton } from '../../views/LinkButton'
import { Restaurant } from '@dish/graph'
import { Card, Popover } from '@dish/ui'
import { Plus } from '@tamagui/feather-icons'
import React from 'react'

export const RestaurantAddTagButton = ({ restaurant }: { restaurant: Restaurant }) => {
  return (
    <Popover>
      <Popover.Trigger>
        <LinkButton marginTop={4}>
          <Plus size={12} color="#555" />
        </LinkButton>
      </Popover.Trigger>
      {/* TODO asChild test */}
      <Popover.Content>
        <Card>
          <LenseButtonBar />
        </Card>
      </Popover.Content>
    </Popover>
  )
}
