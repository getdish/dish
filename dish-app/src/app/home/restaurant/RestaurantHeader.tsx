import { graphql } from '@dish/graph'
import { Clock } from '@dish/react-feather'
import React, { Suspense, memo, useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  Spacer,
  Text,
  Theme,
  VStack,
} from 'snackui'

import { drawerBorderRadius } from '../../../constants/constants'
import { useColorsFor } from '../../../helpers/useColorsFor'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { HomeStateItemRestaurant } from '../../../types/homeTypes'
import { CommentBubble } from '../../views/CommentBubble'
import {
  ContentScrollViewHorizontalFitted,
  useContentScrollHorizontalFitter,
} from '../../views/ContentScrollViewHorizontal'
import { LogoCircle } from '../../views/Logo'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantTagsRow } from '../../views/restaurant/RestaurantTagsRow'
import { SmallButton } from '../../views/SmallButton'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantAddToListButton } from './RestaurantAddToListButton'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { openingHours } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteButton'
import { RestaurantPhotosRow } from './RestaurantPhotosRow'

type RestaurantHeaderProps = {
  state?: HomeStateItemRestaurant
  restaurantSlug: any
  afterAddress?: any
  size?: 'sm' | 'md'
  minHeight?: number
}

export const RestaurantHeader = (props: RestaurantHeaderProps) => {
  return (
    <Suspense fallback={<VStack minHeight={props.minHeight} />}>
      <RestaurantHeaderContent {...props} />
    </Suspense>
  )
}

