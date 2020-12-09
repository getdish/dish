import { graphql } from '@dish/graph'
import { ChevronDown, ChevronUp } from '@dish/react-feather'
import React, { Suspense, memo, useState } from 'react'
import { GestureResponderEvent } from 'react-native'
import {
  AbsoluteVStack,
  StackProps,
  Text,
  Tooltip,
  VStack,
  prevent,
} from 'snackui'

import { bgLight, blue, green, orange, red } from '../../colors'
import { numberFormat } from '../../helpers/numberFormat'
import { useIsNarrow } from '../../hooks/useIs'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useUserTagVotes } from '../../hooks/useUserTagVotes'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { tagLenses } from '../../state/localTags'
import { restaurantRatio } from './restaurantsRatio'
import { SentimentCircle } from './SentimentCircle'

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
      <VStack position="relative">
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
        <VStack transform={[{ skewX: '-12deg' }]}>
          <VStack
            shadowColor="#000"
            backgroundColor="#fff"
            shadowOpacity={0.1}
            shadowOffset={{ height: 2, width: 0 }}
            shadowRadius={7}
            borderRadius={12}
            overflow="hidden"
            padding={2}
            paddingHorizontal={5}
          >
            <VStack alignItems="flex-end" transform={[{ skewX: '12deg' }]}>
              <TotalScore
                score={score}
                ratio={ratio}
                vote={vote}
                setVote={setVote}
                onClickPoints={onClickPoints}
              />
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    )
  })
)

export const TotalScore = memo(
  ({
    score,
    vote,
    subtle,
    setVote,
    onClickPoints,
    size,
    ...props
  }: {
    size?: 'sm' | 'md'
    ratio?: number
    score: number
    vote: -1 | 0 | 1
    setVote?: Function
    onClickPoints?: (event: GestureResponderEvent) => void
    subtle?: boolean
  } & StackProps) => {
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
        Icon={ChevronUp}
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
        Icon={ChevronDown}
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
        pointerEvents="auto"
        alignItems="center"
        justifyContent="center"
        width={sizePx}
        height={sizePx}
        {...props}
      >
        {subtle ? (
          upvote
        ) : (
          <Tooltip position="right" contents="Upvote" {...isOpenProp}>
            {upvote}
          </Tooltip>
        )}
        <Text
          fontSize={Math.min(16, sizePx / `${score}`.length) * scale * 1.075}
          fontWeight="600"
          marginVertical={2 * scale}
          letterSpacing={-0.5}
          color={color}
          cursor="default"
          onPress={onClickPoints}
        >
          {numberFormat(score ?? 0)}
        </Text>
        {subtle ? (
          downvote
        ) : (
          <Tooltip position="right" contents="Downvote" {...isOpenProp}>
            {downvote}
          </Tooltip>
        )}
      </VStack>
    )
  }
)

export const VoteButton = ({
  color,
  Icon,
  size = 18,
  voted,
  hoverColor,
  ...props
}: StackProps & {
  hoverColor?: string
  voted?: boolean
  Icon: any
  color?: string | null
  size?: number
}) => {
  const isSmall = useIsNarrow()
  const scale = isSmall ? 1.1 : 1
  const [hovered, setHovered] = useState(false)
  return (
    <VStack
      width={22 * scale}
      height={22 * scale}
      borderRadius={100}
      alignItems="center"
      justifyContent="center"
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={prevent}
      pressStyle={{
        backgroundColor: bgLight,
        borderColor: '#aaa',
      }}
      {...props}
    >
      <Icon
        size={size * (voted ? 1.2 : 1)}
        color={hovered ? hoverColor ?? '#000' : color ?? '#ccc'}
      />
    </VStack>
  )
}
