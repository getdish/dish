import React, { memo, useState } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextProps,
  View,
} from 'react-native'

import { HomeStateItem, HomeStateItemRestaurant } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Divider } from '../ui/Divider'
import { LinkButton } from '../ui/Link'
import { PageTitleTag } from '../ui/PageTitleTag'
import { ProgressCircle } from '../ui/ProgressCircle'
import { SmallTitle } from '../ui/SmallTitle'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { CloseButton } from './CloseButton'
import { LoadingItems } from './LoadingItems'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantMetaRow } from './RestaurantMetaRow'
import { RestaurantRatingDetail } from './RestaurantRatingDetail'
import { RestaurantTagButton } from './RestaurantTagButton'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

export default memo(({ state }: { state: HomeStateItemRestaurant }) => {
  const om = useOvermind()
  if (!state?.restaurantId) {
    return null
  }
  const restaurant = om.state.home.allRestaurants[state.restaurantId]
  const isLoading = (restaurant?.name ?? '') === ''
  const isCanTag =
    om.state.user.isLoggedIn &&
    (om.state.user.user.role == 'admin' ||
      om.state.user.user.role == 'contributor')

  return (
    <>
      <PageTitleTag>
        Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
      </PageTitleTag>

      <ZStack right={10} top={10} pointerEvents="auto" zIndex={100}>
        <CloseButton onPress={() => om.actions.home.popTo(-1)} />
      </ZStack>

      {isLoading && <LoadingItems />}

      {!isLoading && (
        <>
          <VStack padding={18} paddingBottom={0} paddingRight={16}>
            <HStack position="relative">
              <RestaurantRatingDetail size="lg" restaurant={restaurant} />
              <Spacer size={20} />
              <VStack flex={1}>
                <Text
                  style={{ fontSize: 28, fontWeight: 'bold', paddingRight: 30 }}
                >
                  {restaurant.name}
                </Text>
                <Spacer size={4} />
                <RestaurantMetaRow showMenu size="lg" restaurant={restaurant} />
                <Spacer size={8} />
                <Text style={{ color: '#777', fontSize: 13 }}>
                  3017 16th St., San Francisco
                </Text>
                <Spacer size={12} />
              </VStack>
            </HStack>

            <HStack width="100%" alignItems="center">
              <Divider flex />
              <RestaurantFavoriteStar restaurant={restaurant} size="lg" />
              {isCanTag && (
                <ZStack top={3} right={-5}>
                  <RestaurantTagButton size="lg" restaurant={restaurant} />
                </ZStack>
              )}
              <Divider flex />
            </HStack>
          </VStack>

          <ScrollView style={{ padding: 18, paddingTop: 16, flex: 1 }}>
            <VStack spacing="lg">
              <RestaurantTagsRow size="lg" restaurant={restaurant} />

              <HStack paddingVertical={10}>
                <RestaurantDetailRow
                  centered
                  justifyContent="center"
                  restaurant={restaurant}
                  flex={1}
                />
              </HStack>

              <VStack marginTop={-8} marginHorizontal={-18} alignItems="center">
                <HStack
                  alignItems="center"
                  paddingHorizontal={10 + 18}
                  spacing={20}
                  paddingVertical={12}
                >
                  <VStack
                    zIndex={10}
                    flex={1}
                    minWidth={90}
                    maxWidth={120}
                    marginHorizontal={-12}
                  >
                    <RatingBreakdownCircle
                      percent={restaurant.rating_factors?.food}
                      emoji="🧑‍🍳"
                      name="Food"
                    />
                  </VStack>

                  <VStack
                    zIndex={9}
                    flex={1}
                    minWidth={90}
                    maxWidth={120}
                    marginHorizontal={-12}
                  >
                    <RatingBreakdownCircle
                      percent={restaurant.rating_factors?.service}
                      emoji="💁‍♂️"
                      name="Service"
                    />
                  </VStack>

                  <VStack
                    zIndex={8}
                    flex={1}
                    minWidth={90}
                    maxWidth={120}
                    marginHorizontal={-12}
                  >
                    <RatingBreakdownCircle
                      percent={restaurant.rating_factors?.ambience}
                      emoji="✨"
                      name="Ambiance"
                    />
                  </VStack>
                </HStack>
              </VStack>

              {!!restaurant.photos?.length && (
                <VStack spacing="xl">
                  <HStack>
                    <SmallTitle isActive>Top Dishes</SmallTitle>
                    <SmallTitle>Menu</SmallTitle>
                    <SmallTitle>Inside</SmallTitle>
                    <SmallTitle>Outside</SmallTitle>
                  </HStack>

                  <HStack
                    flexWrap="wrap"
                    marginTop={10}
                    alignItems="center"
                    justifyContent="center"
                    spacing="xl"
                  >
                    {[
                      'Pho',
                      'Banh Mi',
                      'Banh Xeo',
                      'Bho Kho',
                      'Thit Kho',
                      'Banh Xeo',
                      'Bho Kho',
                      'Thit Kho',
                    ].map((dish, index) => (
                      <DishCard
                        key={index}
                        name={dish}
                        photo={restaurant.photos[index] ?? restaurant.image}
                        size="lg"
                      />
                    ))}
                  </HStack>
                </VStack>
              )}

              {/* <VStack>
                <SmallTitle>Images</SmallTitle>
                <HStack
                  flexWrap="wrap"
                  height={100}
                  marginLeft={-10}
                  marginRight={-20}
                  alignItems="center"
                  justifyContent="center"
                >
                  {(restaurant.photos ?? []).map((photo, key) => (
                    <Image
                      key={key}
                      source={{ uri: photo }}
                      style={{
                        height: 180,
                        width: '31%',
                        marginRight: 10,
                        marginBottom: 10,
                        borderRadius: 12,
                      }}
                      resizeMode="cover"
                    />
                  ))}
                </HStack>
              </VStack> */}
            </VStack>
          </ScrollView>
        </>
      )}
    </>
  )
})

