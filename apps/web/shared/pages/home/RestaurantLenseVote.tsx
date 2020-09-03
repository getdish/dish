import { graphql } from '@dish/graph'
import { HStack, Spacer, StackProps, Text } from '@dish/ui'
import React, { memo } from 'react'

import { tagDisplayName } from '../../state/tagDisplayName'
import { tagLenses } from '../../state/tagLenses'
import { SmallButton } from '../../views/ui/SmallButton'
import { useUserTagVotes } from './useUserReview'

export const RestaurantLenseVote = memo(
  graphql(
    ({ restaurantId, ...props }: StackProps & { restaurantId: string }) => {
      const [votes, vote] = useUserTagVotes(restaurantId)
      console.log('votes', votes)
      return (
        <HStack spacing="sm" {...props}>
          {tagLenses.map((lense) => {
            const isUpvoted = votes.some((x) => x.id === lense.id)
            return (
              <SmallButton
                isActive={isUpvoted}
                marginBottom={6}
                key={lense.id}
                onPress={() => vote(lense, 'toggle')}
                overflow="hidden"
              >
                <Text
                  fontSize={42}
                  transform={[{ rotate: '-12.5deg' }]}
                  marginVertical={-16}
                  marginLeft={-18}
                  marginRight={12}
                >
                  {lense.icon}
                </Text>{' '}
                {tagDisplayName(lense)}
                <Spacer size="sm" />
                <Text fontWeight="400" color="rgba(0,0,0,0.5)" fontSize={12}>
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
