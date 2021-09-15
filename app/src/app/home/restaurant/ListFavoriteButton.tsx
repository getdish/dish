import { graphql } from '@dish/graph'
import React from 'react'

import { FavoriteButton, FavoriteButtonProps } from '../../views/FavoriteButton'
import { useListFavorite } from '../../views/list/useList'

// omg why is there two diff versinos of this
export const ListFavoriteButton = graphql(
  ({ slug, ...rest }: Partial<FavoriteButtonProps> & { slug: string }) => {
    const { isFavorited, toggleFavorite, reviewsCount } = useListFavorite({
      slug,
    })
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

// export const ListFavoriteButton = memo(
//   graphql(({ size, listId }: { size?: FavoriteButtonProps['size']; listId: string }) => {
//     const { favorited, total, toggle } = useUserFavoriteQuery({
//       list_id: { _eq: listId },
//       type: { _eq: 'favorite' },
//     })
//     return (
//       <Suspense fallback={null}>
//         <FavoriteButton isFavorite={!!favorited} onToggle={toggle} size={size}>
//           {typeof total === 'number' && total > 0 ? total : ''}
//         </FavoriteButton>
//       </Suspense>
//     )
//   })
// )
