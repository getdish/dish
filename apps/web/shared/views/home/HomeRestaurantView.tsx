import React, { memo, useState } from 'react'
import { Helmet } from 'react-helmet'
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextProps,
  View,
} from 'react-native'

import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { HomeStateItem } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Divider } from '../shared/Divider'
import { Icon } from '../shared/Icon'
import { LinkButton } from '../shared/Link'
import { Popover } from '../shared/Popover'
import { ProgressCircle } from '../shared/ProgressCircle'
import { SmallTitle } from '../shared/SmallTitle'
import { Spacer } from '../shared/Spacer'
import { Tooltip } from '../shared/Stack/Tooltip'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { CloseButton } from './CloseButton'
import { EmojiButton } from './EmojiButton'
import { circularFlatButtonStyle, flatButtonStyle } from './HomeViewTopDishes'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { FavoriteStar } from './RestaurantListItem'
import { RestaurantMetaRow } from './RestaurantMetaRow'
import { RestaurantRatingDetail } from './RestaurantRatingDetail'
import { RestaurantRatingPopover } from './RestaurantRatingPopover'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { TableCell, TableRow } from './TableRow'
import { TagButton } from './TagButton'

export default memoIsEqualDeep(function HomeRestaurantView({
  state,
}: {
  state: HomeStateItem
}) {
  const om = useOvermind()
  const [isRating, setIsRating] = useState(false)
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

  const isCanTag =
    om.state.auth.is_logged_in &&
    (om.state.auth.user.role == 'admin' ||
      om.state.auth.user.role == 'contributor')

  return (
    <>
      <Helmet>
        <title>Best plates at {restaurant.name}</title>
      </Helmet>

      <ZStack right={10} top={10} pointerEvents="auto" zIndex={100}>
        <CloseButton onPress={() => om.actions.home.popTo(-1)} />
      </ZStack>

      <VStack padding={18} paddingBottom={0} paddingRight={16}>
        <HStack position="relative">
          <RestaurantRatingDetail size="lg" restaurant={restaurant} />
          <Spacer size={20} />
          <VStack flex={1}>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
              {restaurant.name}
            </Text>
            <Spacer size={6} />
            <RestaurantMetaRow showMenu size="lg" restaurant={restaurant} />
            <Spacer size={6} />
            <Text style={{ color: '#777', fontSize: 13 }}>
              3017 16th St., San Francisco
            </Text>
            <Spacer size={12} />
          </VStack>

          {/* <ZStack bottom={15} right={15}>

          </ZStack> */}
        </HStack>
        <Divider />
      </VStack>

      <ScrollView style={{ padding: 18, paddingTop: 16, flex: 1 }}>
        <VStack spacing="xl">
          <HStack alignItems="center" justifyContent="center">
            {isCanTag ? <RestaurantTagButton /> : <Spacer size={24} />}
            <Spacer />
            <Divider flex />
            <RestaurantTagsRow size="lg" restaurant={restaurant} />
            <Divider flex />
            <Spacer />
            <FavoriteStar restaurant={restaurant} size="lg" />
          </HStack>

          <VStack>
            <HStack alignItems="center">
              <RestaurantDetailRow centered restaurant={restaurant} flex={1} />

              <RestaurantRatingPopover
                isHovered={false}
                restaurant={restaurant}
              />
            </HStack>
          </VStack>

          <VStack marginHorizontal={-18}>
            <HStack
              alignItems="center"
              paddingHorizontal={10 + 18}
              spacing={20}
              paddingVertical={12}
            >
              <VStack zIndex={10} flex={1} minWidth={90} marginRight={-25}>
                <RatingBreakdownCircle percent={90} emoji="🧑‍🍳" name="Food" />
              </VStack>

              <VStack zIndex={9} flex={1} minWidth={90} marginRight={-25}>
                <RatingBreakdownCircle percent={85} emoji="💁‍♂️" name="Service" />
              </VStack>

              <VStack zIndex={8} flex={1} minWidth={90} marginRight={-25}>
                <RatingBreakdownCircle
                  percent={60}
                  emoji="✨"
                  name="Ambiance"
                />
              </VStack>

              <VStack
                width={1}
                height={100}
                backgroundColor="#ccc"
                marginLeft={25 + 10}
              />

              <VStack
                flex={3}
                paddingVertical={10}
                justifyContent="center"
                marginBottom={-20}
              >
                <Quote>
                  Super <strong>fast service</strong>...
                </Quote>
                <Quote>
                  Really <strong>delicious food</strong>...
                </Quote>
                <Quote>
                  Quite <strong>lovely vibe</strong>...
                </Quote>
              </VStack>
            </HStack>
          </VStack>

          <HStack
            width="100%"
            spacing={20}
            paddingHorizontal={10}
            // borderColor="#eee"
            // borderWidth={1}
            // borderRadius={30}
          >
            <LinkButton flex={1} name="restaurant" alignItems="stretch">
              <VStack
                width="100%"
                shadowColor="rgba(0,0,0,0.2)"
                shadowRadius={5}
                borderRadius={20}
                overflow="hidden"
                marginBottom={10}
              >
                <Image
                  resizeMode="cover"
                  source={{
                    uri: restaurant.image,
                    height: 60,
                  }}
                />
              </VStack>
              <Text style={{ textAlign: 'center', fontSize: 13, opacity: 0.8 }}>
                Inside
              </Text>
            </LinkButton>
            <LinkButton flex={1} name="restaurant" alignItems="stretch">
              <VStack
                width="100%"
                shadowColor="rgba(0,0,0,0.2)"
                shadowRadius={5}
                borderRadius={20}
                overflow="hidden"
                marginBottom={10}
              >
                <Image
                  resizeMode="cover"
                  source={{
                    uri: restaurant.image,
                    height: 60,
                  }}
                />
              </VStack>
              <Text style={{ textAlign: 'center', fontSize: 13, opacity: 0.8 }}>
                Menu
              </Text>
            </LinkButton>
            <LinkButton flex={1} name="restaurant" alignItems="stretch">
              <VStack
                width="100%"
                shadowColor="rgba(0,0,0,0.2)"
                shadowRadius={5}
                borderRadius={20}
                overflow="hidden"
                marginBottom={10}
              >
                <Image
                  resizeMode="cover"
                  source={{
                    uri: restaurant.image,
                    height: 60,
                  }}
                />
              </VStack>
              <Text style={{ textAlign: 'center', fontSize: 13, opacity: 0.8 }}>
                Outside
              </Text>
            </LinkButton>
          </HStack>

          {!!restaurant.photos.length && (
            <VStack>
              <SmallTitle>Top Dishes</SmallTitle>
              <HStack
                paddingHorizontal={0}
                paddingVertical={26}
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
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
                  <VStack
                    key={dish}
                    alignItems="center"
                    marginBottom={15 + 20}
                    marginHorizontal={20 * 0.5}
                  >
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
                        position: 'relative',
                        overflow: 'hidden',
                        width: index < 3 ? 170 : 90,
                        height: index < 3 ? 170 : 90,
                      }}
                    >
                      <Image
                        source={{
                          uri: restaurant.photos[index] ?? restaurant.image,
                        }}
                        style={{
                          width: 170,
                          height: 170,
                          borderRadius: 20,
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}
                      />
                    </View>
                  </VStack>
                ))}
              </HStack>
            </VStack>
          )}

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
    </>
  )
})

