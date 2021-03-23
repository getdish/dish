import { graphql, order_by, query } from '@dish/graph'
import { uniqBy } from 'lodash'
import React from 'react'
import { AbsoluteVStack, HStack, Text, Theme, VStack, useTheme } from 'snackui'

import { ColorShades } from '../../helpers/getColorsForName'
import { selectRishDishViewSimple } from '../../helpers/selectDishViewSimple'
import { queryRestaurant } from '../../queries/queryRestaurant'
import { TagButton } from '../views/TagButton'

export const RestaurantStatBars = graphql(
  ({
    restaurantSlug,
    tags,
    colors,
    showTags = 3,
  }: {
    restaurantSlug: string
    tags?: string[]
    showTags?: number
    colors: ColorShades
  }) => {
    const [restaurant] = queryRestaurant(restaurantSlug)
    if (!restaurant) {
      return null
    }
    const givenTags =
      tags?.flatMap((tag) => {
        return restaurant.tags({
          where: {
            tag: {
              slug: {
                _eq: tag,
              },
            },
          },
          limit: 1,
        })
      }) ?? []

    const restTags = query.restaurant_tag({
      where: {
        restaurant: {
          slug: {
            _eq: restaurantSlug,
          },
        },
      },
      limit: 3,
      order_by: [{ upvotes: order_by.desc_nulls_last }],
    })

    const rtags = uniqBy([...givenTags, ...restTags], (x) => x.tag.slug).slice(
      0,
      showTags
    )

    const theme = useTheme()

    return (
      <Theme
        name={theme.name === 'dark' ? 'darkTranslucent' : 'lightTranslucent'}
      >
        <VStack alignItems="flex-end" justifyContent="flex-end">
          {rtags.map((rtag, index) => {
            return (
              <VStack
                key={rtag.tag.slug}
                width="100%"
                backgroundColor={`rgba(0,0,0,0.${index + 3})`}
                alignItems="flex-end"
              >
                <TagButton
                  size="lg"
                  floating
                  {...selectRishDishViewSimple(rtag)}
                  backgroundColor="transparent"
                  color="#fff"
                />
              </VStack>
            )
            // return (
            //   <HStack
            //     key={rtag.tag.slug}
            //     width="100%"
            //     height={42}
            //     alignItems="center"
            //     position="relative"
            //   >
            //     <Text
            //       fontWeight="500"
            //       fontSize={22}
            //       textShadowColor="rgba(0,0,0,0.1)"
            //       textShadowOffset={{ height: 1, width: 0 }}
            //       paddingHorizontal={10}
            //       textAlign="right"
            //       flex={1}
            //       zIndex={2}
            //       color="#fff"
            //     >
            //       {rtag.tag.name} {rtag.tag.icon}
            //     </Text>
            //     <AbsoluteVStack
            //       backgroundColor={colors.altPastelColor}
            //       height="100%"
            //       bottom={0}
            //       left={0}
            //       width={`${rtag.rating * 100}%`}
            //     />
            //     <AbsoluteVStack
            //       fullscreen
            //       backgroundColor="rgba(0,0,0,0.15)"
            //     />
            //   </HStack>
            // )
          })}
        </VStack>
      </Theme>
    )
  }
)
