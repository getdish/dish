import { graphql } from '@dish/graph'
import { Box, HStack, HoverablePopover, prevent } from '@dish/ui'
import React, { memo } from 'react'
import { Tag } from 'react-feather'

import { SmallButton } from '../../views/ui/SmallButton'
import { HomeLenseBar } from './HomeLenseBar'
import { useUserTagVotes } from './useUserReview'

export const RestaurantLenseVote = memo(
  graphql(({ restaurantId }: { restaurantId: string }) => {
    const votes = useUserTagVotes(restaurantId)
    console.log('votes', votes)
    return (
      <HoverablePopover
        allowHoverOnContent
        position="right"
        contents={
          <Box pointerEvents="auto" padding={15}>
            <HStack marginTop={-10} marginBottom={8}>
              <HomeLenseBar
                minimal
                activeTagIds={{}}
                onPressLense={(lense) => {
                  console.warn('should vote for lense')
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