const RestaurantHeaderContent = memo(
  graphql(
    ({ state, restaurantSlug, afterAddress, size }: RestaurantHeaderProps) => {
      const imgHeight = 250
      const [restaurant] = queryRestaurant(restaurantSlug)
      if (!restaurant) {
        return null
      }
      const [open_text, open_color, next_time] = openingHours(restaurant)
      const paddingPx = size === 'sm' ? 10 : 30
      const spacer = <Spacer size={paddingPx} />
      const nameLen = restaurant.name?.length ?? 10
      const {
        width,
        drawerWidth,
        minWidth,
        setWidthDebounce,
      } = useContentScrollHorizontalFitter()
      const scale = width < 601 ? 0.7 : drawerWidth < 700 ? 0.85 : 1
      const fontScale = size === 'sm' ? 0.8 : 1
      const fontSizeBase =
        nameLen > 40
          ? 28
          : nameLen > 30
          ? 30
          : nameLen > 24
          ? 32
          : nameLen > 18
          ? 34
          : 40
      const fontSize = scale * fontSizeBase * fontScale
      const contentLeftWidth = width - 60
      const restaurantId = restaurant.id
      const photoWidth = width * 0.5
      const [hasScrolled, setHasScrolled] = useState(false)
      const colors = useColorsFor(restaurantSlug)

      return (
        <ContentScrollViewHorizontalFitted
          onScroll={hasScrolled ? undefined : () => setHasScrolled(true)}
          width={width}
          setWidth={setWidthDebounce}
        >
          <VStack>
            <AbsoluteVStack top={5} left={5} zIndex={100}>
              <Suspense fallback={null}>
                <RestaurantAddToListButton
                  shadowed
                  restaurantSlug={restaurantSlug}
                />
              </Suspense>
            </AbsoluteVStack>

            <AbsoluteVStack zIndex={0} pointerEvents="auto">
              <RestaurantPhotosRow
                restaurantSlug={restaurantSlug}
                width={photoWidth}
                height={imgHeight}
                escalating
                showEscalated={hasScrolled}
              />
              <AbsoluteVStack
                left={0}
                right={0}
                height={imgHeight}
                width={width}
                pointerEvents="none"
                transform={[{ translateY: 1 }]}
              >
                <LinearGradient
                  style={[StyleSheet.absoluteFill]}
                  colors={[
                    // `${colors.themeColorAlt}aa`,
                    `${colors.themeColor}00`,
                    `${colors.themeColor}00`,
                    colors.themeColor,
                  ]}
                />
              </AbsoluteVStack>
            </AbsoluteVStack>

            <Theme name={colors.name}>
              <VStack
                marginTop={imgHeight - 70}
                minWidth={minWidth}
                maxWidth={width}
                borderTopRightRadius={drawerBorderRadius - 1}
                borderTopLeftRadius={drawerBorderRadius - 1}
                width="100%"
                position="relative"
                pointerEvents="none"
                zIndex={10}
              >
                <VStack flex={1}>
                  {/* title row */}
                  <HStack paddingLeft={20} alignItems="center">
                    <HStack position="relative">
                      <VStack marginVertical={-14}>
                        <Theme name="light">
                          <RestaurantRatingView
                            floating
                            size={82}
                            slug={restaurantSlug}
                          />
                        </Theme>
                      </VStack>
                      <Spacer size="lg" />
                      <HStack
                        backgroundColor={colors.themeColorAlt}
                        shadowColor="#000"
                        shadowOpacity={0.2}
                        pointerEvents="auto"
                        shadowRadius={5}
                        shadowOffset={{ height: 3, width: 0 }}
                        borderRadius={16}
                        paddingHorizontal={20}
                        paddingVertical={9}
                        alignItems="center"
                        justifyContent="center"
                        minWidth={100}
                        transform={[
                          {
                            skewX: '-12deg',
                          },
                        ]}
                      >
                        <HStack
                          transform={[
                            {
                              skewX: '12deg',
                            },
                          ]}
                        >
                          <Text
                            color="#fff"
                            alignSelf="flex-start"
                            selectable
                            letterSpacing={-1.2}
                            fontSize={fontSize}
                            fontWeight="800"
                          >
                            {restaurant.name || ' '}
                          </Text>
                        </HStack>
                      </HStack>
                    </HStack>
                  </HStack>

                  <Spacer size="lg" />

                  {/* below title row */}
                  <HStack
                    pointerEvents="auto"
                    flex={1}
                    alignItems="flex-start"
                    minWidth={280}
                  >
                    {spacer}
                    <VStack flex={10} overflow="hidden">
                      <VStack
                        pointerEvents="auto"
                        overflow="hidden"
                        paddingRight={20}
                      >
                        <HStack
                          alignItems="center"
                          flexWrap="wrap"
                          maxWidth="100%"
                          minHeight={55}
                        >
                          <Suspense fallback={null}>
                            <HStack marginBottom={10}>
                              <RestaurantFavoriteStar
                                size="lg"
                                restaurantId={restaurantId}
                              />
                              <Spacer size="xs" />

                              <RestaurantAddressLinksRow
                                curLocInfo={state?.curLocInfo ?? null}
                                showMenu
                                size="lg"
                                restaurantSlug={restaurantSlug}
                              />
                            </HStack>

                            <Spacer size="sm" />

                            <VStack marginBottom={10}>
                              <RestaurantAddress
                                size="xs"
                                address={restaurant.address ?? ''}
                                curLocInfo={state?.curLocInfo ?? null}
                              />
                            </VStack>

                            <VStack marginBottom={10}>
                              <SmallButton
                                backgroundColor="transparent"
                                borderWidth={0}
                                name="restaurantHours"
                                params={{ slug: restaurantSlug }}
                                textProps={{
                                  ellipse: true,
                                  opacity: 0.5,
                                }}
                                icon={
                                  <Clock
                                    size={14}
                                    color="#999"
                                    style={{ marginRight: 5 }}
                                  />
                                }
                                children={`${open_text}${
                                  next_time ? ` (${next_time})` : ''
                                }`}
                              />
                            </VStack>
                          </Suspense>
                        </HStack>

                        {afterAddress}
                      </VStack>

                      <Spacer size="sm" />

                      <VStack width={contentLeftWidth}>
                        <RestaurantTagsRow
                          restaurantSlug={restaurantSlug}
                          restaurantId={restaurantId}
                          spacing={10}
                          grid
                          max={8}
                        />

                        <Spacer size="lg" />

                        <VStack marginLeft={-10}>
                          <CommentBubble
                            avatar={<LogoCircle />}
                            name="DishBot"
                            avatarBackgroundColor="transparent"
                            text={
                              <RestaurantOverview
                                maxLines={4}
                                size="lg"
                                restaurantSlug={restaurantSlug}
                              />
                            }
                          />
                        </VStack>

                        <RestaurantDeliveryButtons
                          marginTop={20}
                          label="Delivers"
                          showLabels
                          restaurantSlug={restaurantSlug}
                        />
                      </VStack>
                    </VStack>
                  </HStack>
                </VStack>
              </VStack>
            </Theme>
          </VStack>
        </ContentScrollViewHorizontalFitted>
      )
    }
  )
)
