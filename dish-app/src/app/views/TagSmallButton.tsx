import { graphql } from '@dish/graph'
import { Minus, ThumbsDown, ThumbsUp } from '@dish/react-feather'
import React, { Suspense, memo } from 'react'
import { AbsoluteVStack, HStack, Spacer, Text, VStack } from 'snackui'

import {
  darkGreen,
  darkGrey,
  darkRed,
  green,
  red,
} from '../../constants/colors'
import { tagDisplayName } from '../../constants/tagMeta'
import { getTagSlug } from '../../helpers/getTagSlug'
import { useUserTagVote } from '../hooks/useUserTagVotes'
import { FullTag } from '../state/tagTypes'

type TagSmallButtonProps = {
  restaurantSlug: string
  tag: FullTag
  image?: any
}

export const TagSmallButton = memo((props: TagSmallButtonProps) => {
  return (
    <Suspense fallback={null}>
      <TagSmallButtonContent {...props} />
    </Suspense>
  )
})

export const TagSmallButtonContent = graphql(
  ({ restaurantSlug, tag, image }: TagSmallButtonProps) => {
    const [vote, setVote] = useUserTagVote({
      restaurantSlug,
      tagSlug: getTagSlug(tag),
    })
    const hasVoted = vote === 1 || vote === -1
    const VoteIcon = vote === 0 ? Minus : vote == 1 ? ThumbsUp : ThumbsDown
    const backgroundColor = vote === 1 ? green : vote === -1 ? red : '#111'
    const backgroundColorHover =
      vote === 1 ? darkGreen : vote === -1 ? darkRed : darkGrey

    return (
      <HStack
        onPress={() => setVote(vote === -1 ? 0 : vote === 1 ? -1 : 1)}
        marginVertical={4}
        marginHorizontal={2}
        backgroundColor={backgroundColor}
        hoverStyle={{
          backgroundColor: backgroundColorHover,
        }}
        cursor="pointer"
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
        <Text fontSize={14} color="#fff">
          {tagDisplayName(tag)}
        </Text>
        <Spacer size="md" />
        <VoteIcon size={16} color="#fff" />
      </HStack>
    )
  }
)
