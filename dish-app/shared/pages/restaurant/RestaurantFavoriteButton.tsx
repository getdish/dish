import { graphql } from '@dish/graph'
import React, { memo } from 'react'

import { useUserFavoriteQuery } from '../../hooks/useUserReview'
import { FavoriteButton, FavoriteButtonProps } from '../../views/FavoriteButton'

export type RestaurantFavoriteButtonProps = {
  size?: FavoriteButtonProps['size']
  restaurantId: string
}

export const RestaurantFavoriteButton = memo(
  graphql(function RestaurantFavoriteButton({
    size,
    restaurantId,
  }: RestaurantFavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useUserFavoriteQuery(restaurantId)
    return (
      <FavoriteButton
        isFavorite={!!isFavorite}
        onChange={setIsFavorite}
        size={size}
      />
    )
  })
)
