import { graphql, query, resolved } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Search } from '@dish/react-feather'
import { uniqBy } from 'lodash'
import React, { useState } from 'react'
import { HStack, Input, useDebounce } from 'snackui'

import { red } from '../../../constants/colors'
import { tagCategoriesPopular, tagLenses } from '../../../constants/localTags'
import { fuzzySearch } from '../../../helpers/fuzzySearch'
import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { useAsyncEffect } from '../../hooks/useAsync'
import { useUserStore } from '../../userStore'
import { TagButton, TagButtonProps, getTagButtonProps } from '../../views/TagButton'
import { RestaurantReviewProps } from './RestaurantReview'

// // most flexible way we can pass in reviews
// type RestaurantReviewsProps = {
//   restaurantSlug: string
//   username: string
// }
// export const useRestaurantReviews = () => {
// }
// export const useUserCommentReviewQuery = (user: user, restaurantSlug: string) => {
//   return (
//     user?.reviews({
//       where: {
//         restaurant: {
//           slug: {
//             _eq: restaurantSlug,
//           },
//         },
//         text: {
//           _neq: null,
//         },
//       },
//       limit: 1,
//     }) || []
//   )
// }
// export const useUserPlaylistCommentReviewQuery = (
//   restaurantSlug: string,
//   listSlug?: string
// ) => {
//   return listSlug
//     ?  || []
//     : []
// }
// export const PlaylistRestaurantReview = graphql((props: RestaurantReviewProps & {
//   list?: list
// }) => {
//   props[0]
//   const [user] = useCurrentUserQuery()
//   const [playlistReview] = useUserPlaylistCommentReviewQuery(user, )
//   return null
// })
// const [overallReview] = useUserCommentReviewQuery()
// const [playlistReview] = useUserPlaylistCommentReviewQuery()
// export const RestaurantReview = suspense(
//   memo(
//     graphql((props: RestaurantReviewProps) => {
//       const { refetchKey, user, restaurantSlug, listSlug, review } = props
//       if (review) {
//         return <RestaurantReviewContent {...props} review={review} />
//       }
//       const reviews = [playlistReview, overallReview]
//       useLazyEffect(() => {
//         if (refetchKey) {
//           console.log('refetching review', refetchKey)
//           reviews.map(refetch)
//         }
//       }, [refetchKey])
//       return (
//         <>
//           {props.isEditing || (!overallReview && !playlistReview) ? (
//             <RestaurantReviewContentEdit {...props} />
//           ) : (
//             <>
//               {!!overallReview && !playlistReview && (
//                 <RestaurantReviewContent {...props} review={overallReview} />
//               )}
//               {!!playlistReview && <RestaurantReviewContent {...props} review={playlistReview} />}
//             </>
//           )}
//         </>
//       )
//     }),
//     {
//       suspense: false,
//     }
//   ),
//   <LoadingItem />
// )

export const ReviewTagsRow = graphql(
  ({ review, restaurantSlug, ...props }: RestaurantReviewProps) => {
    const [search, setSearch] = useState('')
    const setSearchDbc = useDebounce(setSearch, 350)
    const [isFocused, setIsFocused] = useState(false)
    const userId = useUserStore().user?.id || ''
    const [filtered, setFiltered] = useState<TagButtonProps[]>([])

    const userTags = userId
      ? review?.reviews({
          limit: 10,
          where: {
            user_id: {
              _eq: userId,
            },
          },
        }) || []
      : []

    // console.log('userTags', userTags?.[0]?.tag?.name)

    // const userTags = userId
    //   ? query.review({
    //       limit: 100,
    //       where: {
    //         user_id: {
    //           _eq: userId,
    //         },
    //         ...(listSlug && {
    //           list: {
    //             slug: {
    //               _eq: listSlug,
    //             },
    //           },
    //         }),
    //         restaurant: {
    //           slug: {
    //             _eq: restaurantSlug,
    //           },
    //         },
    //       },
    //     })
    //   : []

    const [restaurant] = restaurantSlug ? queryRestaurant(restaurantSlug) : []

    let allTags = [
      ...tagLenses,
      ...userTags.map((x) => x.tag),
      //
      ...((!!restaurant &&
        getRestaurantDishes({
          restaurant,
          max: 10,
          tagSlugs: [''],
        })) ||
        []),
    ]

    if (allTags.length < 5) {
      allTags = [...allTags]
    }

    const tags = uniqBy(allTags, (x) => x?.slug)
      .filter(isPresent)
      .map(getTagButtonProps)
    const tagsKey = tags.map((x) => x.slug).join('')

    useAsyncEffect(
      async (mounted) => {
        if (!search) {
          setFiltered([])
          return
        }
        const foundTagsWithNames = await resolved(() =>
          query
            .tag({
              where: {
                name: {
                  _ilike: `${search}%`,
                },
              },
              limit: 15,
            })
            .map(getTagButtonProps)
        )
        if (!mounted()) return
        const filtered = await fuzzySearch({
          items: [...tags, ...foundTagsWithNames],
          query: search,
          keys: ['name'],
        })
        setFiltered(filtered)
      },
      [search, tagsKey]
    )

    const currentTags = filtered.length ? filtered : tags

    return (
      <HStack
        marginVertical={-6}
        width="100%"
        alignItems="center"
        pointerEvents="auto"
        zIndex={1000}
      >
        <HStack pointerEvents="auto" alignItems="center" flexShrink={0} zIndex={-1}>
          <Search size={16} color="#777" />
          <Input
            marginLeft={-5}
            marginRight={-3}
            zIndex={10}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            color="#777"
            placeholder="Tags:"
            width={isFocused ? 110 : 70}
            borderColor="transparent"
            onChangeText={(text) => setSearchDbc(text)}
          />
        </HStack>
        <HStack paddingVertical={16} spacing="sm">
          {currentTags.map((tagButtonProps, i) => {
            const isLense = tagButtonProps.type === 'lense'
            const lastItem = currentTags[i - 1]
            return (
              <TagButton
                noLink
                restaurantSlug={restaurantSlug}
                key={tagButtonProps.slug || 0}
                {...tagButtonProps}
                {...(isLense && {
                  name: '',
                  tooltip: tagButtonProps.name,
                  circular: true,
                })}
                {...(!isLense && {
                  backgroundColor: 'transparent',
                })}
                {...(lastItem?.type === 'lense' &&
                  !isLense && {
                    marginLeft: 20,
                  })}
                votable
              />
            )
          })}
        </HStack>
      </HStack>
    )
  },
  { suspense: false }
)
