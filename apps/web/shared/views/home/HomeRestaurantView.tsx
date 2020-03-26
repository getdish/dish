import React, { memo } from 'react'
import {
  Image,
  Text,
  View,
  ScrollView,
  Linking,
  FlatList,
  TextProps,
} from 'react-native'

import { useOvermind } from '../../state/om'

import ReviewForm from './ReviewForm'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack, StackBaseProps } from '../shared/Stacks'
import { Link, LinkButton } from '../shared/Link'
import { SmallTitle } from '../shared/SmallTitle'
import { HomeStateItem } from '../../state/home'
import { CloseButton } from './CloseButton'
import { RatingView } from './RatingView'
import {
  RestaurantRatingDetail,
  RestaurantMetaRow,
  RestaurantTagsRow,
} from './RestaurantListItem'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { Divider } from '../shared/Divider'
import { flatButtonStyle } from './HomeViewTopDishes'
import { TableRow, TableCell } from './TableRow'
import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'

export default memoIsEqualDeep(function HomeRestaurantView({
  state,
}: {
  state: HomeStateItem
}) {
  const om = useOvermind()
  if (state.type !== 'restaurant') {
    return null
  }
  if (!state.restaurant) {
    return null
  }
  const restaurant = state.restaurant
  if (typeof restaurant.name == 'undefined') {
    return <Text>Loading...</Text>
  }

  const sources = restaurant.sources ?? []

  return (
    <VStack flex={1}>
      <ZStack right={10} top={10} pointerEvents="auto" zIndex={100}>
        <CloseButton onPress={() => om.actions.home.popTo(-1)} />
      </ZStack>
      <ScrollView style={{ padding: 18, flex: 1 }}>
        <VStack spacing="lg">
          <HStack>
            <RestaurantRatingDetail restaurant={restaurant} />
            <Spacer size={20} />
            <VStack flex={1}>
              <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
                {restaurant.name}
              </Text>
              <RestaurantMetaRow restaurant={restaurant} />
            </VStack>
          </HStack>

          <VStack>
            <Divider />
            <RestaurantDetailRow restaurant={restaurant} />
            <Spacer />
          </VStack>

          <HStack alignItems="center">
            <RestaurantTagsRow showMore restaurant={restaurant} />
          </HStack>

          <VStack>
            <SmallTitle>Rating Breakdown</SmallTitle>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack
                alignItems="center"
                paddingHorizontal={10}
                paddingVertical={5}
                spacing={20}
              >
                <VStack flex={1} minWidth={90}>
                  <RatingBreakdownCircle emoji="🧑" name="Dishers" />
                </VStack>

                <VStack flex={1} minWidth={90}>
                  <RatingBreakdownCircle emoji="🧑‍🍳" name="Chefs" />
                </VStack>

                <VStack flex={1} minWidth={90}>
                  <RatingBreakdownCircle emoji="👩‍💻" name="Critics" />
                </VStack>

                <HStack paddingVertical={20}>
                  <VStack maxWidth={180} flex={1} paddingHorizontal={20}>
                    <Quote by="20 people">
                      Super <strong>fast service</strong>...
                    </Quote>
                  </VStack>

                  <VStack maxWidth={180} flex={1} paddingHorizontal={20}>
                    <Quote by="20 people">
                      Super <strong>fast service</strong>...
                    </Quote>
                  </VStack>

                  <VStack maxWidth={180} flex={1} paddingHorizontal={20}>
                    <Quote by="20 people">
                      Super <strong>fast service</strong>...
                    </Quote>
                  </VStack>
                </HStack>
              </HStack>
            </ScrollView>
          </VStack>

          {!!restaurant.photos.length && (
            <VStack>
              <SmallTitle>Top Rated Dishes</SmallTitle>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -18 }}
              >
                <HStack
                  paddingHorizontal={20}
                  paddingVertical={26}
                  spacing={20}
                >
                  {['Pho', 'Banh Mi', 'Banh Xeo', 'Bho Kho', 'Thit Kho'].map(
                    (dish, index) => (
                      <VStack key={dish} alignItems="center">
                        <VStack
                          marginVertical={-15}
                          zIndex={100}
                          backgroundColor="#eee"
                          paddingVertical={8}
                          paddingHorizontal={10}
                          borderRadius={10}
                          shadowColor="rgba(0,0,0,0.2)"
                          shadowRadius={6}
                        >
                          <Text>{dish}</Text>
                        </VStack>
                        <Image
                          source={{
                            uri: restaurant.photos[index] ?? restaurant.image,
                            width: 160,
                            height: 160,
                          }}
                          style={{
                            borderRadius: 20,
                            shadowColor: 'rgba(0,0,0,0.2)',
                            shadowRadius: 6,
                          }}
                        />
                      </VStack>
                    )
                  )}
                </HStack>
              </ScrollView>

              <HStack justifyContent="center">
                <LinkButton {...flatButtonStyle} name="restaurant">
                  🖼 Inside
                </LinkButton>
                <Spacer />
                <LinkButton {...flatButtonStyle} name="restaurant">
                  🖼 Outside
                </LinkButton>
              </HStack>
            </VStack>
          )}

          <VStack>
            <Spacer size="lg" />
            <SmallTitle>Menu</SmallTitle>

            <TableRow>
              <TableCell width="33%">Test</TableCell>
              <TableCell width="33%">Test</TableCell>
              <TableCell width="33%">Test</TableCell>
            </TableRow>
            <TableRow>
              <TableCell width="33%">Test</TableCell>
              <TableCell width="33%">Test</TableCell>
              <TableCell width="33%">Test</TableCell>
            </TableRow>
            <TableRow>
              <TableCell width="33%">Test</TableCell>
              <TableCell width="33%">Test</TableCell>
              <TableCell width="33%">Test</TableCell>
            </TableRow>
          </VStack>

          <Spacer size="lg" />

          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{ uri: restaurant.image }}
              style={{ height: 200, width: '100%' }}
              resizeMode="cover"
            />
            <View style={{ width: '30%' }}>
              {om.state.auth.is_logged_in && <ReviewForm />}
            </View>
            <View>
              <Text style={{ fontSize: 15 }}>Latest Reviewers</Text>
              {(state.reviews ?? []).map((review, i) => {
                return (
                  <Text key={i}>
                    <Link
                      name="user"
                      params={{ id: review.user.id, pane: 'reviews' }}
                    >
                      {review.user.username}
                    </Link>
                    {i == state.reviews.length - 1 ? '' : ', '}
                  </Text>
                )
              })}
            </View>
          </View>
          <View>
            <HStack height={100}>
              {(restaurant.photos ?? []).map((photo, key) => (
                <Image
                  key={key}
                  source={{ uri: photo }}
                  style={{ height: 100, width: 100 }}
                  resizeMode="cover"
                />
              ))}
            </HStack>
          </View>
          <View>
            {!!restaurant.website && (
              <Text onPress={() => Linking.openURL(restaurant.website)}>
                🔗 {restaurant.website}
              </Text>
            )}

            {Object.keys(sources).length > 0 && (
              <SmallTitle>Sources</SmallTitle>
            )}
            <FlatList
              data={Object.keys(sources).map((i) => {
                return {
                  source: i,
                  url: sources[i],
                }
              })}
              renderItem={(i) => (
                <Text
                  key={i.item.source}
                  onPress={() => Linking.openURL(i.item.url)}
                >
                  🔗 {i.item.source}
                </Text>
              )}
            ></FlatList>
          </View>
        </VStack>
      </ScrollView>
    </VStack>
  )
})

const RatingBreakdownCircle = memo(
  ({ emoji, name }: { emoji: string; name: string }) => {
    return (
      <VStack
        borderRadius={10000000000}
        alignItems="center"
        width="100%"
        height="auto"
        paddingTop="100%"
        backgroundColor="white"
        shadowColor="rgba(0,0,0,0.1)"
        shadowRadius={5}
      >
        <ZStack fullscreen alignItems="center" justifyContent="center">
          <Text style={{ fontSize: 28, marginBottom: 2 }}>{emoji}</Text>
          <Text style={{ fontSize: 15, color: '#444', fontWeight: '500' }}>
            {name}
          </Text>
        </ZStack>
      </VStack>
    )
  }
)

export const Quote = memo(
  ({ style, by, ...props }: TextProps & { by: string; children: any }) => {
    return (
      <HStack spacing={10}>
        <Text style={{ fontSize: 40, color: '#ccc' }}>“</Text>
        <VStack spacing={6}>
          <Text style={[{ fontSize: 16, color: '#999' }, style]} {...props} />
          <Text
            style={[{ fontWeight: 'bold', fontSize: 13, color: '#999' }, style]}
          >
            {by}
          </Text>
        </VStack>
      </HStack>
    )
  }
)
