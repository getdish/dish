import { graphql, slugify } from '@dish/graph'
import { isPresent } from '@dish/helpers/src'
import React from 'react'
import { Circle, HStack, Text, VStack } from 'snackui'

import {
  extraLightGreen,
  extraLightRed,
  green,
  lightGreen,
  lightRed,
  red,
} from '../../../constants/colors'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { useUserTagVotes } from '../../hooks/useUserTagVotes'
import { UpvoteDownvoteScore } from '../UpvoteDownvoteScore'

type Props = {
  size: 'sm' | 'md'
  name: string
  slug: string
  score?: number
  upvotes?: number
  downvotes?: number
  subtle?: boolean
  restaurantSlug?: string
  restaurantId?: string
}

export const DishUpvoteDownvote = (props: Props) => {
  if (!props.restaurantId || !props.restaurantSlug) {
    return null
  }
  return (
    <DishUpvoteDownvoteContent
      subtle={false}
      score={0}
      key={slugify(props.name) + props.restaurantSlug}
      {...props}
      restaurantId={props.restaurantId}
      restaurantSlug={props.restaurantSlug}
    />
  )
}

const DishUpvoteDownvoteContent = graphql(function DishUpvoteDownvote({
  size,
  subtle,
  upvotes,
  downvotes,
  score,
  restaurantSlug,
  slug,
}: Props) {
  const intScore =
    score ??
    (restaurantSlug
      ? queryRestaurant(restaurantSlug)[0].tags({
          limit: 1,
          where: {
            tag: {
              slug: {
                _eq: slug,
              },
            },
          },
        })[0]?.score ?? 0
      : 0)

  const { vote, setVote } = useUserTagVotes(restaurantSlug || '', {
    [slug]: true,
  })

  if (isPresent(upvotes ?? downvotes)) {
    return (
      <VStack position="relative">
        <SkewRating positive>{upvotes}</SkewRating>
        <SkewRating>{downvotes}</SkewRating>
      </VStack>
    )
  }

  return (
    <UpvoteDownvoteScore
      showVoteOnHover
      subtle={subtle}
      size={size}
      score={intScore + vote}
      vote={vote}
      setVote={setVote}
    />
  )
})

function SkewRating({
  positive,
  children,
}: {
  positive?: boolean
  children: any
}) {
  return (
    <HStack
      width={32}
      minHeight={24}
      borderRadius={10}
      alignItems="center"
      justifyContent="center"
      transform={[{ skewX: '-12deg' }]}
      backgroundColor={positive ? green : red}
      shadowColor="#000"
      shadowOffset={{ height: 2, width: 0 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      borderWidth={1}
      borderColor={positive ? lightGreen : lightRed}
    >
      <Text
        transform={[{ skewX: '12deg' }]}
        color={positive ? extraLightGreen : extraLightRed}
        fontSize={14}
        letterSpacing={-1}
        fontWeight="800"
      >
        {children}
      </Text>
    </HStack>
  )
}
