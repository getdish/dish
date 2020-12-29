import { graphql } from '@dish/graph'
import {
  AlignCenter,
  ExternalLink,
  Link2,
  PhoneCall,
} from '@dish/react-feather'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'
import { Box, HStack, HoverablePopover, Text, VStack } from 'snackui'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { GeocodePlace } from '../../state/home-types'
import { SmallCircleButton } from '../../views/CloseButton'
import { SmallButton } from '../../views/SmallButton'

export type AddressSize = 'lg' | 'md' | 'sm' | 'xs'

export const RestaurantAddressLinksRow = memo(
  graphql(
    ({
      currentLocationInfo,
      restaurantSlug,
      size,
      showAddress,
      showMenu,
    }: {
      currentLocationInfo?: GeocodePlace | null
      restaurantSlug: string
      size?: AddressSize
      showAddress?: AddressSize
      showMenu?: boolean
    }) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const fontSize = size == 'lg' ? 16 : 14
      const iconSize = size === 'lg' ? 18 : 16

      const linkElements = (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ maxWidth: '100%' }}
        >
          <HStack alignItems="center" spacing="xs">
            {showMenu && !!restaurant.website && (
              <SmallButton
                backgroundColor="transparent"
                tooltip="Menu"
                href={restaurant.website ?? ''}
              >
                <AlignCenter size={iconSize} />
              </SmallButton>
            )}
            {!!restaurant.telephone && (
              <SmallButton
                backgroundColor="transparent"
                tooltip="Call"
                href={`tel:${restaurant.telephone}`}
              >
                <PhoneCall size={iconSize} />
              </SmallButton>
            )}
            {!!restaurant.website && (
              <SmallButton
                backgroundColor="transparent"
                tooltip="Website"
                href={restaurant.website ?? ''}
              >
                <Link2 size={iconSize} />
              </SmallButton>
            )}
            {/* <RestaurantDeliveryButtons
              showLabels
              restaurantSlug={restaurantSlug}
            /> */}
          </HStack>
        </ScrollView>
      )

      return (
        <Text color="#999" fontSize={fontSize}>
          <VStack>
            {!!(currentLocationInfo && showAddress) && (
              <Text selectable ellipse fontSize={14} maxWidth={190}>
                {getAddressText(
                  currentLocationInfo,
                  restaurant.address ?? '',
                  (typeof showAddress === 'string' ? showAddress : size) ?? 'sm'
                )}
              </Text>
            )}

            {size === 'sm' && (
              <HoverablePopover
                position="right"
                allowHoverOnContent
                noArrow
                contents={<Box padding={10}>{linkElements}</Box>}
              >
                <SmallCircleButton>
                  <ExternalLink size={10} color="#fff" />
                </SmallCircleButton>
              </HoverablePopover>
            )}

            {size !== 'sm' && linkElements}
          </VStack>
        </Text>
      )
    }
  )
)

const replaceAddressPostfix = (address: string, postfix: string) => {
  const replaceAfter = `, ${postfix}`
  const replaceIndex = address.indexOf(replaceAfter)
  if (replaceIndex > 0) {
    return address.slice(0, replaceIndex).split(',')[0]
  }
  return address
}

export function getAddressText(
  currentLocation: GeocodePlace | null,
  address: string,
  format: AddressSize
): string {
  if (typeof address !== 'string') {
    return ''
  }
  if (format === 'xs') {
    return address.split(', ')[0]
  }
  if (format === 'lg') {
    return removeLongZip(address)
  }
  if (format === 'md' || !currentLocation) {
    return removeZip(removeLongZip(address))
  }
  if (currentLocation?.state) {
    address = replaceAddressPostfix(address, currentLocation?.state)
  }
  if (currentLocation?.country) {
    address = replaceAddressPostfix(address, currentLocation?.country)
  }
  if (currentLocation?.fullName) {
    address = replaceAddressPostfix(address, currentLocation?.fullName)
  }
  return removeLongZip(address).split(',')[0]
}

const removeLongZip = (str: string) => {
  const lastDashIndex = str.lastIndexOf('-')
  const lastDashDistanceToEnd = str.length - lastDashIndex
  if (lastDashDistanceToEnd > 7) return str
  const specificZip = str.slice(lastDashIndex)
  if (/[-0-9]+/.test(specificZip)) {
    return str.slice(0, lastDashIndex)
  }
  return str
}

const removeZip = (str: string) =>
  str.replace(/,(\s[A-Z]{2})?[\s]+([0-9\-]+$)/g, '')
