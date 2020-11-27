import { graphql } from '@dish/graph'
import React, { Suspense, memo } from 'react'

import { useUserFavoriteQuery } from '../../hooks/useUserReview'
import { FavoriteButton, FavoriteButtonProps } from '../../views/FavoriteButton'
import { CircleButton } from './RestaurantCard'

export type RestaurantFavoriteButtonProps = {
  size?: FavoriteButtonProps['size']
  restaurantId: string
}

export const RestaurantFavoriteButton = (
  props: RestaurantFavoriteButtonProps
) => {
  return (
    <CircleButton zIndex={10} alignSelf="center">
      <Suspense fallback={null}>
        <RestaurantFavoriteStar {...props} />
      </Suspense>
    </CircleButton>
  )
}

export const RestaurantFavoriteStar = memo(
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
