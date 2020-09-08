// debug
import { Tag, graphql } from '@dish/graph'
import {
  AbsoluteVStack,
  HStack,
  Spacer,
  StackProps,
  VStack,
  prevent,
} from '@dish/ui'
import { Text } from '@dish/ui'
import { default as React, memo } from 'react'
import { ChevronDown, ChevronUp, ThumbsDown, ThumbsUp } from 'react-feather'

import { tagDisplayName } from '../../state/tagDisplayName'
import { FullTag, tagLenses } from '../../state/tagLenses'
import { SmallButton } from '../../views/ui/SmallButton'
import { FavoriteButtonProps } from './FavoriteButton'
import { useUserTagVotes, useUserUpvoteDownvoteQuery } from './useUserReview'

export const RestaurantLenseVote = memo(
  graphql(
    ({ restaurantId, ...props }: StackProps & { restaurantId: string }) => {
      return (
        <HStack flexWrap="wrap" width="100%" spacing="sm" {...props}>
          {tagLenses.map((lense) => {
            return (
              <TagSmallButton
                key={lense.id}
                tag={lense}
                restaurantId={restaurantId}
              />
            )
          })}
        </HStack>
      )
    }
  )
)

const borderRadius = 10

export const TagSmallButton = graphql(
  ({
    size,
    restaurantId,
    tag,
  }: {
    size?: FavoriteButtonProps['size']
    restaurantId: string
    tag: FullTag
  }) => {
    const [votes, setVote] = useUserTagVotes(restaurantId, tag.id)
    const review = votes[0]
    const vote = review?.rating ?? 0
    const hasVoted = vote === 1 || vote === -1

    const VoteIcon = vote == 1 || vote === 0 ? ThumbsUp : ThumbsDown
    const backgroundColor = vote === 1 ? 'green' : vote === -1 ? 'red' : '#999'

    return (
      <SmallButton
        onPress={() => setVote(tag, vote === -1 ? 0 : vote === 1 ? -1 : 1)}
        marginBottom={8}
        backgroundColor={backgroundColor}
        hoverStyle={{
          backgroundColor,
        }}
        textStyle={{
          color: hasVoted ? '#fff' : '#fff',
        }}
      >
        <HStack
          // match to smallbutton, hacky for now
          margin={-8}
          marginHorizontal={-11}
          padding={8}
          paddingHorizontal={11}
          borderRadius={20}
          position="relative"
          overflow="hidden"
        >
          <AbsoluteVStack
            position="absolute"
            top={-5}
            left={-8}
            bottom={-5}
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize={34} transform={[{ rotate: '-12deg' }]}>
              {tag.icon}
            </Text>
          </AbsoluteVStack>
          <VStack width={24} />
          {tagDisplayName(tag)}
          <Spacer size="xs" />
        </HStack>

        <Spacer size="sm" />

        <VoteIcon size={16} color="#fff" />
      </SmallButton>
    )
  }
)
