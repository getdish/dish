import { graphql } from '@dish/graph'
import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp } from '@dish/react-feather'
import React, { Suspense, memo } from 'react'
import { GestureResponderEvent } from 'react-native'
import { AbsoluteVStack, HStack, Text, Tooltip, VStack, useTheme } from 'snackui'

import { tagLenses } from '../../../constants/localTags'
import { numberFormat } from '../../../helpers/numberFormat'
import { restaurantRatio } from '../../../helpers/restaurantsRatio'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { RestaurantRatingView } from '../../home/RestaurantRatingView'
import { useUserTagVotes } from '../../hooks/useUserTagVotes'
import { TextSuperScript } from '../TextSuperScript'
import { VoteButton } from '../VoteButton'

type RatingDisplay = 'ratio' | 'points'

type UpvoteDownvoteProps = {
  restaurantSlug: string
  activeTagSlugs?: string[]
  onClickPoints?: (event: GestureResponderEvent) => void
  // only to override
  score?: number
  ratio?: number
  display?: RatingDisplay
  rounded?: boolean
}

export const RestaurantUpVoteDownVote = (props: UpvoteDownvoteProps) => {
  const activeTags = props.activeTagSlugs ?? [tagLenses[0].slug]
  const key = JSON.stringify(activeTags)
  return (
    <Suspense fallback={null}>
      <RestaurantUpVoteDownVoteContents key={key} {...props} activeTagSlugs={activeTags} />
    </Suspense>
  )
}

const RestaurantUpVoteDownVoteContents = graphql(
  ({
    restaurantSlug,
    onClickPoints,
    activeTagSlugs,
    rounded,
    score,
    ratio,
    display,
  }: UpvoteDownvoteProps) => {
    const [restaurant] = queryRestaurant(restaurantSlug)
    const restaurantTagSlugs = (activeTagSlugs ?? []).reduce(
      (acc, cur) => ({ ...acc, [cur]: true }),
      {}
    )
    const { vote, setVote } = useUserTagVotes(restaurantSlug, restaurantTagSlugs)
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
          bottom={-20}
          right={-30}
          zIndex={2}
          borderRadius={1000}
          backgroundColor={theme.cardBackgroundColor}
          shadowColor="#000"
          shadowOpacity={0.1}
          shadowRadius={3}
        >
          {/* FLOWER */}
          <RestaurantRatingView slug={restaurantSlug} floating size={42} />
        </AbsoluteVStack>
        <VStack
          shadowColor="#000"
          backgroundColor={theme.cardBackgroundColor}
          shadowOpacity={0.1}
          shadowOffset={{ height: 2, width: 0 }}
          shadowRadius={7}
          borderRadius={rounded ? 100 : 12}
          padding={2}
          paddingHorizontal={5}
          skewX="-12deg"
        >
          <RatingWithVotes
            score={score}
            ratio={ratio}
            vote={vote}
            setVote={setVote}
            onClickPoints={onClickPoints}
            isMultiple={activeTagSlugs ? activeTagSlugs.length > 1 : false}
            display={display}
          />
        </VStack>
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
    vote: -1 | 0 | 1
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

    const fontSize = Math.min(16, sizePx / `${score}`.length) * scale * 1.075

    return (
      <VStack
        skewX="12deg"
        alignItems="center"
        justifyContent="center"
        width={sizePx}
        height={sizePx}
      >
        <AbsoluteVStack top={-18}>
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
            color={theme.color}
            cursor="default"
            onPress={onClickPoints}
          >
            {numberFormat(score ?? 0)}
          </Text>
          {display === 'ratio' && (
            <TextSuperScript marginRight={-fontSize * 0.4} fontSize={fontSize * 0.6}>
              %
            </TextSuperScript>
          )}
        </HStack>
        <AbsoluteVStack bottom={-18}>
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
