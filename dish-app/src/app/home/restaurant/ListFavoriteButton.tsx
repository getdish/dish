import { graphql } from '@dish/graph'
import React, { Suspense, memo } from 'react'

import { useUserFavoriteQuery } from '../../hooks/useUserReview'
import { FavoriteButton, FavoriteButtonProps } from '../../views/FavoriteButton'

export const ListFavoriteButton = memo(
  graphql(({ size, listId }: { size?: FavoriteButtonProps['size']; listId: string }) => {
    const { favorited, total, toggle } = useUserFavoriteQuery({
      list_id: { _eq: listId },
      type: { _eq: 'favorite' },
    })
    return (
      <Suspense fallback={null}>
        <FavoriteButton isFavorite={!!favorited} onToggle={toggle} size={size}>
          {typeof total === 'number' && total > 0 ? total : ''}
        </FavoriteButton>
      </Suspense>
    )
  })
)
