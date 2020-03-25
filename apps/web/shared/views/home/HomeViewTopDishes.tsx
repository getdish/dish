import React, { useEffect, memo } from 'react'
import {
  Image,
  ImageSourcePropType,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { useOvermind } from '../../state/om'
import top_dish_images from '../../assets/topdishes.json'
import { Spacer } from '../shared/Spacer'
import { Link, LinkButton } from '../shared/Link'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { SmallTitle } from '../shared/SmallTitle'
import HomeLenseBar from './HomeLenseBar'
import { HomeStateItem, HomeStateItemHome } from '../../state/home'
import { RankingView } from './RankingView'
import { LinearGradient } from 'expo-linear-gradient'
import { slugify } from '../../helpers/slugify'
import { SuperScriptText } from './TagButton'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 40,
    alignItems: 'center',
  },
})

const getImageForDish = (dish: string) => {
  let image: string
  for (const item of top_dish_images) {
    if (item.name == `"${dish}"`) {
      if (item.image != null) {
        image = item.image
      } else {
        image =
          'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
      }
    }
  }
  return (
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
        source={{ uri: image }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    </VStack>
  )
}

export default memo(function HomeViewTopDishes({
  state,
}: {
  state: HomeStateItem
}) {
  const om = useOvermind()

  if (state.type !== 'home') {
    return null
  }
  const activeLense =
    om.state.home.lastHomeState.lenses[om.state.home.lastHomeState.activeLense]

  return (
    <VStack flex={1}>
      <SmallTitle>{activeLense.description}</SmallTitle>
      <VStack position="relative" flex={1}>
        <HomeLenseBar />
        <HomeViewTopDishesContent state={state} />
      </VStack>
    </VStack>
  )
})

const HomeViewTopDishesContent = memo(
  ({ state }: { state: HomeStateItemHome }) => {
    const om = useOvermind()
    const { top_dishes = [] } = state

    useEffect(() => {
      om.actions.home.getTopDishes()
    }, [])

    return (
      <ScrollView style={{ flex: 1 }}>
        <VStack paddingVertical={20} paddingTop={20 + 60}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((x) => (
            <VStack key={x} paddingBottom={30}>
              <HStack paddingHorizontal={20} marginVertical={-6}>
                <HStack flex={1}>
                  <RankingView rank={x + 1} />
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 24, fontWeight: '600' }}
                  >
                    Korean
                  </Text>
                </HStack>
                <Spacer flex />
                <Text style={{ fontSize: 36, marginVertical: -10 }}>🇰🇷</Text>
              </HStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack height={170} padding={20} paddingHorizontal={18}>
                  {top_dishes.slice(0, 5).map((top_dish) => {
                    return (
                      <LinkButton
                        key={top_dish.dish}
                        style={{
                          // flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 8,
                          marginRight: 6,
                        }}
                        name="search"
                        params={{
                          query: top_dish.dish,
                        }}
                      >
                        <VStack width={100} height={100} paddingHorizontal={5}>
                          {getImageForDish(top_dish.dish)}
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
                            {top_dish.dish}
                          </Text>
                        </VStack>
                      </LinkButton>
                    )
                  })}
                </HStack>
              </ScrollView>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack padding={10} paddingHorizontal={30}>
                  {[
                    'Pancho Villa Taqueria',
                    'La Taqueria',
                    'El Farolito',
                    'Tacos el Patron',
                  ].map((name, index) => (
                    <LinkButton
                      key={name}
                      name="restaurant"
                      params={{ slug: slugify(name) }}
                      paddingVertical={5}
                      paddingHorizontal={8}
                      backgroundColor="rgba(220, 234, 255, 0.5)"
                      hoverStyle={{
                        backgroundColor: `rgba(220, 234, 255, 1)`,
                      }}
                      borderRadius={5}
                      marginRight={18}
                    >
                      <Text style={{ fontSize: 14 }}>
                        <SuperScriptText>#</SuperScriptText>
                        {index + 1}. {name}
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
