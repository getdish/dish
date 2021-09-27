import { graphql, restaurant, tagSlug } from '@dish/graph'
import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp } from '@dish/react-feather'
import React, { Suspense, memo } from 'react'
import { GestureResponderEvent } from 'react-native'
import { AbsoluteVStack, HStack, Text, Tooltip, VStack, useTheme } from 'snackui'

import { tagLenses } from '../../../constants/localTags'
import { numberFormat } from '../../../helpers/numberFormat'
import { restaurantRatio } from '../../../helpers/restaurantsRatio'
import { RestaurantRatingView } from '../../home/RestaurantRatingView'
import { VoteNumber, useUserTagVotes } from '../../hooks/useUserTagVotes'
import { TextSuperScript } from '../TextSuperScript'
import { VoteButton } from '../VoteButton'

type RatingDisplay = 'ratio' | 'points'

type UpvoteDownvoteProps = {
  restaurant?: restaurant | null
  activeTags?: string[]
  onClickPoints?: (event: GestureResponderEvent) => void
  // only to override
  score?: number
  ratio?: number
  display?: RatingDisplay
  rounded?: boolean
}

export const RestaurantUpVoteDownVote = (props: UpvoteDownvoteProps) => {
  const activeTags = props.activeTags ?? [tagLenses[0].slug]
  const key = JSON.stringify(activeTags)
  return (
    <Suspense fallback={null}>
      <RestaurantUpVoteDownVoteContents key={key} {...props} activeTags={activeTags} />
    </Suspense>
  )
}

const RestaurantUpVoteDownVoteContents = graphql(
  ({
    restaurant,
    onClickPoints,
    activeTags = [],
    rounded,
    score,
    ratio,
    display,
  }: UpvoteDownvoteProps) => {
    const { vote, setVote } = useUserTagVotes({
      activeTags,
      restaurant,
    })
    const theme = useTheme()

    if (!restaurant) {
      return null
    }

    ratio = ratio ?? restaurantRatio(restaurant)
    score =
      display === 'ratio' ? Math.round(ratio * 100) : score ?? Math.round(restaurant.score) + vote

    return (
      <VStack pointerEvents="auto" position="relative">
        <AbsoluteVStack
          bottom={-15}
          right={-30}
          zIndex={2}
          borderRadius={1000}
          backgroundColor={theme.cardBackgroundColor}
          shadowColor="#000"
          shadowOpacity={0.1}
          shadowRadius={3}
        >
          <RestaurantRatingView restaurant={restaurant} floating size={36} />
        </AbsoluteVStack>
        <RatingWithVotes
          score={score || 0}
          ratio={ratio}
          vote={vote}
          setVote={setVote}
          onClickPoints={onClickPoints}
          isMultiple={tagSlug ? tagSlug.length > 1 : false}
          display={display}
        />
      </VStack>
    )
  }
)

const RatingWithVotes = memo(
  ({
    score,
    vote,
    subtle,
    setVote,
    onClickPoints,
    isMultiple,
    size,
    display,
  }: {
    size?: 'sm' | 'md'
    ratio?: number
    score: number
    vote: VoteNumber
    setVote?: Function
    onClickPoints?: (event: GestureResponderEvent) => void
    subtle?: boolean
    isMultiple?: boolean
    display?: RatingDisplay
  }) => {
    const theme = useTheme()
    const voteButtonColor = subtle ? theme.color : null
    const scale = size === 'sm' ? 0.75 : 1
    const sizePx = 46 * scale
    const isOpenProp =
      vote === 0
        ? null
        : {
            isOpen: false,
          }

    const upvote = (
      <VoteButton
        size={20 * scale}
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
        size={20 * scale}
        Icon={isMultiple ? ChevronsDown : ChevronDown}
        voted={vote == -1}
        color={vote === -1 ? 'red' : voteButtonColor}
        onPress={(e) => {
          e.stopPropagation()
          setVote?.(vote == -1 ? 0 : -1)
        }}
      />
    )

    const len = `${score}`.length
    const fontSize = (len === 1 ? 16 : len === 2 ? 15 : len === 3 ? 13 : 12) * scale

    return (
      <VStack
        alignItems="center"
        justifyContent="center"
        width={sizePx}
        height={sizePx}
        backgroundColor={theme.cardBackgroundColor}
        elevation={1}
        borderRadius={100}
      >
        <AbsoluteVStack top={-34}>
          {subtle ? (
            upvote
          ) : (
            <Tooltip position="right" contents="Upvote" {...isOpenProp}>
              {upvote}
            </Tooltip>
          )}
        </AbsoluteVStack>
        <HStack position="relative" zIndex={10}>
          <Text
            fontSize={fontSize}
            fontWeight="600"
            letterSpacing={-0.5}
            color={theme.colorTertiary}
            cursor="default"
            onPress={onClickPoints}
          >
            {numberFormat(score ?? 0, 'sm')}
          </Text>
          {display === 'ratio' && (
            <TextSuperScript marginRight={-fontSize * 0.4} fontSize={fontSize * 0.6}>
              %
            </TextSuperScript>
          )}
        </HStack>
        <AbsoluteVStack bottom={-34}>
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
