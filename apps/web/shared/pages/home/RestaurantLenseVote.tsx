import { graphql } from '@dish/graph'
import { Box, HStack, HoverablePopover, prevent } from '@dish/ui'
import React, { memo } from 'react'
import { Tag } from 'react-feather'

import { getTagId } from '../../state/getTagId'
import { tagLenses } from '../../state/tagLenses'
import { SmallButton } from '../../views/ui/SmallButton'
import { HomeLenseBar } from './HomeLenseBar'
import { useUserTagVotes } from './useUserReview'

export const RestaurantLenseVote = memo(
  graphql(({ restaurantId }: { restaurantId: string }) => {
    const [votes, vote] = useUserTagVotes(restaurantId)
    const activeTagIds = votes
      .map((x) => x.tag_id)
      .reduce((acc, id) => {
        const name = tagLenses.find((x) => x.id === id)?.name
        acc[getTagId({ name, type: 'lense' })] = true
        return acc
      }, {})
    return (
      <HStack>
        <HomeLenseBar
          minimal
          activeTagIds={activeTagIds}
          onPressLense={(lense) => {
            vote(lense.name, 'toggle')
          }}
        />
      </HStack>
    )
  })
)
