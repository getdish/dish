import { graphql, query } from '@dish/graph/_'
import { HStack, SmallTitle, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { Image, ScrollView } from 'react-native'

import { getActiveTags } from '../../state/home-tag-helpers'
import { HomeStateItemSearch } from '../../state/home-types'
import { DishViewButton } from './DishViewButton'

export const HomeSearchInfoBox = memo(
  ({ state }: { state: HomeStateItemSearch }) => {
    const tags = getActiveTags(state)

    const dishTag = tags.find((x) => x.type === 'dish')
    if (dishTag) {
      return <HomeSearchInfoBoxDish state={state} />
    }

    const countryTag = tags.find((x) => x.type === 'country')
    if (countryTag) {
      return <HomeSearchInfoBoxCountry state={state} />
    }

    return null
  }
)

const HomeSearchInfoBoxCountry = memo(
  graphql(({ state }: { state: HomeStateItemSearch }) => {
    const tags = getActiveTags(state)
    const countryTag = tags.find((x) => x.type === 'country')
    const topCountryDishes = query.tag({
      where: {
        type: {
          _eq: 'dish',
        },
        parent: {
          name: {
            _eq: countryTag.name,
          },
        },
      },
      limit: 50,
    })

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack
          paddingHorizontal={20}
          paddingVertical={15}
          spacing={10}
          alignItems="center"
        >
          <Text opacity={0.7} fontSize={14}>
            Popular {countryTag.name} Dishes:
          </Text>
          {topCountryDishes.map((tag) => {
            return (
              <DishViewButton
                key={tag.id}
                size={90}
                name={tag.name}
                icon={tag.icon ?? '🍜'}
              />
            )
          })}
        </HStack>
      </ScrollView>
    )
  })
)

const HomeSearchInfoBoxDish = memo(
  ({ state }: { state: HomeStateItemSearch }) => {
    const tags = getActiveTags(state)
    const dishTag = tags.find((x) => x.type === 'dish')

    if (!dishTag) {
      return null
    }

    return (
      <HStack
        paddingTop={20}
        paddingHorizontal={20}
        paddingBottom={10}
        spacing={20}
        alignItems="center"
      >
        <Text fontSize={14} color="rgba(0,0,0,0.8)" lineHeight={18}>
          <strong>{dishTag.name}</strong> - A rich, creamy soup packed with
          flavor from aromatics and shrimp paste, a classic Northern Thai dish
          with braised chicken in a coconut-y curry broth with boiled and fried
          noodles.
        </Text>
        <VStack position="relative" width={60} height={60}>
          <Image
            style={{
              marginVertical: -10,
              width: 80,
              height: 80,
              borderRadius: 100,
            }}
            source={{
              uri:
                'https://www.seriouseats.com/recipes/images/2014/09/20140707-small-house-thai-cooking-school-khao-soi-10.jpg',
            }}
          />
          <Text bottom={-10} left={-10} position="absolute" fontSize={35}>
            🍜
          </Text>
        </VStack>
      </HStack>
    )
  }
)
