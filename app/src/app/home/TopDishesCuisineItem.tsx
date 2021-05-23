import { TopCuisine } from '@dish/graph'
import { ChevronRight } from '@dish/react-feather'
import React, { memo, useMemo } from 'react'
import { AbsoluteVStack, HStack, Spacer, Text, VStack } from 'snackui'

import { isWeb } from '../../constants/constants'
import { addTagsToCache, getFullTagFromNameAndType } from '../../helpers/allTags'
import { getColorsForName } from '../../helpers/getColorsForName'
import { getFullTags } from '../../helpers/getFullTags'
import { TagWithNameAndType } from '../../types/tagTypes'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { DishView } from '../views/dish/DishView'
import { LinkButton } from '../views/LinkButton'
import { SlantedLinkButton } from '../views/SlantedBox'

// import { RestaurantButton } from './restaurant/RestaurantButton'

const dishHeight = 140

const TopDishesCuisineItem = memo(({ country, index }: { index: number; country: TopCuisine }) => {
  const countryDishes = useMemo(() => {
    return (country.dishes || []).map((top_dish, index) => {
      return (
        <HStack
          translateY={index % 2 == 0 ? -5 : 5}
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
            type=""
            {...top_dish}
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
          backgroundColor={`${getColorsForName(country.country).lightColor}55`}
          rotate="-2deg"
        />
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
              {/* <TopDishesTrendingRestaurants country={country} /> */}
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
})
