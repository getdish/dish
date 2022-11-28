import { tagLenses } from '../../../constants/localTags'
import { numberFormat } from '../../../helpers/numberFormat'
import { restaurantRatio } from '../../../helpers/restaurantsRatio'
import { RestaurantRatingView } from '../../home/RestaurantRatingView'
import { VoteNumber, useUserTagVotes } from '../../hooks/useUserTagVotes'
import { TextSuperScript } from '../TextSuperScript'
import { VoteButton } from '../VoteButton'
import { graphql, restaurant, tagSlug } from '@dish/graph'
import { Text, TooltipSimple, XStack, YStack, useTheme } from '@dish/ui'
import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp } from '@tamagui/lucide-icons'
import React, { Suspense, memo } from 'react'
import { GestureResponderEvent } from 'react-native'

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

    if (!restaurant) {
      return null
    }

    ratio = ratio ?? restaurantRatio(restaurant)
    score =
      display === 'ratio'
        ? Math.round(ratio * 100)
        : score ?? Math.round(restaurant.score) + vote

    return (
      <YStack pointerEvents="auto" position="relative">
        {/* <YStack
          position="absolute"
          bottom={-15}
          right={-30}
          zIndex={2}
          borderRadius={1000}
          backgroundColor="$background"
          shadowColor="#000"
          shadowOpacity={0.1}
          shadowRadius={3}
        >
          <RestaurantRatingView restaurant={restaurant} floating size={36} />
        </YStack> */}
        <RatingWithVotes
          score={score || 0}
          ratio={ratio}
          vote={vote}
          setVote={setVote}
          onClickPoints={onClickPoints}
          isMultiple={tagSlug ? tagSlug.length > 1 : false}
          display={display}
        />
      </YStack>
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

    const getUpvote = (props) => (
      <VoteButton
        {...props}
        size={20 * scale}
        Icon={isMultiple ? ChevronsUp : ChevronUp}
        voted={vote == 1}
        color={vote === 1 ? 'green' : voteButtonColor}
        onPress={(e) => {
          e.stopPropagation()
          setVote?.(vote === 1 ? 0 : 1)
        }}
      />
    )

    const getDownvote = (props) => (
      <VoteButton
        {...props}
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
      <YStack
        alignItems="center"
        justifyContent="center"
        width={sizePx}
        height={sizePx}
        backgroundColor="$background"
        elevation="$1"
        borderRadius={100}
      >
        <YStack position="absolute" top={-34}>
          {subtle ? (
            getUpvote({})
          ) : (
            <TooltipSimple placement="right" label="Upvote" {...isOpenProp}>
              {getUpvote({})}
            </TooltipSimple>
          )}
        </YStack>
        <XStack position="relative" zIndex={10}>
          <Text
            theme="alt2"
            fontSize={fontSize}
            fontWeight="600"
            letterSpacing={-0.5}
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
        </XStack>
        <YStack position="absolute" bottom={-34}>
          {subtle ? (
            getDownvote({})
          ) : (
            <TooltipSimple placement="right" label="Downvote" {...isOpenProp}>
              {getDownvote({})}
            </TooltipSimple>
          )}
        </YStack>
      </YStack>
    )
  }
)
