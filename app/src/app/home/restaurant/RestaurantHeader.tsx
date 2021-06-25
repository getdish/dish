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
  useThemeName,
} from 'snackui'

import { drawerBorderRadius, isWeb } from '../../../constants/constants'
import { useColorsFor } from '../../../helpers/useColorsFor'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { HomeStateItemRestaurant } from '../../../types/homeTypes'
import { CommentBubble } from '../../views/CommentBubble'
import { useContentScrollHorizontalFitter } from '../../views/ContentScrollViewHorizontal'
import { ContentScrollViewHorizontalFitted } from '../../views/ContentScrollViewHorizontalFitted'
import { Link } from '../../views/Link'
import { LogoCircle } from '../../views/Logo'
import { PaneControlButtonsLeft } from '../../views/PaneControlButtons'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { SmallButton } from '../../views/SmallButton'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantAddToListButton } from './RestaurantAddToListButton'
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
      const open = openingHours(restaurant)
      const paddingPx = size === 'sm' ? 10 : 30
      const spacer = <Spacer size={paddingPx} />
      const nameLen = restaurant.name?.length ?? 10
      const { width, drawerWidth, minWidth, setWidthDebounce } = useContentScrollHorizontalFitter()
      const scale = width < 601 ? 0.7 : drawerWidth < 700 ? 0.85 : 1
      const fontScale = size === 'sm' ? 0.8 : 1
      const fontSizeBase =
        nameLen > 40 ? 24 : nameLen > 30 ? 26 : nameLen > 24 ? 30 : nameLen > 18 ? 34 : 40
      const fontSize = scale * fontSizeBase * fontScale
      const restaurantId = restaurant.id
      const [photoWidth, setPhotoWidth] = useState(width * 0.5)
      const [hasScrolled, setHasScrolled] = useState(false)
      const colors = useColorsFor(restaurantSlug)
      const themeName = useThemeName()
      // const theme = useTheme()

      const content = (
        <VStack>
          <PaneControlButtonsLeft>
            <Suspense fallback={null}>
              <RestaurantAddToListButton restaurantSlug={restaurantSlug} />
            </Suspense>
            <Suspense fallback={null}>
              <RestaurantFavoriteStar size="lg" restaurantId={restaurantId} />
            </Suspense>
          </PaneControlButtonsLeft>

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
              y={1}
            >
              <LinearGradient
                style={[StyleSheet.absoluteFill]}
                colors={[
                  // `${colors.themeColorAlt}aa`,
                  `${colors.themeColor}00`,
                  // `${colors.themeColor}00`,
                  colors.themeColor,
                ]}
              />
            </AbsoluteVStack>
          </AbsoluteVStack>

          <Theme name={themeName === 'dark' ? `${colors.name}-dark` : colors.name}>
            <VStack
              marginTop={160}
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
                <HStack paddingLeft={20} alignItems="center" position="relative">
                  <AbsoluteVStack y={-35} x={-10} zIndex={10}>
                    <Theme name="light">
                      <RestaurantRatingView floating size={62} slug={restaurantSlug} />
                    </Theme>
                  </AbsoluteVStack>
                  <Spacer size="lg" />
                  <HStack
                    backgroundColor={colors.themeColorAlt}
                    shadowColor="#000"
                    shadowOpacity={0.2}
                    pointerEvents="auto"
                    shadowRadius={5}
                    shadowOffset={{ height: 3, width: 0 }}
                    borderRadius={16}
                    paddingHorizontal={30}
                    paddingVertical={9}
                    alignItems="center"
                    justifyContent="center"
                    minWidth={100}
                    skewX="-12deg"
                  >
                    <HStack skewX="12deg">
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

                <Spacer size="lg" />

                {/* below title row */}
                <HStack pointerEvents="auto" flex={1} alignItems="flex-start" minWidth={280}>
                  {spacer}
                  <VStack flex={10}>
                    <VStack pointerEvents="auto" overflow="hidden" paddingRight={20}>
                      <HStack alignItems="center" flexWrap="wrap" maxWidth="100%" minHeight={55}>
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
                          </Suspense>
                        </Theme>
                      </HStack>

                      {afterAddress}
                    </VStack>
                  </VStack>
                </HStack>

                {/* OVERVIEW - DISH BOT */}

                {/* overview bubble */}
                <VStack paddingRight={20}>
                  {/* keeps text color of background instead of header theme */}
                  <Theme name={themeName}>
                    <RestaurantOverview
                      isDishBot
                      maxLines={6}
                      size="lg"
                      restaurantSlug={restaurantSlug}
                    />
                  </Theme>
                </VStack>
              </VStack>
            </VStack>
          </Theme>
        </VStack>
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
