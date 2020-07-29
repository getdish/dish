import React from 'react'

import { FavoriteButton, FavoriteButtonProps } from './FavoriteButton'
import { useUserTagVotes, useUserUpvoteDownvote } from './useUserReview'

export const DishFavoriteButton = ({
  size,
  restaurantId,
  dishTagId,
}: {
  size?: FavoriteButtonProps['size']
  restaurantId: string
  dishTagId: string
}) => {
  const [vote, setVote] = useUserUpvoteDownvote(restaurantId, {
    [dishTagId]: true,
  })
  console.log('vote', vote, dishTagId)
  return (
    <FavoriteButton
      isFavorite={!!vote}
      onChange={(vote) => setVote(vote ? 1 : 0)}
      size={size}
    />
  )
}