const RestaurantTagButton = memo(() => {
  const om = useOvermind()
  const [isOpen, setIsOpen] = useState(false)
  const [suggested_tags, setSuggestedTags] = useState('')
  const state = om.state.home.currentState
  if (state.type != 'restaurant') return
  const restaurant = state.restaurant

  return (
    <Popover
      position="right"
      contents={
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
          <HStack>
            <TextInput
              placeholder="Suggest tag"
              numberOfLines={1}
              style={styles.secondaryInput}
              onChangeText={(t: string) => {
                setSuggestedTags(t)
              }}
            />
            <Button
              title="Add"
              onPress={async () => {
                if (om.state.home.currentState.type != 'restaurant') return
                await om.actions.home.suggestTags(suggested_tags)
              }}
            ></Button>
          </HStack>
          <HStack padding={10} flexWrap="wrap">
            {restaurant.tags.map((t) => {
              const name = t.taxonomy.name
              return <TagButton key={name} name={name} />
            })}
          </HStack>
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
            {(om.state.home.lastHomeState.top_dishes ?? []).map((x) => (
              <TagButton key={x.dish} name={x.dish} />
            ))}
          </HStack>
        </Tooltip>
      }
      isOpen={isOpen}
      onClickOutside={() => setIsOpen(false)}
    >
      <LinkButton onPress={() => setIsOpen(true)}>
        <Icon size={26} name="tag" />
      </LinkButton>
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
        backgroundColor="#eee"
        shadowColor="rgba(0,0,0,0.2)"
        shadowRadius={8}
      >
        <ZStack
          top={1}
          left={1}
          right={1}
          bottom={1}
          position="absolute"
          borderRadius={100}
          backgroundColor="white"
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          transform={[{ rotate: `-${50 - 90}%` }]}
        >
          <ProgressCircle
            percent={90}
            radius={44}
            borderWidth={2}
            color="green"
            bgColor="#fff"
          />
        </ZStack>
        <ZStack fullscreen alignItems="center" justifyContent="center">
          <Text style={{ fontSize: 28, marginBottom: 0 }}>{emoji}</Text>
          <Text style={{ fontSize: 13, color: '#555', fontWeight: '600' }}>
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
        <VStack spacing={6}>
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
