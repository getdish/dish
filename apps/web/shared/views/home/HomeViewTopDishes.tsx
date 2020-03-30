import React, { useEffect } from 'react'
import { Image, Text, ScrollView } from 'react-native'

import { useOvermind } from '../../state/om'
import { Spacer } from '../shared/Spacer'
import { LinkButton } from '../shared/Link'
import { HStack, VStack, StackBaseProps } from '../shared/Stacks'
import { Title } from '../shared/SmallTitle'
import HomeLenseBar from './HomeLenseBar'
import { HomeStateItemHome, HomeStateItemSimple } from '../../state/home'
import { RankingView } from './RankingView'
import { slugify } from '../../helpers/slugify'
import { SuperScriptText } from './TagButton'
import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import _ from 'lodash'

export default memoIsEqualDeep(function HomeViewTopDishes({
  state,
}: {
  state: HomeStateItemSimple
}) {
  const om = useOvermind()

  if (state.type !== 'home') {
    return null
  }
  const activeLense =
    om.state.home.lastHomeState.lenses[om.state.home.lastHomeState.activeLense]

  return (
    <VStack flex={1}>
      <Title>{activeLense.description}</Title>
      <VStack position="relative" flex={1}>
        <HomeLenseBar />
        <HomeViewTopDishesContent state={state as any} />
      </VStack>
    </VStack>
  )
})

const HomeViewTopDishesContent = memoIsEqualDeep(
  ({ state }: { state: HomeStateItemHome }) => {
    const om = useOvermind()
    const { top_dishes = [] } = state

    console.log('RENDER HOME_TOP_DISHES')

    useEffect(() => {
      om.actions.home.loadHomeDishes()
    }, [])

    return (
      <ScrollView style={{ flex: 1 }}>
        <VStack paddingVertical={20} paddingTop={20 + 100}>
          {top_dishes.map((country, index) => (
            <VStack key={country.country} paddingBottom={30}>
              <HStack paddingHorizontal={20} marginVertical={-6}>
                <HStack flex={1}>
                  <RankingView rank={index + 1} />
                  <LinkButton
                    {...flatButtonStyle}
                    marginVertical={-5}
                    name="search"
                    params={{ query: country.country }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 24, fontWeight: '600' }}
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
                <HStack height={170} padding={20} paddingHorizontal={18}>
                  {(country.dishes || []).slice(0, 5).map((top_dish) => {
                    return (
                      <LinkButton
                        key={top_dish.name}
                        style={{
                          // flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 8,
                          marginRight: 6,
                        }}
                        name="search"
                        params={{
                          query: top_dish.name,
                        }}
                      >
                        <VStack width={100} height={100} paddingHorizontal={5}>
                          <VStack
                            shadowColor="rgba(0,0,0,0.2)"
                            shadowRadius={6}
                            shadowOffset={{ width: 0, height: 2 }}
                            width="100%"
                            height="100%"
                            borderRadius={35}
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
                        <Spacer />
                        <VStack maxWidth="100%" overflow="hidden">
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{
                              textDecorationLine: 'none',
                              fontWeight: '600',
                              fontSize: 14,
                              opacity: 0.7,
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
                <HStack padding={10} paddingHorizontal={30}>
                  {country.top_restaurants.map((restaurant, index) => (
                    <LinkButton
                      key={restaurant.name}
                      name="restaurant"
                      params={{ slug: restaurant.slug }}
                      {...flatButtonStyle}
                      marginRight={18}
                    >
                      <Text style={{ fontSize: 14 }}>
                        <SuperScriptText>#</SuperScriptText>
                        {index + 1}. {restaurant.name}{' '}
                        {restaurant.rating.toFixed(1)}⭐
                      </Text>
                    </LinkButton>
                  ))}
                </HStack>
              </ScrollView>
            </VStack>
          ))}
        </VStack>
      </ScrollView>
    )
  }
)

export const flatButtonStyle: StackBaseProps = {
  paddingVertical: 5,
  paddingHorizontal: 8,
  backgroundColor: 'rgba(220, 234, 255, 0.5)',
  hoverStyle: {
    backgroundColor: `rgba(220, 234, 255, 1)`,
  },
  borderRadius: 5,
}

export const circularFlatButtonStyle: StackBaseProps = {
  ...flatButtonStyle,
  borderRadius: 10000,
}
