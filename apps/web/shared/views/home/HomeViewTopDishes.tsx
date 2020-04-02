import { TopDish } from '@dish/models'
import _ from 'lodash'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Image, ScrollView, Text } from 'react-native'

import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { HomeStateItemHome, HomeStateItemSimple } from '../../state/home'
import { useOvermind } from '../../state/om'
import { LinkButton } from '../shared/Link'
import { PageTitle } from '../shared/PageTitle'
import { Spacer } from '../shared/Spacer'
import { HStack, StackBaseProps, VStack } from '../shared/Stacks'
import HomeLenseBar from './HomeLenseBar'
import { RankingView } from './RankingView'
import { RatingView } from './RatingView'

export default memoIsEqualDeep(function HomeViewTopDishes({
  state,
}: {
  state: HomeStateItemHome
}) {
  const om = useOvermind()
  return (
    <>
      <PageTitle>Dish - Uniquely Good Food</PageTitle>
      <Spacer size={20} />
      {/* <Title>{activeLense?.description ?? ''}</Title> */}
      <VStack position="relative" flex={1}>
        <HomeLenseBar backgroundGradient />
        <HomeViewTopDishesContent topDishes={om.state.home.topDishes} />
      </VStack>
    </>
  )
})

const HomeViewTopDishesContent = memoIsEqualDeep(
  ({ topDishes = [] }: { topDishes?: TopDish[] }) => {
    return (
      <ScrollView style={{ flex: 1, overflow: 'hidden' }}>
        <VStack paddingVertical={20} paddingTop={20 + 100}>
          {topDishes.map((country, index) => (
            <VStack key={country.country} paddingBottom={30}>
              <HStack paddingHorizontal={20}>
                <HStack flex={1}>
                  <RankingView rank={index + 1} marginTop={-13} />
                  <LinkButton
                    {...flatButtonStyle}
                    marginVertical={-5}
                    name="search"
                    params={{ query: country.country }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 22, fontWeight: '600' }}
                    >
                      {country.country}
                    </Text>
                  </LinkButton>
                </HStack>
                <Spacer flex />
                <Text style={{ fontSize: 36, marginVertical: -10 }}>
                  {country.icon}
                </Text>
              </HStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack
                  height={160}
                  alignItems="center"
                  padding={20}
                  paddingBottom={10}
                  paddingHorizontal={32}
                  spacing={22}
                >
                  {(country.dishes || []).slice(0, 5).map((top_dish, index) => {
                    return (
                      <LinkButton
                        key={`${top_dish.name}${index}`}
                        style={{
                          // flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 3,
                        }}
                        name="search"
                        params={{
                          query: top_dish.name,
                        }}
                      >
                        <VStack width={90} height={90}>
                          <VStack
                            shadowColor="rgba(0,0,0,0.17)"
                            shadowRadius={15}
                            shadowOffset={{ width: 0, height: 3 }}
                            width="100%"
                            height="100%"
                            borderRadius={33}
                            overflow="hidden"
                            hoverStyle={{
                              shadowRadius: 14,
                              shadowColor: 'rgba(0,0,0,0.35)',
                              zIndex: 10000,
                            }}
                          >
                            <Image
                              source={{ uri: top_dish.image }}
                              style={{ width: '100%', height: '100%' }}
                              resizeMode="cover"
                            />
                          </VStack>
                        </VStack>
                        <VStack
                          marginTop={5}
                          alignItems="center"
                          justifyContent="center"
                          overflow="hidden"
                        >
                          <Text
                            numberOfLines={1}
                            style={{
                              fontWeight: '600',
                              fontSize: 14,
                              lineHeight: 22,
                              opacity: 0.75,
                              textAlign: 'center',
                            }}
                          >
                            {top_dish.name}
                          </Text>
                        </VStack>
                      </LinkButton>
                    )
                  })}
                </HStack>
              </ScrollView>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack padding={10} paddingHorizontal={30} spacing={26}>
                  {_.uniqBy(country.top_restaurants, (x) => x.name).map(
                    (restaurant, index) => (
                      <LinkButton
                        key={restaurant.name}
                        name="restaurant"
                        params={{ slug: restaurant.slug }}
                        {...flatButtonStyle}
                        paddingRight={28}
                      >
                        <Text style={{ fontSize: 14, fontWeight: '400' }}>
                          {restaurant.name}
                        </Text>
                        <RatingView
                          size="sm"
                          restaurant={restaurant}
                          position="absolute"
                          top={-4}
                          right={-12}
                        />
                      </LinkButton>
                    )
                  )}
                </HStack>
              </ScrollView>
            </VStack>
          ))}
        </VStack>
      </ScrollView>
    )
  }
)

export const baseButtonStyle: StackBaseProps = {
  paddingVertical: 5,
  borderRadius: 5,
  paddingHorizontal: 8,
}

export const flatButtonStyle: StackBaseProps = {
  ...baseButtonStyle,
  backgroundColor: 'rgba(220, 234, 255, 0.5)',
  hoverStyle: {
    backgroundColor: `rgba(220, 234, 255, 1)`,
  },
}

export const flatButtonStyleInactive: StackBaseProps = {
  ...baseButtonStyle,
  backgroundColor: 'rgba(220, 220, 220, 0.5)',
  hoverStyle: {
    backgroundColor: `rgba(220, 220, 220, 1)`,
  },
}

export const flatButtonStyleActive: StackBaseProps = {
  ...baseButtonStyle,
  backgroundColor: 'rgba(200, 214, 255, 0.8)',
  hoverStyle: {
    backgroundColor: 'rgba(200, 214, 235, 1)',
  },
}

export const circularFlatButtonStyle: StackBaseProps = {
  ...flatButtonStyle,
  borderRadius: 10000,
}
