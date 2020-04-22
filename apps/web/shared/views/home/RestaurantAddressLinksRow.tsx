import { Restaurant } from '@dish/models'
import React, { memo } from 'react'
import { Image, Linking, Text } from 'react-native'

import { GeocodePlace, HomeStateItem } from '../../state/home'
import { Box } from '../ui/Box'
import { HoverablePopover } from '../ui/HoverablePopover'
import { Link } from '../ui/Link'
import { HStack } from '../ui/Stacks'

type AddressSize = 'lg' | 'md' | 'sm'

function formatAddress(
  currentLocation: GeocodePlace | null,
  address: string,
  format: AddressSize
): string {
  if (format === 'lg') {
    return removeLongZip(address)
  }
  if (format === 'md' || !currentLocation) {
    return removeZip(removeLongZip(address))
  }
  if (currentLocation?.locality) {
    const replaceAfter = `, ${currentLocation.locality ?? ''}`
    const replaceIndex = address.indexOf(replaceAfter)
    if (replaceIndex > 0) {
      return address.slice(0, replaceIndex)
    }
  }
  return removeLongZip(address).split(',').slice(0, 1).join(', ')
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

export const RestaurantAddressLinksRow = memo(
  ({
    currentLocationInfo,
    restaurant,
    size,
    showAddress,
    showMenu,
  }: {
    currentLocationInfo: GeocodePlace
    restaurant: Restaurant
    size?: AddressSize
    showAddress?: AddressSize
    showMenu?: boolean
  }) => {
    const fontSize = size == 'lg' ? 16 : 13
    const sep = ' '

    return (
      <Text style={{ color: '#999', fontSize }}>
        <HStack alignItems="center" spacing>
          {showAddress && (
            <Text selectable style={{ fontSize: 14 }}>
              {formatAddress(currentLocationInfo, restaurant.address, size)}
            </Text>
          )}

          <HoverablePopover
            position="right"
            contents={
              <Box>
                <Text>
                  <ul>
                    <li>123</li>
                  </ul>
                </Text>
              </Box>
            }
          >
            <HStack alignItems="center" spacing="xs">
              {showMenu && (
                <Text selectable>
                  Text {showAddress ? <>&nbsp; {sep} &nbsp;</> : null}
                  <Link inline name="restaurant" params={{ slug: '' }}>
                    Menu
                  </Link>
                </Text>
              )}
              {!!restaurant.website && (
                <Text onPress={() => {}}> 📞{size == 'lg' ? `Call` : ''}</Text>
              )}
              {!!restaurant.website && (
                <Text onPress={() => Linking.openURL(restaurant.website)}>
                  🔗{size == 'lg' ? `Website` : ''}
                </Text>
              )}
              {!!restaurant.website && (
                <Text onPress={() => Linking.openURL(restaurant.website)}>
                  <Image
                    source={require('../../assets/instagram.png')}
                    style={{
                      width: fontSize * 1.25,
                      height: fontSize * 1.25,
                      marginVertical: -fontSize * 0.26,
                      marginLeft: 4,
                    }}
                  />
                </Text>
              )}
            </HStack>
          </HoverablePopover>
        </HStack>
      </Text>
    )
  }
)
