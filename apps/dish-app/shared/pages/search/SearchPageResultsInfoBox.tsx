import { graphql, order_by, query } from '@dish/graph'
import { HStack, SmallTitle, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { Image, ScrollView } from 'react-native'

import { getActiveTags } from '../../state/getActiveTags'
import { HomeStateItemSearch } from '../../state/home-types'
import { DishViewButton } from '../../views/dish/DishViewButton'

export const SearchPageResultsInfoBox = memo(
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
      order_by: [
        {
          name: order_by.asc,
        },
      ],
      where: {
        type: {
          _eq: 'dish',
        },
        parent: {
          name: {
            _eq: countryTag?.name,
          },
        },
      },
      limit: 50,
    })

    return (
      <HStack
        borderColor="#eee"
        borderWidth={1}
        borderRadius={100}
        overflow="hidden"
        marginHorizontal={10}
        marginBottom={10}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack
            paddingHorizontal={20}
            paddingVertical={5}
            spacing="xs"
            alignItems="center"
          >
            <Text opacity={0.7} fontSize={14} marginRight={8}>
              Filter by dish:
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
      </HStack>
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
        paddingTop={0}
        paddingHorizontal={20}
        spacing={20}
        alignItems="center"
      >
        <VStack flex={1}>
          <Text fontSize={14} color="rgba(0,0,0,0.65)" lineHeight={20}>
            A rich, creamy soup packed with flavor from aromatics and shrimp
            paste, a classic Northern Thai dish with braised chicken in a
            coconut-y curry broth with boiled and fried noodles.
          </Text>
        </VStack>
        <VStack position="relative" width={70} height={70}>
          <Image
            style={{
              marginVertical: -20,
              width: 90,
              height: 90,
              borderRadius: 100,
            }}
            source={{
              uri:
                'https://www.seriouseats.com/recipes/images/2014/09/20140707-small-house-thai-cooking-school-khao-soi-10.jpg',
            }}
          />
          <Text bottom={-5} left={-15} position="absolute" fontSize={42}>
            🍜
          </Text>
        </VStack>
      </HStack>
    )
  }
)
