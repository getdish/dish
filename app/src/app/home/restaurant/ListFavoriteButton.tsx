import { graphql } from '@dish/graph'
import React from 'react'

import { FavoriteButton, FavoriteButtonProps } from '../../views/FavoriteButton'
import { ListQueryProps, useListFavorite } from '../../views/list/useList'

export const ListFavoriteButton = graphql(
  ({ list, query, ...rest }: Partial<FavoriteButtonProps> & ListQueryProps) => {
    const { isFavorited, toggleFavorite, reviewsCount } = useListFavorite({ list, query })
    return (
      <FavoriteButton
        backgroundColor="transparent"
        borderWidth={0}
        {...rest}
        isFavorite={isFavorited}
        onToggle={toggleFavorite}
      >
        {`${reviewsCount}`}
      </FavoriteButton>
    )
  }
)
