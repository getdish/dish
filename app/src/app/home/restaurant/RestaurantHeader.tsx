import { graphql } from '@dish/graph'
import { Clock } from '@dish/react-feather'
import React, { Suspense, memo, useState } from 'react'
import {
  AbsoluteVStack,
  HStack,
  Spacer,
  Text,
  Theme,
  ThemeInverse,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { drawerBorderRadius, isWeb } from '../../../constants/constants'
import { useColorsFor } from '../../../helpers/useColorsFor'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { HomeStateItemRestaurant } from '../../../types/homeTypes'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
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
      const fontScale = size === 'sm' ? 0.8 : 1.5
      const fontSizeBase =
        nameLen > 40 ? 18 : nameLen > 30 ? 22 : nameLen > 24 ? 24 : nameLen > 16 ? 26 : 32
      const fontSize = Math.round(scale * fontSizeBase * fontScale)
      // const restaurantId = restaurant.id
      const [hasScrolled, setHasScrolled] = useState(false)
      // const colors = useColorsFor(restaurantSlug)
      const theme = useTheme()

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
              {/* below title row */}
              <ContentScrollViewHorizontal>
                <VStack>
                  {/* title row */}
                  <HStack paddingLeft={20} alignItems="flex-end" position="relative">
                    <VStack width={66} height={66} marginRight={-15} marginBottom={0} zIndex={200}>
                      <Theme name={themeName}>
                        <RestaurantRatingView floating size={66} restaurant={restaurant} />
                      </Theme>
                    </VStack>

                    <HStack
                      y={10}
                      marginRight={-25}
                      pointerEvents="auto"
                      paddingHorizontal={25}
                      paddingVertical={9}
                      alignItems="center"
                      position="relative"
                      zIndex={199}
                      justifyContent="center"
                      minWidth={100}
                      // skewX="-12deg"
                    >
                      {/* <AbsoluteVStack
                    fullscreen
                    backgroundColor={colors.themeColorAlt}
                    zIndex={-1}
                    opacity={0.96}
                    borderRadius={6}
                    shadowColor="#000"
                    shadowOpacity={0.1}
                    shadowRadius={5}
                    skewX="-12deg"
                    shadowOffset={{ height: 3, width: 0 }}
                  /> */}
                      <ThemeInverse>
                        <HStack
                          display={isWeb ? 'block' : 'flex'}
                          maxWidth={280}
                          marginRight={30}
                          paddingTop={50}
                        >
                          <Text
                            className="font-title"
                            fontFamily="WhyteHeavy"
                            // backgroundColor={theme.backgroundColor}
                            // color={theme.color}
                            color={theme.backgroundColor}
                            maxWidth={500}
                            alignSelf="flex-start"
                            selectable
                            letterSpacing={-1}
                            fontSize={fontSize}
                            lineHeight={fontSize}
                            fontWeight="900"
                          >
                            {(restaurant.name || '').trim()}
                          </Text>
                        </HStack>
                      </ThemeInverse>
                    </HStack>

                    <VStack paddingTop={10}>
                      <RestaurantPhotosRow
                        // slanted
                        restaurant={restaurant}
                        spacing="sm"
                        floating
                        width={130}
                        height={150}
                        showEscalated={hasScrolled}
                      />
                    </VStack>
                  </HStack>

                  <Spacer size="md" />

                  <HStack pointerEvents="auto" flex={1} alignItems="center" minWidth={280}>
                    {spacer}
                    <VStack flex={10}>
                      <VStack pointerEvents="auto" overflow="hidden" paddingRight={20}>
                        <HStack alignItems="center" maxWidth="100%" minHeight={55}>
                          <>
                            <Suspense fallback={null}>
                              <HStack>
                                <RestaurantAddressLinksRow
                                  curLocInfo={state?.curLocInfo ?? null}
                                  size="lg"
                                  restaurantSlug={restaurantSlug}
                                />
                              </HStack>

                              <Spacer size="sm" />

                              <VStack>
                                <RestaurantAddress
                                  size="xs"
                                  address={restaurant.address ?? ''}
                                  curLocInfo={state?.curLocInfo ?? null}
                                />
                              </VStack>

                              <Spacer size="sm" />

                              <Link name="restaurantHours" params={{ slug: restaurantSlug }}>
                                <SmallButton
                                  backgroundColor="transparent"
                                  borderWidth={0}
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

                              <Spacer size="md" />

                              <RestaurantDeliveryButtons
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
                          restaurant={restaurant}
                          spacing={10}
                          maxItems={8}
                          tagButtonProps={{
                            // borderWidth: 0,
                            hideRank: false,
                            hideRating: false,
                            borderWidth: 0,
                            votable: true,
                          }}
                        />

                        <Spacer size="sm" />

                        {afterAddress}
                      </VStack>
                    </VStack>
                  </HStack>
                </VStack>
              </ContentScrollViewHorizontal>

              <VStack marginBottom={10} pointerEvents="auto">
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
