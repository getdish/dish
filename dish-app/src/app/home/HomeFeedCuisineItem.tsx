import {
  RestaurantOnlyIds,
  TopCuisineDish,
  graphql,
  order_by,
  query,
} from '@dish/graph'
import React, { memo, useState } from 'react'
import { HStack, Hoverable, VStack } from 'snackui'

import { getColorsForName } from '../../helpers/getColorsForName'
import { hexToRGB } from '../../helpers/hexToRGB'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { Link } from '../views/Link'
import { FeedSlantedTitleLink } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { GradientButton } from './GradientButton'
import { HomeFeedProps } from './HomeFeedProps'
import { HoverResultsProp } from './HoverResultsProp'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { RestaurantStatBars } from './RestaurantStatBars'
import { SkewedCard } from './SkewedCard'
import { TagsText } from './TagsText'
import { useTopCuisines } from './useTopCuisines'

export type FICuisine = FIBase & {
  restaurants: RestaurantOnlyIds[]
  title: string
  type: 'cuisine'
  tagSlug: string
  dishes: TopCuisineDish[]
}

export function useFeedTopCuisines({ center }: HomeFeedProps) {
  const cuisines = useTopCuisines(center)
  return (cuisines.data ?? []).map(
    (item, index): FICuisine => {
      return {
        id: `cuisine-${item.country}`,
        title: `${item.country}`,
        type: 'cuisine',
        expandable: true,
        rank: index + (index % 3 ? 30 : 0),
        restaurants: item.top_restaurants.map((r) => ({
          slug: r.slug!,
          id: r.id!,
        })),
        dishes: item.dishes,
        tagSlug: item.tag_slug,
      }
    }
  )
}

export const HomeFeedCuisineItem = memo(
  graphql(function HomeFeedCuisineItem(props: FICuisine & HoverResultsProp) {
    const restaurants = props.restaurants
    const [titleWidth, setTitleWidth] = useState(100)
    const dishes = props.dishes
      ? query.tag({
          where: {
            name: {
              _in: props.dishes.map((x) => x.name),
            },
          },
          order_by: [{ popularity: order_by.desc }],
        })
      : []

    return (
      <Hoverable
        onHoverIn={() => {
          props.onHoverResults(restaurants)
        }}
      >
        <FeedSlantedTitleLink
          tag={{ slug: props.tagSlug }}
          onLayout={(x) => setTitleWidth(x.nativeEvent.layout.width)}
          zIndex={10}
        >
          {props.title}
        </FeedSlantedTitleLink>

        <VStack
          maxWidth="100%"
          overflow="hidden"
          marginBottom={-20}
          marginTop={-16}
        >
          <ContentScrollViewHorizontal>
            <VStack
              paddingVertical={12}
              paddingHorizontal={40}
              flexWrap="nowrap"
            >
              <HStack
                spacing={6}
                marginHorizontal="auto"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
              >
                <VStack width={titleWidth} />
                {dishes.map((dish, index) => {
                  const color = getColorsForName(dish.name).color
                  const rgb = hexToRGB(color).rgb
                  return (
                    <Link key={index} tag={{ slug: dish.slug }} asyncClick>
                      <GradientButton rgb={rgb.map((x) => x * 1.1)}>
                        <TagsText
                          tags={[{ name: dish.name, icon: dish.icon }]}
                          color={color}
                        />
                      </GradientButton>
                    </Link>
                  )
                })}
              </HStack>
            </VStack>
          </ContentScrollViewHorizontal>
        </VStack>

        <ContentScrollViewHorizontal>
          <VStack paddingVertical={0} paddingHorizontal={0} flexWrap="nowrap">
            <HStack>
              {restaurants.map((r, i) => {
                return (
                  <SkewedCard zIndex={1000 - i} key={r.id}>
                    <RestaurantCard
                      hoverToMap
                      isBehind={i > 0}
                      restaurantId={r.id}
                      restaurantSlug={r.slug}
                      hoverable={false}
                      below={(colors) => (
                        <RestaurantStatBars
                          restaurantSlug={r.slug}
                          colors={colors}
                        />
                      )}
                    />
                  </SkewedCard>
                )
              })}
            </HStack>
          </VStack>
        </ContentScrollViewHorizontal>
      </Hoverable>
    )
  })
)
