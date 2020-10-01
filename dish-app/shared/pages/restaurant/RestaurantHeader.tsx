import { graphql } from '@dish/graph'
import { MessageSquare } from '@dish/react-feather'
import { HStack, SmallTitle, Spacer, StackProps, Text, VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'
import { Image, ScrollView } from 'react-native'

import { drawerBorderRadius } from '../../constants'
import { useIsReallyNarrow } from '../../hooks/useIs'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { HomeStateItemRestaurant } from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { LinkButton } from '../../views/ui/LinkButton'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantFavoriteButton } from './RestaurantFavoriteButton'
import { RestaurantPhotosRow } from './RestaurantPhotosRow'
import RestaurantRatingView from './RestaurantRatingView'

type RestaurantHeaderProps = {
  state?: HomeStateItemRestaurant
  restaurantSlug: any
  after?: any
  afterAddress?: any
  size?: 'sm' | 'md'
  showImages?: boolean
}

export const RestaurantHeader = (props: RestaurantHeaderProps) => {
  return (
    <Suspense
      fallback={
        <VStack
          width="100%"
          height={138}
          borderBottomColor="#ddd"
          borderBottomWidth={1}
        />
      }
    >
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
      afterAddress,
      showImages,
      size,
    }: RestaurantHeaderProps) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const om = useOvermind()
      // const [r, g, b] = useCurrentLenseColor()
      const paddingPx = size === 'sm' ? 10 : 30
      const spacer = <Spacer size={paddingPx} />
      const restaurantId = state?.restaurantId ?? restaurant.id
      const nameLen = restaurant.name?.length
      return (
        <VStack width="100%">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              width: '100%',
            }}
            contentContainerStyle={{
              minWidth: '100%',
            }}
          >
            <VStack
              borderTopRightRadius={drawerBorderRadius - 1}
              borderTopLeftRadius={drawerBorderRadius - 1}
              maxWidth="100%"
              position="relative"
              // paddingVertical={15}
            >
              <HStack alignItems="flex-end">
                <HStack
                  maxWidth={480}
                  paddingTop={paddingPx * 1.5}
                  alignItems="center"
                >
                  {spacer}
                  <HStack position="relative">
                    <RestaurantRatingView
                      size="lg"
                      restaurantSlug={restaurantSlug}
                    />
                  </HStack>
                  <Spacer size={20} />
                  <VStack flex={10}>
                    <Text
                      selectable
                      lineHeight={42}
                      fontSize={
                        (nameLen > 24 ? 26 : nameLen > 18 ? 30 : 36) *
                        (size === 'sm' ? 0.8 : 1)
                      }
                      fontWeight="700"
                    >
                      {restaurant.name}
                    </Text>
                    <Spacer size="sm" />
                    <HStack alignItems="center" paddingRight={20}>
                      <VStack>
                        <RestaurantAddressLinksRow
                          currentLocationInfo={
                            state?.currentLocationInfo ??
                            om.state.home.currentState.currentLocationInfo
                          }
                          showMenu
                          size="lg"
                          restaurantSlug={restaurantSlug}
                        />
                        <Spacer size="md" />
                        <RestaurantAddress
                          size="sm"
                          address={restaurant.address ?? ''}
                          currentLocationInfo={
                            state?.currentLocationInfo ?? null
                          }
                        />
                        {afterAddress}
                        {spacer}
                      </VStack>
                    </HStack>
                  </VStack>
                </HStack>

                {showImages && (
                  <>
                    <Spacer size={40} />
                    <VStack borderBottomLeftRadius={30} overflow="hidden">
                      <RestaurantPhotosRow restaurantSlug={restaurantSlug} />
                    </VStack>
                  </>
                )}
              </HStack>
            </VStack>
          </ScrollView>
          <SmallTitle marginTop={-23} marginBottom={0} divider="center">
            <HStack spacing="lg">
              <CircleButton>
                <Suspense fallback={null}>
                  <RestaurantFavoriteButton
                    restaurantId={restaurantId}
                    size="lg"
                  />
                </Suspense>
              </CircleButton>

              <CircleButton>
                <LinkButton
                  name="restaurantReview"
                  params={{ slug: restaurantSlug }}
                  padding={8}
                >
                  <MessageSquare size={20} color="rgba(0,0,0,0.3)" />
                </LinkButton>
              </CircleButton>
            </HStack>
          </SmallTitle>
        </VStack>
      )
    }
  )
)

const CircleButton = (props: StackProps) => {
  return (
    <VStack
      borderRadius={1000}
      shadowColor="rgba(0,0,0,0.1)"
      backgroundColor="#fff"
      shadowRadius={8}
      width={44}
      height={44}
      alignItems="center"
      justifyContent="center"
      shadowOffset={{ height: 2, width: 0 }}
      borderWidth={1}
      borderColor="transparent"
      hoverStyle={{
        borderColor: '#aaa',
      }}
      {...props}
    />
  )
}
