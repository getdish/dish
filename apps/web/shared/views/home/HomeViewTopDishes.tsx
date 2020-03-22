import React, { useEffect } from 'react'
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
import { Link } from '../shared/Link'
import { HStack, VStack } from '../shared/Stacks'
import { SmallTitle } from '../shared/SmallTitle'

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

export default function HomeViewTopDishes() {
  const om = useOvermind()
  const state = om.state.home.currentState
  if (state.type !== 'home') {
    return null
  }
  const { top_dishes = [] } = state

  return (
    <VStack flex={1}>
      <ScrollView style={{ flex: 1 }}>
        <VStack paddingVertical={20}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(x => (
            <VStack key={x} paddingBottom={20}>
              <HStack paddingHorizontal={20}>
                <Text style={{ fontSize: 24 }}>#{x + 1}. Korean</Text>
                <Spacer flex />
                <Text style={{ fontSize: 24 }}>🇰🇷</Text>
              </HStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack padding={20} height={140}>
                  {top_dishes.map(dish => {
                    const category = dish.category.replace(/"/g, '')
                    return (
                      <TouchableOpacity
                        key={category}
                        style={{
                          // flexDirection: 'row',
                          alignItems: 'center',
                          width: 90,
                          height: 90,
                          padding: 8,
                        }}
                        onPress={() => {
                          om.actions.home.setSearchQuery(
                            dish.category.replace(/"/g, '')
                          )
                          om.actions.router.navigate({
                            name: 'search',
                            params: { query: category },
                          })
                        }}
                      >
                        {getImageForDish(category)}
                        <Spacer />
                        <Link name="search" params={{ query: category }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              textDecorationLine: 'none',
                              fontWeight: '600',
                              fontSize: 14,
                              opacity: 0.7,
                            }}
                          >
                            {category}
                          </Text>
                        </Link>
                      </TouchableOpacity>
                    )
                  })}
                </HStack>
              </ScrollView>
            </VStack>
          ))}
        </VStack>
      </ScrollView>
    </VStack>
  )
}
