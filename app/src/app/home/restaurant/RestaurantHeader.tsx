import { graphql } from '@dish/graph'
import { Clock } from '@dish/react-feather'
import React, { Suspense, memo, useState } from 'react'
import { AbsoluteVStack, HStack, Spacer, Text, Theme, VStack, useThemeName } from 'snackui'

import { drawerBorderRadius, isWeb } from '../../../constants/constants'
import { useColorsFor } from '../../../helpers/useColorsFor'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { HomeStateItemRestaurant } from '../../../types/homeTypes'
import { useContentScrollHorizontalFitter } from '../../views/ContentScrollViewHorizontal'
import { ContentScrollViewHorizontalFitted } from '../../views/ContentScrollViewHorizontalFitted'
import { Link } from '../../views/Link'
import { PaneControlButtonsLeft } from '../../views/PaneControlButtons'
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
      const [restaurant] = queryRestaurant(restaurantSlug)
      if (!restaurant) {
        return null
      }
      const open = openingHours(restaurant)
      const paddingPx = size === 'sm' ? 10 : 30
      const spacer = <Spacer size={paddingPx} />
      const nameLen = restaurant.name?.length ?? 10
      const { width, drawerWidth, minWidth, setWidthDebounce } = useContentScrollHorizontalFitter()
      const scale = width < 601 ? 0.7 : drawerWidth < 700 ? 0.85 : 1
      const fontScale = size === 'sm' ? 0.9 : 1.3
      const fontSizeBase =
        nameLen > 40 ? 18 : nameLen > 30 ? 22 : nameLen > 24 ? 26 : nameLen > 16 ? 28 : 32
      const fontSize = scale * fontSizeBase * fontScale
      const restaurantId = restaurant.id
      const [hasScrolled, setHasScrolled] = useState(false)
      const colors = useColorsFor(restaurantSlug)
      const themeName = useThemeName()

      const content = (
        <>
          <PaneControlButtonsLeft>
            <Suspense fallback={null}>
              <RestaurantAddToListButton floating restaurantSlug={restaurantSlug} />
            </Suspense>
            <Suspense fallback={null}>
              <RestaurantFavoriteStar floating size="lg" restaurantId={restaurantId} />
            </Suspense>
          </PaneControlButtonsLeft>

          <Theme name={themeName === 'dark' ? `${colors.name}-dark` : colors.name}>
            <VStack
              paddingTop={0}
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
                <HStack paddingLeft={20} alignItems="flex-end" position="relative">
                  <VStack marginRight={-15} marginBottom={-5} zIndex={200}>
                    <Theme name="light">
                      <RestaurantRatingView floating size={66} slug={restaurantSlug} />
                    </Theme>
                  </VStack>

                  <HStack
                    // backgroundColor={colors.themeColorAlt}
                    y={10}
                    backgroundColor={colors.themeColorAlt}
                    shadowColor="#000"
                    shadowOpacity={0.2}
                    marginRight={-30}
                    pointerEvents="auto"
                    shadowRadius={5}
                    shadowOffset={{ height: 3, width: 0 }}
                    borderRadius={10}
                    paddingHorizontal={20}
                    paddingVertical={9}
                    alignItems="center"
                    position="relative"
                    zIndex={199}
                    justifyContent="center"
                    minWidth={100}
                    skewX="-12deg"
                  >
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

                <Spacer size="lg" />

                {/* below title row */}
                <HStack pointerEvents="auto" flex={1} alignItems="flex-start" minWidth={280}>
                  {spacer}
                  <VStack flex={10}>
                    <VStack pointerEvents="auto" overflow="hidden" paddingRight={20}>
                      <HStack alignItems="center" maxWidth="100%" minHeight={55}>
                        <Theme name={themeName === 'dark' ? `${colors.name}-dark` : null}>
                          <Suspense fallback={null}>
                            <HStack marginBottom={10}>
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
                                  opacity: 0.5,
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

                            <Spacer />

                            <HStack maxWidth={300} overflow="hidden" minWidth={1600} y={-3}>
                              <RestaurantTagsRow
                                exclude={['dish']}
                                restaurantSlug={restaurantSlug}
                                restaurantId={restaurantId}
                                spacing={10}
                                max={8}
                                size="lg"
                              />
                            </HStack>
                          </Suspense>
                        </Theme>
                      </HStack>

                      {afterAddress}
                    </VStack>
                  </VStack>
                </HStack>

                {/* <VStack pointerEvents="auto" paddingRight={20}>
                  <Theme name={themeName}>
                    <RestaurantOverview
                      isDishBot
                      maxLines={6}
                      size="lg"
                      restaurantSlug={restaurantSlug}
                    />
                  </Theme>
                </VStack> */}
              </VStack>
            </VStack>
          </Theme>
        </>
      )

      if (!isWeb) {
        return content
      }

      return (
        <ContentScrollViewHorizontalFitted
          onScroll={hasScrolled ? undefined : () => setHasScrolled(true)}
          width={width}
          setWidth={setWidthDebounce}
        >
          {content}
        </ContentScrollViewHorizontalFitted>
      )
    },
    {
      suspense: false,
    }
  )
)
