import { Box, HStack, HoverablePopover, Text, prevent } from '@dish/ui'
import React, { memo } from 'react'
import { Plus } from 'react-feather'

import { LinkButton } from '../../views/ui/LinkButton'
import { HomeLenseBar } from './HomeLenseBar'
import { Input } from './Input'
import { useUserTagVotes } from './useUserReview'

export const RestaurantLenseVote = memo(
  ({ restaurantId }: { restaurantId: string }) => {
    const votes = useUserTagVotes(restaurantId)
    console.log('votes', votes)
    return (
      <HoverablePopover
        allowHoverOnContent
        position="bottom"
        contents={
          <Box
            pointerEvents="auto"
            alignItems="center"
            justifyContent="center"
            padding={20}
          >
            <HStack marginTop={-5} marginBottom={10}>
              <HomeLenseBar minimal activeTagIds={{}} />
            </HStack>

            <Input />
          </Box>
        }
      >
        <LinkButton
          borderRadius={100}
          paddingVertical={2.5}
          paddingHorizontal={5}
          onPress={prevent}
        >
          <Text color="#fff" fontWeight="500" fontSize={12}>
            <Plus size={14} color="#ccc" />
          </Text>
        </LinkButton>
      </HoverablePopover>
    )
  }
)
