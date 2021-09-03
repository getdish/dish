import { graphql } from '@dish/graph'
import { Clock } from '@dish/react-feather'
import React, { Suspense, memo, useState } from 'react'
import { AbsoluteVStack, HStack, Spacer, Text, Theme, VStack, useMedia } from 'snackui'

import { drawerBorderRadius, isWeb } from '../../../constants/constants'
import { useColorsFor } from '../../../helpers/useColorsFor'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { HomeStateItemRestaurant } from '../../../types/homeTypes'
import { Link } from '../../views/Link'
import { PaneControlButtonsLeft } from '../../views/PaneControlButtons'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantTagsRow } from '../../views/restaurant/RestaurantTagsRow'
import { SmallButton } from '../../views/SmallButton'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { RestaurantAddCommentButton } from './RestaurantAddCommentReviewButton'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantAddToListButton } from './RestaurantAddToListButton'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { openingHours } from './RestaurantDetailRow'
import { RestaurantFavoriteButton } from './RestaurantFavoriteButton'
import { RestaurantPhotosRow } from './RestaurantPhotosRow'

type RestaurantHeaderProps = {
  state?: HomeStateItemRestaurant
  restaurantSlug: any
  afterAddress?: any
  size?: 'sm' | 'md'
  minHeight?: number
  themeName: string
}

export const RestaurantHeader = (props: RestaurantHeaderProps) => {
  const media = useMedia()
  return (
    <Suspense fallback={<VStack minHeight={props.minHeight} />}>
      <RestaurantHeaderContent size={media.sm ? 'sm' : 'md'} {...props} />
    </Suspense>
  )
}

