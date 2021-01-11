import { graphql } from '@dish/graph'
import React, { Suspense, memo } from 'react'

import { useUserFavoriteQuery } from '../../hooks/useUserReview'
import { FavoriteButton, FavoriteButtonProps } from '../../views/FavoriteButton'
import { SmallButton } from '../../views/SmallButton'
import { CircleButton } from './CircleButton'

export type RestaurantFavoriteButtonProps = {
  size?: FavoriteButtonProps['size']
  restaurantId: string
}

export const RestaurantFavoriteButton = (
  props: RestaurantFavoriteButtonProps
) => {
  return (
    <SmallButton
      padding={0}
      icon={
        <Suspense fallback={null}>
          <RestaurantFavoriteStar {...props} />
        </Suspense>
      }
      zIndex={10}
    />
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
