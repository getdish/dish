import { graphql } from '@dish/graph'
import React from 'react'

import { FavoriteButton, FavoriteButtonProps } from '../../views/FavoriteButton'
import { ListQueryProps, useListFavorite } from '../../views/list/useList'

export const ListFavoriteButton = graphql(
  ({ list, listQuery, ...rest }: Partial<FavoriteButtonProps> & ListQueryProps) => {
    const { isFavorited, toggleFavorite, reviewsCount } = useListFavorite({ list, listQuery })
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
