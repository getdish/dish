import { graphql } from '@dish/graph'
import { XStack, YStack, getMedia } from '@dish/ui'
import React, { memo } from 'react'

import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { selectRishDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { DishView } from '../../views/dish/DishView'
import { Link } from '../../views/Link'
import { TagButton } from '../../views/TagButton'
import { SkewedCardCarousel } from '../SimpleCard'
import { EditRestaurantTagsButton } from './EditRestaurantTagsButton'

export const RestaurantPeekDishes = memo(
  graphql(function RestaurantPeekDishes(props: {
    size?: 'lg' | 'md'
    restaurantSlug: string
    restaurantId: string
    activeTagSlugs?: string[]
    isLoaded: boolean
    tagSlugs?: string[]
    editable?: boolean
    onChangeTags?: (slugs: string[]) => void
  }) {
    const media = getMedia()
    const showInitial = media.xs ? 1 : media.sm ? 2 : 3

    const { isLoaded, size = 'md' } = props
    const restaurant = queryRestaurant(props.restaurantSlug)[0]
    const dishes = props.tagSlugs
      ? restaurant
          ?.tags({
            where: {
              tag: {
                slug: {
                  _in: props.tagSlugs,
                },
              },
            },
          })
          .map(selectRishDishViewSimple) ?? []
      : getRestaurantDishes({
          restaurant,
          tagSlugs: props.activeTagSlugs,
          max: 5,
        })

    const foundMatchingSearchedDish = props.activeTagSlugs?.includes(dishes?.[0]?.slug)
    const dishSize = size === 'lg' ? 130 : 110

    return (
      <>
        <XStack
          position="relative"
          pointerEvents="none"
          paddingHorizontal={20}
          paddingVertical={0}
          // this is to pull it up near title
          marginTop={-35}
          x={-15}
          alignItems="center"
        >
          {props.editable && (
            <EditRestaurantTagsButton
              restaurantSlug={props.restaurantSlug}
              tagSlugs={props.tagSlugs ?? dishes.map((x) => x.slug)}
              onChange={props.onChangeTags}
            />
          )}
          <YStack flexWrap="wrap" maxHeight="100%">
            {!!dishes[0]?.name &&
              dishes.map((dish, i) => {
                const preventLoad = !isLoaded && i > showInitial
                return (
                  <YStack
                    flex={1}
                    pointerEvents="auto"
                    marginRight={2}
                    marginBottom={2}
                    key={dish.slug}
                  >
                    {/* <DishView
                      preventLoad={preventLoad}
                      size={baseSize}
                      restaurant={restaurant || undefined}
                      {...dish}
                      showSearchButton={!props.editable}
                    /> */}
                    <Link
                      {...(restaurant
                        ? {
                            name: 'restaurant',
                            params: {
                              slug: restaurant.slug || '',
                              section: 'reviews',
                              sectionSlug: dish.slug,
                            },
                          }
                        : {
                            tags: [dish],
                          })}
                    >
                      <TagButton
                        hideRank
                        hideIcon
                        hideVote
                        fadeLowlyVoted
                        maxWidth={190}
                        width="100%"
                        noLink
                        votable
                        size="$6"
                        {...dish}
                      />
                    </Link>
                  </YStack>
                )
              })}
          </YStack>
        </XStack>
      </>
    )
  })
)
