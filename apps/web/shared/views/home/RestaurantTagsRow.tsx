import { Restaurant } from '@dish/models'
import React, { memo } from 'react'

import { useOvermind } from '../../state/om'
import { HStack } from '../ui/Stacks'
import { TagButton } from './TagButton'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'

type TagRowProps = {
  restaurant: Restaurant
  showMore?: boolean
  size?: 'lg' | 'md'
  divider?: any
}

export const RestaurantTagsRow = memo((props: TagRowProps) => {
  const { size = 'md' } = props
  const drawerWidth = useHomeDrawerWidthInner()
  const tagElements = useGetTagElements({ ...props, size })
  return (
    <HStack
      justifyContent="center"
      minWidth={size === 'lg' ? drawerWidth : 0}
      spacing={size == 'lg' ? 10 : 10}
    >
      {tagElements}
      {/* {!!showMore && <Text style={{ opacity: 0.5 }}>+5</Text>} */}
    </HStack>
  )
})

export const useGetTagElements = ({ restaurant, showMore }: TagRowProps) => {
  const om = useOvermind()
  return (restaurant.tags || []).slice(0, showMore ? 2 : 6).map((t, index) => {
    return (
      <TagButton
        size="sm"
        rank={index}
        key={`${index}${t.tag.name}`}
        tag={t.tag as any}
        votable={!!om.state.user.user}
      />
    )
  })
}
