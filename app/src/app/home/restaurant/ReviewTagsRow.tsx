import { graphql, order_by, query, resolved, useRefetch } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Search, Tag, X } from '@dish/react-feather'
import { sortBy, uniqBy } from 'lodash'
import React, { useEffect, useState } from 'react'
import { AbsoluteHStack, HStack, Input, useDebounce } from 'snackui'

import { tagLenses } from '../../../constants/localTags'
import { fuzzySearch } from '../../../helpers/fuzzySearch'
import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { useAsyncEffect } from '../../hooks/useAsync'
import { useUserStore } from '../../userStore'
import { SmallButton } from '../../views/SmallButton'
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
  ({
    review,
    list,
    restaurantSlug,
    listTheme,
    label = 'Tags:',
    wrapTagsRow,
    ...props
  }: RestaurantReviewProps & {
    label?: string
  }) => {
    const [search, setSearch] = useState('')
    const setSearchDbc = useDebounce(setSearch, 350)
    const [isFocused, setIsFocused] = useState(false)
    const [filtered, setFiltered] = useState<TagButtonProps[]>([])
    const [refetchKey, setRefetchKey] = useState('')
    const refetch = useRefetch()
    const user = useUserStore().user
    const isOwnList = review?.user_id === user?.id
    const showTagButton = isOwnList

    // const userTags = query.review({
    //   where: {
    //     tag_id: {
    //       _neq: null,
    //     },
    //     user_id: {
    //       _eq: review?.user_id,
    //     },
    //     rating: {
    //       _neq: null,
    //     },
    //   },
    //   limit: 5,
    //   order_by: [{ tag: { type: order_by.desc } }, { tag: { id: order_by.desc } }],
    // })

    const userTags =
      review?.reviews({
        limit: 5,
        where: {},
        order_by: [{ tag: { id: order_by.desc } }],
      }) ??
      (restaurantSlug
        ? list?.user?.reviews({
            where: {
              tag_id: {
                _neq: null,
              },
              rating: {
                _neq: null,
              },
              restaurant: {
                slug: {
                  _eq: restaurantSlug,
                },
              },
            },
          })
        : null) ??
      []
    // review?.reviews({
    //     limit: 20,
    //     // where: {
    //     //   user_id: {
    //     //     _eq: userId,
    //     //   },
    //     // },
    //   }) || []

    useEffect(() => {
      refetch(userTags)
      setRefetchKey(`${Math.random()}`)
    }, [isFocused])

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

    const rawTags = isFocused
      ? [
          ...tagLenses,
          ...userTags,
          //
          ...((!!restaurant &&
            getRestaurantDishes({
              restaurant,
              max: 10,
              tagSlugs: [''],
            })) ||
            []),
        ]
      : userTags

    let tags = filtered.length ? filtered : rawTags.filter(isPresent).map(getTagButtonProps)
    tags = uniqBy(tags, (x) => x.name || x.slug)
    tags = sortBy(tags, (x) => (x.type === 'lense' ? -1 : 0))

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

    return (
      <HStack
        paddingRight={20}
        width="100%"
        alignItems="center"
        pointerEvents="auto"
        zIndex={1000}
        {...props}
      >
        <HStack
          position="relative"
          pointerEvents="auto"
          alignItems="center"
          flexShrink={0}
          zIndex={-1}
        >
          <AbsoluteHStack
            top={0}
            bottom={0}
            alignItems="center"
            left={-15}
            opacity={isFocused ? 1 : 0}
          >
            <Search size={16} color="#777" />
          </AbsoluteHStack>
          <AbsoluteHStack
            onPress={() => setIsFocused(false)}
            bottom={-10}
            left={-15}
            opacity={isFocused ? 1 : 0}
          >
            <X size={16} color="#777" />
          </AbsoluteHStack>

          {showTagButton && !isFocused && (
            <SmallButton
              onPress={() => setIsFocused(true)}
              icon={<Tag opacity={0.5} size={16} color="#888" />}
            ></SmallButton>
          )}

          {isFocused && (
            <Input
              placeholder="Dishes, tags:"
              autoFocus
              opacity={isFocused ? 1 : 0}
              zIndex={10}
              onFocus={() => setIsFocused(true)}
              color="#777"
              fontSize={13}
              width={isFocused ? 130 : 50}
              borderColor="transparent"
              onChangeText={(text) => setSearchDbc(text)}
            />
          )}
        </HStack>
        <HStack
          alignItems="center"
          paddingVertical={16}
          spacing="sm"
          {...(wrapTagsRow && {
            flexWrap: 'wrap',
            flex: 1,
          })}
        >
          {tags.map((tbp, i) => {
            const isLense = tbp.type === 'lense'
            const lastItem = tags[i - 1]
            return (
              <TagButton
                noLink
                size="sm"
                restaurantSlug={restaurantSlug}
                key={tbp.slug || 0}
                refetchKey={refetchKey}
                {...tbp}
                backgroundColor="transparent"
                {...(isLense && {
                  name: '',
                  marginRight: -4,
                  tooltip: tbp.name,
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
