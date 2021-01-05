import { TopCuisine } from '@dish/graph'
import { ChevronRight } from '@dish/react-feather'
import _ from 'lodash'
import React, { Suspense, memo, useMemo } from 'react'
import {
  AbsoluteVStack,
  HStack,
  LoadingItemsSmall,
  Spacer,
  Text,
  VStack,
} from 'snackui'

import { isWeb } from '../../constants/constants'
import {
  addTagsToCache,
  getFullTagFromNameAndType,
} from '../../helpers/allTags'
import { getColorsForName } from '../../helpers/getColorsForName'
import { getFullTags } from '../../helpers/getFullTags'
import { TagWithNameAndType } from '../../types/tagTypes'
import { appMapStore } from '../AppMapStore'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { DishView } from '../views/dish/DishView'
import { LinkButton } from '../views/LinkButton'
import { SlantedLinkButton } from '../views/SlantedLinkButton'
import { RestaurantButton } from './restaurant/RestaurantButton'

const dishHeight = 140

const TopDishesCuisineItem = memo(
  ({ country, index }: { index: number; country: TopCuisine }) => {
    const countryDishes = useMemo(() => {
      return (country.dishes || []).map((top_dish, index) => {
        return (
          <HStack
            transform={[{ translateY: index % 2 == 0 ? -5 : 5 }]}
            hoverStyle={{
              zIndex: 1000,
            }}
            marginRight={-6}
            key={index}
          >
            <DishView
              size={dishHeight}
              isFallback
              disableFallbackFade
              dish={top_dish}
              cuisine={{
                id: country.country,
                name: country.country,
                type: 'country',
              }}
            />
          </HStack>
        )
      })
    }, [country.dishes])

    const countryTag = getFullTagFromNameAndType({
      type: 'country',
      name: country.country,
    })

    return (
      <VStack className="home-top-dish" position="relative">
        {index % 2 !== 0 && (
          <AbsoluteVStack
            top={15}
            left={0}
            right={-100}
            bottom={-15}
            borderTopLeftRadius={30}
            borderBottomLeftRadius={30}
            backgroundColor={`${
              getColorsForName(country.country).lightColor
            }55`}
            transform={[{ rotate: '-2deg' }]}
          ></AbsoluteVStack>
        )}

        <HStack justifyContent="center" alignItems="center">
          <SlantedLinkButton
            marginHorizontal="auto"
            zIndex={1000}
            position="relative"
            alignSelf="center"
            tag={countryTag}
            hoverStyle={{
              transform: [{ scale: 1.05 }, { rotate: '-3.5deg' }],
            }}
          >
            <Text
              fontSize={18}
              lineHeight={28}
              fontWeight="600"
              paddingRight={country.icon ? 32 : 0}
              color="#666"
              // not sure why extra right padding on ios
              marginRight={isWeb ? 0 : -30}
            >
              {country.country}
              {country.icon ? (
                <Text
                  position="absolute"
                  top={14}
                  marginLeft={2}
                  marginTop={2}
                  fontSize={26}
                  lineHeight={5}
                >
                  {' '}
                  {country.icon}
                </Text>
              ) : null}
            </Text>
          </SlantedLinkButton>
        </HStack>

        <Spacer size="sm" />

        <VStack
          paddingBottom={20}
          pointerEvents="none"
          flex={1}
          overflow="hidden"
          position="relative"
        >
          <ContentScrollViewHorizontal style={{ paddingVertical: 15 }}>
            <HStack alignItems="center" paddingRight={20}>
              <VStack marginRight={6}>
                <TopDishesTrendingRestaurants country={country} />
              </VStack>

              <Spacer />

              {countryDishes}

              <LinkButton
                className="see-through"
                width={dishHeight * 0.8}
                height={dishHeight}
                alignItems="center"
                justifyContent="center"
                tag={countryTag}
              >
                <ChevronRight size={40} color="black" />
              </LinkButton>
            </HStack>
          </ContentScrollViewHorizontal>
        </VStack>
      </VStack>
    )
  }
)
let lastHoveredId
const setHoveredRestaurant = _.debounce((val) => {
  appMapStore.setHovered(val)
}, 200)

const TopDishesTrendingRestaurants = memo(
  ({ country }: { country: TopCuisine }) => {
    return (
      <VStack
        width={210}
        paddingHorizontal={10}
        marginRight={5}
        height={135}
        spacing={4}
        alignItems="flex-start"
      >
        <Suspense fallback={<LoadingItemsSmall />}>
          {_.uniqBy(country.top_restaurants, (x) => x.name)
            .slice(0, 4)
            .map((restaurant, index) => {
              return (
                <HStack
                  justifyContent="flex-end"
                  key={restaurant.name}
                  maxWidth="100%"
                  minWidth={210}
                >
                  <RestaurantButton
                    color={`rgba(0,0,0,${Math.max(0.5, 1 - (index + 1) / 5)})`}
                    // trending={
                    //   (index % 5) - 1 == 0
                    //     ? 'neutral'
                    //     : index % 2 == 0
                    //     ? 'up'
                    //     : 'down'
                    // }
                    subtle
                    restaurantSlug={restaurant.slug ?? ''}
                    onHoverIn={() => {
                      lastHoveredId = restaurant.id
                      setHoveredRestaurant.cancel()
                      setHoveredRestaurant({
                        id: restaurant.id,
                        slug: restaurant.slug,
                      })
                    }}
                    onHoverOut={() => {
                      if (lastHoveredId === restaurant.id) {
                        setHoveredRestaurant.cancel()
                        appMapStore.setHovered(null)
                      }
                    }}
                  />
                </HStack>
              )
            })}
        </Suspense>
      </VStack>
    )
  }
)

async function updateHomeTagsCache(all: any) {
  let tags: TagWithNameAndType[] = []
  // update tags
  for (const topDishes of all) {
    tags.push({
      name: topDishes.country,
      type: 'country',
      icon: topDishes.icon,
      slug: topDishes.tag_slug,
    })
    tags = [
      ...tags,
      ...(topDishes.dishes ?? []).map((dish) => ({
        name: dish.name ?? '',
        type: 'dish',
        slug: dish.slug,
      })),
    ]
  }
  const fullTags = await getFullTags(tags)
  addTagsToCache(fullTags)
}