const RestaurantHeaderContent = memo(
  graphql(
    ({ state, restaurantSlug, afterAddress, size, themeName }: RestaurantHeaderProps) => {
      const [restaurant] = queryRestaurant(restaurantSlug)
      if (!restaurant) {
        return null
      }
      const open = openingHours(restaurant)
      const paddingPx = size === 'sm' ? 10 : 30
      const spacer = <Spacer size={paddingPx} />
      const nameLen = restaurant.name?.length ?? 10
      // const { width, drawerWidth, minWidth, setWidthDebounce } = useContentScrollHorizontalFitter()
      const scale = 1
      // const scale = width < 601 ? 0.7 : drawerWidth < 700 ? 0.85 : 1
      const fontScale = size === 'sm' ? 0.75 : 1.25
      const fontSizeBase =
        nameLen > 40 ? 18 : nameLen > 30 ? 22 : nameLen > 24 ? 26 : nameLen > 16 ? 28 : 32
      const fontSize = Math.round(scale * fontSizeBase * fontScale)
      const restaurantId = restaurant.id
      const [hasScrolled, setHasScrolled] = useState(false)
      const colors = useColorsFor(restaurantSlug)

      const content = (
        <>
          <PaneControlButtonsLeft>
            <Suspense fallback={null}>
              <RestaurantAddCommentButton restaurantSlug={restaurantSlug} />
            </Suspense>
            <Suspense fallback={null}>
              <RestaurantAddToListButton floating restaurantSlug={restaurantSlug} />
            </Suspense>
            <Suspense fallback={null}>
              <RestaurantFavoriteButton floating size="lg" restaurantSlug={restaurantSlug} />
            </Suspense>
          </PaneControlButtonsLeft>
          <VStack
            paddingTop={0}
            // minWidth={minWidth}
            // maxWidth={width}
            borderTopRightRadius={drawerBorderRadius - 1}
            borderTopLeftRadius={drawerBorderRadius - 1}
            width="100%"
            position="relative"
            pointerEvents="none"
            zIndex={10}
          >
            <VStack flex={1}>
              {/* title row */}
              <HStack paddingLeft={20} alignItems="flex-end" position="relative">
                <VStack width={66} height={66} marginRight={-15} marginBottom={-5} zIndex={200}>
                  <Theme name={themeName}>
                    <RestaurantRatingView floating size={66} restaurant={restaurant} />
                  </Theme>
                </VStack>

                <HStack
                  y={10}
                  marginRight={-30}
                  pointerEvents="auto"
                  paddingHorizontal={20}
                  paddingVertical={9}
                  alignItems="center"
                  position="relative"
                  zIndex={199}
                  justifyContent="center"
                  minWidth={100}
                  skewX="-12deg"
                >
                  <AbsoluteVStack
                    fullscreen
                    backgroundColor={colors.themeColorAlt}
                    borderRadius={10}
                    // opacity={0.95}
                    shadowColor="#000"
                    shadowOpacity={0.2}
                    shadowRadius={5}
                    shadowOffset={{ height: 3, width: 0 }}
                  />
                  <HStack skewX="12deg">
                    <Text
                      color="#fff"
                      alignSelf="flex-start"
                      selectable
                      letterSpacing={-1}
                      fontSize={fontSize}
                      fontWeight="800"
                    >
                      {restaurant.name || ' '}
                    </Text>
                  </HStack>
                </HStack>

                <VStack width={170} height={180} />
              </HStack>

              <AbsoluteVStack fullscreen left="20%">
                <RestaurantPhotosRow
                  restaurantSlug={restaurantSlug}
                  spacing="md"
                  floating
                  width={170}
                  height={180}
                  showEscalated={hasScrolled}
                />
              </AbsoluteVStack>

              <Spacer size="xl" />

              {/* below title row */}
              <HStack pointerEvents="auto" flex={1} alignItems="flex-start" minWidth={280}>
                {spacer}
                <VStack flex={10}>
                  <VStack pointerEvents="auto" overflow="hidden" paddingRight={20}>
                    <HStack alignItems="center" maxWidth="100%" minHeight={55}>
                      <>
                        <Suspense fallback={null}>
                          <HStack marginBottom={10}>
                            <RestaurantAddressLinksRow
                              curLocInfo={state?.curLocInfo ?? null}
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

                          <Spacer size="sm" />

                          <Link
                            marginBottom={10}
                            name="restaurantHours"
                            params={{ slug: restaurantSlug }}
                          >
                            <SmallButton
                              backgroundColor="transparent"
                              borderWidth={0}
                              textProps={{
                                ellipse: true,
                                opacity: 0.65,
                              }}
                              icon={
                                <Clock
                                  size={14}
                                  color={isWeb ? 'var(--color)' : '#999'}
                                  style={{ marginRight: 5 }}
                                />
                              }
                            >
                              {`${open.text}${open.nextTime ? ` (${open.nextTime})` : ''}`}
                            </SmallButton>
                          </Link>

                          <RestaurantDeliveryButtons
                            marginTop={-8}
                            marginBottom={0}
                            marginLeft={8}
                            showLabels
                            restaurantSlug={restaurantSlug}
                          />
                        </Suspense>
                      </>
                    </HStack>

                    <Spacer size="sm" />

                    <RestaurantTagsRow
                      maxLines={2}
                      exclude={['dish']}
                      restaurantSlug={restaurantSlug}
                      restaurantId={restaurantId}
                      spacing={10}
                      maxItems={8}
                      tagButtonProps={{
                        hideRank: false,
                        hideRating: false,
                        votable: true,
                      }}
                    />

                    <Spacer size="sm" />

                    {afterAddress}
                  </VStack>
                </VStack>
              </HStack>

              <VStack pointerEvents="auto">
                <RestaurantOverview
                  isDishBot
                  maxLines={3}
                  size="lg"
                  restaurantSlug={restaurantSlug}
                />
              </VStack>
            </VStack>
          </VStack>
        </>
      )

      if (true) {
        return content
      }

      // if (!isWeb) {
      //   return content
      // }

      // return (
      //   <ContentScrollViewHorizontalFitted
      //     onScroll={hasScrolled ? undefined : () => setHasScrolled(true)}
      //     width={width}
      //     setWidth={setWidthDebounce}
      //   >
      //     {content}
      //   </ContentScrollViewHorizontalFitted>
      // )
    },
    {
      suspense: false,
    }
  )
)
