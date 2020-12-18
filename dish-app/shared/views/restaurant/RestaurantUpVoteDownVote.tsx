import { graphql } from '@dish/graph'
import {
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
  Frown,
  Heart,
  ThumbsDown,
} from '@dish/react-feather'
import React, { Suspense, memo } from 'react'
import { GestureResponderEvent } from 'react-native'
import { AbsoluteVStack, StackProps, Text, Tooltip, VStack } from 'snackui'

import { numberFormat } from '../../helpers/numberFormat'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useUserTagVotes } from '../../hooks/useUserTagVotes'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { tagLenses } from '../../state/localTags'
import { restaurantRatio } from './restaurantsRatio'
import { SentimentCircle } from './SentimentCircle'
import { VoteButton } from './VoteButton'

type UpvoteDownvoteProps = {
  restaurantSlug: string
  activeTags?: HomeActiveTagsRecord
  onClickPoints?: (event: GestureResponderEvent) => void
  // only to override
  score?: number
  ratio?: number
}

export const RestaurantUpVoteDownVote = (props: UpvoteDownvoteProps) => {
  return (
    <Suspense fallback={null}>
      <RestaurantUpVoteDownVoteContents
        activeTags={{ [tagLenses[0].slug]: true }}
        {...props}
      />
    </Suspense>
  )
}

const RestaurantUpVoteDownVoteContents = memo(
  graphql(function RestaurantUpVoteDownVote({
    restaurantSlug,
    onClickPoints,
    activeTags,
    score,
    ratio,
  }: UpvoteDownvoteProps) {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const { vote, setVote } = useUserTagVotes(restaurantSlug, activeTags)

    ratio = ratio ?? restaurantRatio(restaurant)
    score = (score ?? restaurant.score) + vote

    return (
      <VStack pointerEvents="auto" position="relative">
        <AbsoluteVStack
          bottom={-14}
          right={-10}
          zIndex={2}
          borderRadius={1000}
          backgroundColor="#fff"
          shadowColor="#000"
          shadowOpacity={0.1}
          shadowRadius={3}
        >
          <SentimentCircle ratio={ratio} />
        </AbsoluteVStack>
        <VStack
          shadowColor="#000"
          backgroundColor="#fff"
          shadowOpacity={0.1}
          shadowOffset={{ height: 2, width: 0 }}
          shadowRadius={7}
          borderRadius={12}
          padding={2}
          paddingHorizontal={5}
          transform={[{ skewX: '-12deg' }]}
        >
          <VStack alignItems="flex-end" transform={[{ skewX: '12deg' }]}>
            <TotalScore
              score={score}
              ratio={ratio}
              vote={vote}
              setVote={setVote}
              onClickPoints={onClickPoints}
              isMultiple={Object.keys(activeTags).length > 1}
            />
          </VStack>
        </VStack>
      </VStack>
    )
  })
)

const TotalScore = memo(
  ({
    score,
    vote,
    subtle,
    setVote,
    onClickPoints,
    isMultiple,
    size,
  }: {
    size?: 'sm' | 'md'
    ratio?: number
    score: number
    vote: -1 | 0 | 1
    setVote?: Function
    onClickPoints?: (event: GestureResponderEvent) => void
    subtle?: boolean
    isMultiple?: boolean
  }) => {
    score = Math.round(score)
    const voteButtonColor = subtle ? '#f2f2f2' : null
    const scale = size === 'sm' ? 0.75 : 1
    const sizePx = 50 * scale
    const isOpenProp =
      vote === 0
        ? null
        : {
            isOpen: false,
          }

    const upvote = (
      <VoteButton
        size={18 * scale}
        Icon={isMultiple ? ChevronsUp : ChevronUp}
        shadowDirection="up"
        voted={vote == 1}
        color={vote === 1 ? 'green' : voteButtonColor}
        onPress={(e) => {
          e.stopPropagation()
          setVote?.(vote === 1 ? 0 : 1)
        }}
      />
    )

    const downvote = (
      <VoteButton
        size={18 * scale}
        Icon={isMultiple ? ChevronsDown : ChevronDown}
        voted={vote == -1}
        color={vote === -1 ? 'red' : voteButtonColor}
        onPress={(e) => {
          e.stopPropagation()
          setVote?.(vote == -1 ? 0 : -1)
        }}
      />
    )

    const color = '#000' //ratio < 0.4 ? lightRed : ratio < 0.6 ? lightOrange : '#fff'

    return (
      <VStack
        alignItems="center"
        justifyContent="center"
        width={sizePx}
        height={sizePx}
      >
        <AbsoluteVStack top={-10}>
          {subtle ? (
            upvote
          ) : (
            <Tooltip position="right" contents="Upvote" {...isOpenProp}>
              {upvote}
            </Tooltip>
          )}
        </AbsoluteVStack>
        <Text
          fontSize={Math.min(16, sizePx / `${score}`.length) * scale * 1.075}
          fontWeight="600"
          letterSpacing={-0.5}
          color={color}
          cursor="default"
          onPress={onClickPoints}
        >
          {numberFormat(score ?? 0)}
        </Text>
        <AbsoluteVStack bottom={-10}>
          {subtle ? (
            downvote
          ) : (
            <Tooltip position="right" contents="Downvote" {...isOpenProp}>
              {downvote}
            </Tooltip>
          )}
        </AbsoluteVStack>
      </VStack>
    )
  }
)
