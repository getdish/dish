// debug
import { graphql } from '@dish/graph'
import { ThumbsDown, ThumbsUp } from '@dish/react-feather'
import { default as React } from 'react'
import { AbsoluteVStack, HStack, Spacer, Text, VStack } from 'snackui'

import {
  bg,
  bgHover,
  darkGreen,
  darkGrey,
  darkRed,
  green,
  grey,
  red,
} from '../colors'
import { useUserTagVotes } from '../hooks/useUserUpvoteDownvoteQuery'
import { tagDisplayName } from '../state/tagDisplayName'
import { FullTag } from '../state/tagLenses'
import { SmallButton } from './ui/SmallButton'

export const TagSmallButton = graphql(
  ({
    restaurantId,
    tag,
    image,
  }: {
    restaurantId: string
    tag: FullTag
    image?: any
  }) => {
    const [votes, setVote] = useUserTagVotes(restaurantId, tag.id)
    const review = votes[0]
    const vote = review?.vote ?? 0
    const hasVoted = vote === 1 || vote === -1
    const VoteIcon = vote == 1 || vote === 0 ? ThumbsUp : ThumbsDown
    const backgroundColor = vote === 1 ? green : vote === -1 ? red : grey
    const backgroundColorHover =
      vote === 1 ? darkGreen : vote === -1 ? darkRed : darkGrey

    return (
      <SmallButton
        onPress={() => setVote(tag, vote === -1 ? 0 : vote === 1 ? -1 : 1)}
        marginBottom={8}
        backgroundColor={backgroundColor}
        hoverStyle={{
          backgroundColor: backgroundColorHover,
        }}
        color={hasVoted ? '#fff' : '#fff'}
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
              {image ?? tag.icon}
            </Text>
          </AbsoluteVStack>
          <VStack width={24} />
          <Text color="#fff">{tagDisplayName(tag)}</Text>
          <Spacer size="xs" />
        </HStack>

        <Spacer size="sm" />

        <VoteIcon size={16} color="#fff" />
      </SmallButton>
    )
  }
)
