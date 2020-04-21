import { Restaurant } from '@dish/models'
import React, { memo } from 'react'
import { Image, Linking, Text } from 'react-native'

import { GeocodePlace, HomeStateItem } from '../../state/home'
import { Box } from '../ui/Box'
import { HoverablePopover } from '../ui/HoverablePopover'
import { Link } from '../ui/Link'
import { HStack } from '../ui/Stacks'

function formatAddress(
  currentLocation: GeocodePlace | null,
  address: string,
  format: 'short' | 'long' | 'longer'
): string {
  if (format === 'longer') {
    return address
  }
  if (format === 'long' || !currentLocation) {
    return removeZip(address)
  }
  if (currentLocation?.locality) {
    const replaceAfter = `, ${currentLocation.locality ?? ''}`
    const replaceIndex = address.indexOf(replaceAfter)
    if (replaceIndex > 0) {
      return address.slice(0, replaceIndex)
    }
  }
  return address
    .split(',')
    .slice(0, 1)
    .join(', ')
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
    size?: 'lg' | 'md'
    showAddress?: boolean | 'short'
    showMenu?: boolean
  }) => {
    const fontSize = size == 'lg' ? 16 : 13
    const sep = ' '

    return (
      <Text style={{ color: '#999', fontSize }}>
        <HStack alignItems="center" spacing>
          {showAddress && (
            <Text style={{ fontSize: 14 }}>
              {formatAddress(
                currentLocationInfo,
                restaurant.address,
                showAddress === 'short' ? 'short' : 'long'
              )}
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
                <Text>
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
