// debug
import { graphql } from '@dish/graph'
import { HStack, Spacer, StackProps, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { tagDisplayName } from '../../state/tagDisplayName'
import { tagLenses } from '../../state/tagLenses'
import { SmallButton } from '../../views/ui/SmallButton'
import { useUserTagVotes } from './useUserReview'

export const RestaurantLenseVote = memo(
  graphql(
    ({ restaurantId, ...props }: StackProps & { restaurantId: string }) => {
      const [votes, vote] = useUserTagVotes(restaurantId)
      console.log('votes', votes, tagLenses)
      return (
        <HStack flexWrap="wrap" width="100%" spacing="sm" {...props}>
          {tagLenses.slice(1).map((lense) => {
            const isUpvoted = votes.some((x) => x.id === lense.id)
            return (
              <SmallButton
                isActive={isUpvoted}
                key={lense.id}
                onPress={() => vote(lense, 'toggle')}
                overflow="hidden"
                marginBottom={8}
              >
                <Text
                  position="absolute"
                  top={-5}
                  left={-8}
                  fontSize={34}
                  transform={[{ rotate: '-12deg' }]}
                >
                  {lense.icon}
                </Text>
                <VStack width={24} />
                {tagDisplayName(lense)}
                <Spacer size="xs" />
                <Text fontWeight="400" color="rgba(0,0,0,0.5)" fontSize={11}>
                  +20
                </Text>
              </SmallButton>
            )
          })}
        </HStack>
      )
    }
  )
)
