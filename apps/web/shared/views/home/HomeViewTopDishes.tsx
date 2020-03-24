import React, { useEffect, memo } from 'react'
import {
  Image,
  ImageSourcePropType,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import { useOvermind } from '../../state/om'
import top_dish_images from '../../assets/topdishes.json'
import { Spacer } from '../shared/Spacer'
import { Link, LinkButton } from '../shared/Link'
import { HStack, VStack } from '../shared/Stacks'
import { SmallTitle } from '../shared/SmallTitle'
import HomeLenseBar from './HomeLenseBar'
import { HomeStateItem, HomeStateItemHome } from '../../state/home'
import { RankingView } from './RankingView'

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
    <Image
      source={{ uri: image }}
      style={{ width: '100%', height: '100%', borderRadius: 22 }}
      resizeMode="cover"
    />
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
      <HomeLenseBar />
      <HomeViewTopDishesContent state={state} />
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
        <VStack paddingVertical={20}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((x) => (
            <VStack key={x} paddingBottom={20}>
              <HStack paddingHorizontal={20}>
                <HStack flex={1}>
                  <RankingView rank={x + 1} />
                  <Text numberOfLines={1} style={{ fontSize: 24 }}>
                    Korean
                  </Text>
                </HStack>
                <Spacer flex />
                <Text style={{ fontSize: 24 }}>🇰🇷</Text>
              </HStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack height={170} padding={20} paddingHorizontal={10}>
                  {top_dishes.slice(0, 5).map((dish) => {
                    const category = dish.category.replace(/"/g, '')
                    return (
                      <LinkButton
                        key={category}
                        style={{
                          // flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 8,
                        }}
                        name="search"
                        params={{
                          query: category,
                        }}
                      >
                        <VStack width={110} height={100} paddingHorizontal={5}>
                          {getImageForDish(category)}
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
                            {category}
                          </Text>
                        </VStack>
                      </LinkButton>
                    )
                  })}
                </HStack>
              </ScrollView>
            </VStack>
          ))}
        </VStack>
      </ScrollView>
    )
  }
)
