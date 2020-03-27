import React, { memo, useState } from 'react'
import {
  Image,
  Text,
  View,
  ScrollView,
  Linking,
  FlatList,
  TextProps,
  TextInput,
  StyleSheet,
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
  RestaurantTagsRow,
  EmojiButton,
} from './RestaurantListItem'
import { RestaurantMetaRow } from './RestaurantMetaRow'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { Divider } from '../shared/Divider'
import { flatButtonStyle, circularFlatButtonStyle } from './HomeViewTopDishes'
import { TableRow, TableCell } from './TableRow'
import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { Icon } from '../shared/Icon'
import { Popover } from '../shared/Popover'
import { Tooltip } from '../shared/Stack/Tooltip'
import { TagButton } from './TagButton'

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

      <VStack padding={18} paddingBottom={0} paddingRight={60}>
        <HStack>
          <RestaurantRatingDetail size="lg" restaurant={restaurant} />
          <Spacer size={20} />
          <VStack flex={1}>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
              {restaurant.name}
            </Text>
            <Spacer size={6} />
            <RestaurantMetaRow size="lg" restaurant={restaurant} />
          </VStack>
        </HStack>
        <Spacer />
        {/* <Divider /> */}
      </VStack>

      <ScrollView style={{ padding: 18, paddingTop: 6, flex: 1 }}>
        <VStack spacing="lg">
          <HStack alignItems="center" justifyContent="center">
            <Spacer size={24} />
            <Spacer />
            <Divider flex />
            <RestaurantTagsRow size="lg" restaurant={restaurant} />
            <Divider flex />
            <Spacer />
            <RestaurantTagButton />
          </HStack>

          <VStack>
            <HStack alignItems="center">
              <RestaurantDetailRow restaurant={restaurant} flex={1} />
              <HStack
                borderColor="#ddd"
                borderWidth={1}
                borderRadius={100}
                margin={5}
                padding={5}
                alignItems="stretch"
              >
                <EmojiButton size={50}>👎</EmojiButton>
                <EmojiButton size={50}>👍</EmojiButton>
                <EmojiButton size={50}>🤤</EmojiButton>
                {/* <View style={{ flexDirection: 'row' }}>
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
                </View> */}
              </HStack>
            </HStack>
          </VStack>

          <VStack marginHorizontal={-18}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack
                alignItems="center"
                paddingHorizontal={10 + 18}
                spacing={20}
              >
                <VStack flex={1} minWidth={90} marginRight={-25}>
                  <RatingBreakdownCircle emoji="🧑" name="Dishers" />
                </VStack>

                <VStack flex={1} minWidth={90} marginRight={-25}>
                  <RatingBreakdownCircle emoji="🧑‍🍳" name="Chefs" />
                </VStack>

                <VStack flex={1} minWidth={90} marginRight={-25}>
                  <RatingBreakdownCircle emoji="👩‍💻" name="Critics" />
                </VStack>

                {/* {Object.keys(sources).length > 0 && (
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
            ></FlatList> */}

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
              <SmallTitle>Top Dishes</SmallTitle>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -18 }}
              >
                <HStack
                  paddingHorizontal={20}
                  paddingVertical={26}
                  spacing={13}
                >
                  {['Pho', 'Banh Mi', 'Banh Xeo', 'Bho Kho', 'Thit Kho'].map(
                    (dish, index) => (
                      <VStack key={dish} alignItems="center">
                        <VStack
                          marginVertical={-15}
                          zIndex={100}
                          backgroundColor="#fff"
                          paddingVertical={7}
                          paddingHorizontal={10}
                          borderRadius={10}
                          shadowColor="rgba(0,0,0,0.2)"
                          shadowRadius={6}
                        >
                          <Text style={{ fontWeight: '600' }}>{dish}</Text>
                        </VStack>
                        <View
                          style={{
                            shadowColor: 'rgba(0,0,0,0.2)',
                            shadowRadius: 10,
                            borderRadius: 20,
                          }}
                        >
                          <Image
                            source={{
                              uri: restaurant.photos[index] ?? restaurant.image,
                              width: 200,
                              height: 200,
                            }}
                            style={{
                              borderRadius: 20,
                            }}
                          />
                        </View>
                      </VStack>
                    )
                  )}
                </HStack>
              </ScrollView>

              <HStack justifyContent="center" alignItems="center">
                <Divider flex />
                <LinkButton {...flatButtonStyle} name="restaurant">
                  🖼 Inside
                </LinkButton>
                <Spacer />
                <LinkButton {...flatButtonStyle} name="restaurant">
                  🖼 Outside
                </LinkButton>
                <Divider flex />
              </HStack>
            </VStack>
          )}

          <VStack>
            <SmallTitle>Menu</SmallTitle>
            <ScrollView
              style={{ marginHorizontal: -18 }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <HStack paddingHorizontal={18}>
                <TableRow>
                  <TableCell width={200}>Test</TableCell>
                  <TableCell width={200}>Test</TableCell>
                  <TableCell width={200}>Test</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={200}>1</TableCell>
                  <TableCell width={200}>2</TableCell>
                  <TableCell width={200}>3</TableCell>
                </TableRow>
              </HStack>
            </ScrollView>
          </VStack>

          <VStack>
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
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  )
})

const RestaurantTagButton = memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      position="right"
      target={
        <LinkButton
          {...circularFlatButtonStyle}
          onPress={() => setIsOpen(true)}
        >
          <Icon size={24} name="tag" />
        </LinkButton>
      }
      isOpen={isOpen}
      onClickOutside={() => setIsOpen(false)}
    >
      <Tooltip maxWidth={300}>
        <Text
          style={{
            padding: 10,
            paddingTop: 0,
            textAlign: 'center',
            width: '100%',
          }}
        >
          Tag
        </Text>
        <TextInput
          placeholder="Suggest tag"
          numberOfLines={1}
          style={styles.secondaryInput}
        />
        <Text
          style={{
            padding: 10,
            textAlign: 'center',
            width: '100%',
          }}
        >
          Top tags
        </Text>
        <HStack padding={10} flexWrap="wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((x) => (
            <TagButton key={x} name="Lorem" />
          ))}
        </HStack>
      </Tooltip>
    </Popover>
  )
})

const styles = StyleSheet.create({
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
