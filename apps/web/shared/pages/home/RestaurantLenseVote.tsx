import { graphql } from '@dish/graph'
import { Box, HStack, HoverablePopover, prevent } from '@dish/ui'
import React, { memo } from 'react'
import { Tag } from 'react-feather'

import { getTagId } from '../../state/getTagId'
import { tagLenses } from '../../state/tagLenses'
import { omStatic } from '../../state/useOvermind'
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
    console.log('activeTagIds', activeTagIds)
    return (
      <HoverablePopover
        allowHoverOnContent
        position="right"
        contents={
          <Box pointerEvents="auto" padding={15}>
            <HStack marginTop={-2} marginBottom={8}>
              <HomeLenseBar
                minimal
                activeTagIds={activeTagIds}
                onPressLense={(lense) => {
                  vote(lense.name, 'toggle')
                }}
              />
            </HStack>

            {/* <Input /> */}
          </Box>
        }
      >
        <SmallButton backgroundColor="transparent" onPress={prevent}>
          <Tag size={16} style={{ marginTop: 3, marginBottom: -2 }} />
        </SmallButton>
      </HoverablePopover>
    )
  })
)
