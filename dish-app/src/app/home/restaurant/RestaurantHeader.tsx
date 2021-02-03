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
  VStack,
} from 'snackui'

import { drawerBorderRadius } from '../../../constants/constants'
import { useColorsFor } from '../../../helpers/useColorsFor'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { HomeStateItemRestaurant } from '../../../types/homeTypes'
import {
  ContentScrollViewHorizontalFitted,
  useContentScrollHorizontalFitter,
} from '../../views/ContentScrollViewHorizontal'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantTagsRow } from '../../views/restaurant/RestaurantTagsRow'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { SmallButton } from '../../views/SmallButton'
import { RestaurantAddCommentButton } from './RestaurantAddCommentButton'
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
  after?: any
  afterAddress?: any
  size?: 'sm' | 'md'
  below?: any
  showImages?: boolean
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
    ({
      state,
      restaurantSlug,
      after,
      below,
      afterAddress,
      showImages,
      minHeight,
      size,
    }: RestaurantHeaderProps) => {
      const [restaurant] = queryRestaurant(restaurantSlug)
      const [open_text, open_color, next_time] = openingHours(restaurant)
      const paddingPx = size === 'sm' ? 10 : 30
      const spacer = <Spacer size={paddingPx} />
      const nameLen = restaurant.name?.length
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
          ? 16
          : nameLen > 30
          ? 20
          : nameLen > 24
          ? 28
          : nameLen > 18
          ? 34
          : 40
      const fontSize = scale * fontSizeBase * fontScale
      const contentLeftWidth = width - 60
      const restaurantId = restaurant.id
      const photoWidth = width * 0.5
      const [hasScrolled, setHasScrolled] = useState(false)
      const colors = useColorsFor(restaurant.name)

      return (
        <ContentScrollViewHorizontalFitted
          onScroll={hasScrolled ? undefined : () => setHasScrolled(true)}
          width={width}
          setWidth={setWidthDebounce}
        >
          <VStack>
            <AbsoluteVStack zIndex={0} pointerEvents="auto">
              <RestaurantPhotosRow
                restaurantSlug={restaurantSlug}
                width={photoWidth}
                height={170}
                escalating
                showEscalated={hasScrolled}
              />
              <AbsoluteVStack
                left={0}
                right={0}
                height={170 + 21}
                width={width}
                pointerEvents="none"
              >
                <LinearGradient
                  style={[StyleSheet.absoluteFill]}
                  colors={[
                    `${colors.themeColorAlt}99`,
                    `${colors.themeColor}33`,
                    `${colors.themeColor}ff`,
                  ]}
                />
              </AbsoluteVStack>
            </AbsoluteVStack>
            <VStack
              marginTop={150}
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
                <HStack alignItems="center">
                  <RestaurantUpVoteDownVote
                    display="ratio"
                    restaurantSlug={restaurantSlug}
                  />
                  <Spacer size="xl" />
                  <HStack
                    backgroundColor={colors.themeColorAlt}
                    shadowColor="#000"
                    shadowOpacity={0.2}
                    pointerEvents="auto"
                    shadowRadius={5}
                    shadowOffset={{ height: 3, width: 0 }}
                    borderRadius={10}
                    paddingHorizontal={15}
                    paddingVertical={5}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      color={colors.themeColor}
                      alignSelf="flex-start"
                      selectable
                      letterSpacing={-1.2}
                      fontSize={fontSize}
                      fontWeight="800"
                    >
                      {restaurant.name}
                    </Text>
                  </HStack>
                </HStack>
                <Spacer />
                <HStack
                  pointerEvents="auto"
                  flex={1}
                  alignItems="flex-start"
                  minWidth={280}
                >
                  {spacer}
                  <VStack flex={10} overflow="hidden">
                    <Spacer size="lg" />
                    <VStack
                      pointerEvents="auto"
                      overflow="hidden"
                      paddingRight={20}
                    >
                      <HStack
                        alignItems="center"
                        flexWrap="wrap"
                        maxWidth="100%"
                      >
                        <VStack marginBottom={10}>
                          <RestaurantFavoriteStar
                            size="lg"
                            restaurantId={restaurantId}
                          />
                        </VStack>

                        <Spacer size="xs" />

                        <Suspense fallback={null}>
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
                              name="restaurantHours"
                              params={{ slug: restaurantSlug }}
                              textProps={{
                                ellipse: true,
                                color: open_color,
                              }}
                              icon={
                                <Clock
                                  size={14}
                                  color="#999"
                                  style={{ marginRight: 5 }}
                                />
                              }
                              children={`${open_text}${
                                next_time ? `(${next_time})` : ''
                              }`}
                            />
                          </VStack>
                          <Spacer size="sm" />
                          <VStack marginBottom={10}>
                            <RestaurantAddressLinksRow
                              curLocInfo={state?.curLocInfo ?? null}
                              showMenu
                              size="lg"
                              restaurantSlug={restaurantSlug}
                            />
                          </VStack>
                          <Spacer size="xs" />
                          <VStack marginBottom={10}>
                            <RestaurantDeliveryButtons
                              showLabels
                              restaurantSlug={restaurantSlug}
                            />
                          </VStack>
                          <Spacer size="xs" />
                          <HStack>
                            <Suspense fallback={null}>
                              <RestaurantAddCommentButton
                                hideLabel
                                restaurantId={restaurantId}
                                restaurantSlug={restaurantSlug}
                              />
                            </Suspense>
                            <Spacer size="xs" />
                            <Suspense fallback={null}>
                              <RestaurantAddToListButton
                                restaurantSlug={restaurantSlug}
                              />
                            </Suspense>
                          </HStack>
                        </Suspense>
                      </HStack>

                      {afterAddress}
                    </VStack>

                    <VStack>
                      <HStack marginTop={16} flexWrap="wrap">
                        <VStack
                          flex={1}
                          minWidth={280}
                          maxWidth={contentLeftWidth}
                        >
                          <HStack
                            maxHeight={80}
                            overflow="hidden"
                            flexWrap="wrap"
                          >
                            <RestaurantTagsRow
                              restaurantSlug={restaurantSlug}
                              restaurantId={restaurantId}
                              spacing={10}
                              grid
                              max={10}
                            />
                          </HStack>

                          <Spacer size="lg" />

                          <RestaurantOverview
                            fullHeight
                            size="lg"
                            restaurantSlug={restaurantSlug}
                          />
                        </VStack>
                      </HStack>
                    </VStack>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        </ContentScrollViewHorizontalFitted>
      )
    }
  )
)
