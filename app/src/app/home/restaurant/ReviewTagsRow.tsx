import { ZeroUUID, graphql, order_by, query, resolved, useRefetch } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Search, Tag, X } from '@dish/react-feather'
import { sortBy, uniqBy } from 'lodash'
import React, { memo, useState } from 'react'
import { HStack, Input, useDebounce, useLazyEffect } from 'snackui'

import { tagLenses } from '../../../constants/localTags'
import { fuzzySearch } from '../../../helpers/fuzzySearch'
import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { useAsyncEffect } from '../../hooks/useAsync'
import { useUserStore } from '../../userStore'
import { SmallButton } from '../../views/SmallButton'
import { TagButton, TagButtonProps, getTagButtonProps } from '../../views/TagButton'
import { RestaurantReviewProps } from './RestaurantReview'

// add votable prop

export const ReviewTagsRow = memo(
  graphql(
    ({
      review,
      list,
      restaurantSlug,
      listTheme,
      label = 'Tags:',
      votable = true,
      hideGeneralTags,
      onFocusChange,
      wrapTagsRow,
      ...props
    }: RestaurantReviewProps & {
      label?: string
      hideGeneralTags?: boolean
      onFocusChange?: (next: boolean) => any
    }) => {
      const [search, setSearch] = useState('')
      const setSearchDbc = useDebounce(setSearch, 350)
      const [isFocused, setIsFocused] = useState(false)
      const [filtered, setFiltered] = useState<TagButtonProps[]>([])
      const refetch = useRefetch()
      const user = useUserStore().user
      const isOwnList = user
        ? review
          ? review.user_id && review.user_id === user.id
          : list
          ? list.user_id === user.id
          : null
        : null
      const showTagButton = isOwnList || !review

      useLazyEffect(() => {
        if (!isFocused) {
          try {
            refetch(userTags)
          } catch (err) {
            console.log('ok', err)
            // ok
          }
        }

        onFocusChange?.(isFocused)
      }, [isFocused])
      // setRefetchKey(`${Math.random()}`)

      const reviewUserTags = review?.reviews({
        limit: 50,
        where: {
          _and: [
            {
              tag_id: {
                _neq: ZeroUUID,
              },
            },
            {
              tag_id: {
                _is_null: false,
              },
            },
            {
              type: {
                _eq: 'vote',
              },
            },
          ],
        },
        order_by: [{ updated_at: order_by.desc }],
      })

      const restaurantSlugUserTags = restaurantSlug
        ? list?.user?.reviews({
            limit: 50,
            order_by: [{ updated_at: order_by.desc }],
            where: {
              _and: [
                {
                  tag_id: {
                    _neq: ZeroUUID,
                  },
                },
                {
                  tag_id: {
                    _is_null: false,
                  },
                },
                {
                  type: {
                    _eq: 'vote',
                  },
                },
                {
                  restaurant: {
                    slug: {
                      _eq: restaurantSlug,
                    },
                  },
                },
              ],
            },
          })
        : null

      const userTags = reviewUserTags || restaurantSlugUserTags || []

      // review?.reviews({
      //     limit: 20,
      //     // where: {
      //     //   user_id: {
      //     //     _eq: userId,
      //     //   },
      //     // },
      //   }) || []

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

      const rawTags =
        isFocused || (!review && !hideGeneralTags)
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

      let tags = filtered.length
        ? filtered
        : rawTags
            .filter(isPresent)
            .map(getTagButtonProps)
            .filter((x) => {
              if (x.slug === 'global__global') return false
              if (!x.name) return false
              return true
            })
      tags = uniqBy(tags, (x) => x.name || x.slug)
      tags = sortBy(tags, (x) => {
        const rating = x?.rating || x?.vote || 0
        return x.type === 'lense'
          ? x.slug === 'lenses__gems'
            ? 'a0'
            : `a${1 / rating}`
          : `b${1 / rating}`
      })

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

      if (hideGeneralTags && !isOwnList && !tags.length) {
        return null
      }

      return (
        <HStack flex={1} alignItems="center" pointerEvents="auto" zIndex={1000} {...props}>
          <HStack
            alignItems="center"
            spacing="sm"
            paddingRight={10}
            {...(wrapTagsRow && {
              flexWrap: 'wrap',
              marginBottom: -3,
              flex: 1,
              overflow: 'hidden',
            })}
          >
            {isFocused && (
              <>
                <HStack onPress={() => setIsFocused(false)} opacity={isFocused ? 1 : 0}>
                  <X size={16} color="#777" />
                </HStack>

                <HStack
                  marginRight={-10}
                  marginLeft={10}
                  alignItems="center"
                  opacity={isFocused ? 0.5 : 0}
                >
                  <Search size={16} color="#777" />
                </HStack>
              </>
            )}

            {showTagButton && !isFocused && (
              <SmallButton
                onPress={() => setIsFocused(true)}
                icon={<Tag opacity={0.5} size={16} color="#888" />}
                marginRight={15}
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

            {tags.map((tbp, i) => {
              const isLense = tbp.type === 'lense'
              const lastItem = tags[i - 1]
              return (
                <TagButton
                  fadeLowlyVoted
                  noLink
                  size="sm"
                  restaurant={restaurant}
                  hideRank
                  key={tbp.slug || 0}
                  // refetchKey={refetchKey}
                  {...tbp}
                  // backgroundColor="transparent"
                  {...(isLense && {
                    name: '',
                    marginRight: -4,
                    tooltip: tbp.name,
                    circular: true,
                  })}
                  {...(tbp.slug === 'lenses__gems' && {
                    name: 'Overall',
                    icon: '',
                    circular: false,
                  })}
                  {...(!isLense && {
                    backgroundColor: 'transparent',
                  })}
                  {...(lastItem?.type === 'lense' &&
                    !isLense && {
                      marginLeft: 20,
                    })}
                  {...(wrapTagsRow && {
                    marginBottom: 3,
                  })}
                  votable={votable}
                />
              )
            })}
          </HStack>
        </HStack>
      )
    },
    { suspense: false }
  )
)

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