const DishCard = (props: {
  name: string
  photo: string
  size: 'md' | 'lg'
}) => {
  const isLarge = props.size == 'lg'
  const width = isLarge ? 175 : 100
  const height = isLarge ? 160 : 80
  const margin = isLarge ? 15 : 7
  const borderRadius = isLarge ? 20 : 10
  return (
    <VStack
      alignItems="center"
      marginBottom={margin + 20}
      // marginHorizontal={margin * 0.5}
    >
      <VStack
        marginVertical={-15}
        zIndex={100}
        backgroundColor="#fff"
        paddingVertical={isLarge ? 7 : 5}
        paddingHorizontal={isLarge ? 10 : 8}
        borderRadius={10}
        shadowColor="rgba(0,0,0,0.2)"
        shadowRadius={isLarge ? 8 : 4}
      >
        <Text style={{ fontSize: isLarge ? 15 : 12, fontWeight: '600' }}>
          {props.name}
        </Text>
      </VStack>
      <View
        style={{
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowRadius: isLarge ? 8 : 5,
          borderRadius,
          position: 'relative',
          overflow: 'hidden',
          width,
          height,
        }}
      >
        <Image
          source={{
            uri: props.photo,
          }}
          style={{
            width,
            height,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </View>
    </VStack>
  )
}

export const styles = StyleSheet.create({
  secondaryInput: {
    backgroundColor: '#eee',
    color: '#999',
    minWidth: 200,
    fontWeight: '500',
    padding: 8,
    borderRadius: 5,
    fontSize: 14,
  },
})

const RatingBreakdownCircle = memo(
  ({
    emoji,
    name,
    percent,
  }: {
    emoji: string
    name: string
    percent: number
  }) => {
    return (
      <VStack
        borderRadius={100}
        alignItems="center"
        width="100%"
        height="auto"
        paddingTop="100%"
        backgroundColor="#fff"
        shadowColor="rgba(0,0,0,0.2)"
        shadowRadius={8}
      >
        <ZStack
          top={0}
          left={0}
          right={0}
          bottom={0}
          position="absolute"
          borderRadius={100}
          backgroundColor="white"
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
        >
          <ProgressCircle
            percent={50}
            radius={43}
            borderWidth={2}
            color="#ccc"
          />
        </ZStack>
        <ZStack fullscreen alignItems="center" justifyContent="center">
          <Text style={{ fontSize: 28, marginBottom: 0 }}>{emoji}</Text>
          <Text style={{ fontSize: 12, color: '#555', fontWeight: '700' }}>
            {name}
          </Text>
        </ZStack>
      </VStack>
    )
  }
)

export const Quote = memo(
  ({ style, by, ...props }: TextProps & { by?: string; children: any }) => {
    return (
      <HStack spacing={10}>
        <Text
          style={{
            fontSize: 40,
            color: '#ccc',
            marginTop: -10,
            marginBottom: 0,
          }}
        >
          “
        </Text>
        <VStack spacing={6} flex={1}>
          <Text style={[{ fontSize: 16, color: '#999' }, style]} {...props} />
          {!!by && (
            <Text
              style={[
                { fontWeight: 'bold', fontSize: 13, color: '#999' },
                style,
              ]}
            >
              {by}
            </Text>
          )}
        </VStack>
      </HStack>
    )
  }
)
