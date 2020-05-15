import { graphql, query } from '@dish/graph'
import React, { memo } from 'react'
import { ExternalLink } from 'react-feather'
import { Image, Linking, Text } from 'react-native'

import { GeocodePlace } from '../../state/home'
import { Box } from '../ui/Box'
import { HoverablePopover } from '../ui/HoverablePopover'
import { Link } from '../ui/Link'
import { HStack } from '../ui/Stacks'
import { SelectableText } from '../ui/Text'
import { SmallCircleButton } from './CloseButton'

type AddressSize = 'lg' | 'md' | 'sm' | 'xs'

export const RestaurantAddressLinksRow = memo(
  graphql(
    ({
      currentLocationInfo,
      restaurantSlug,
      size,
      showAddress,
      showMenu,
    }: {
      currentLocationInfo: GeocodePlace
      restaurantSlug: string
      size?: AddressSize
      showAddress?: AddressSize
      showMenu?: boolean
    }) => {
      const [restaurant] = query.restaurant({
        where: {
          slug: {
            _eq: restaurantSlug,
          },
        },
      })
      const fontSize = size == 'lg' ? 15 : 13
      const sep = ' '

      const linkElements = (
        <HStack alignItems="center" spacing={size}>
          {showMenu && (
            <SelectableText>
              {showAddress ? <>&nbsp; {sep} &nbsp;</> : null}
              <Link inline name="restaurant" params={{ slug: '' }}>
                Menu
              </Link>
            </SelectableText>
          )}
          {!!restaurant.website && <Text onPress={() => {}}>Call</Text>}
          {!!restaurant.website && (
            <Text onPress={() => Linking.openURL(restaurant.website)}>
              Website
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
      )

      return (
        <Text style={{ color: '#999', fontSize }}>
          <HStack alignItems="center" spacing>
            {showAddress && (
              <SelectableText
                numberOfLines={1}
                style={
                  { fontSize: 14, whiteSpace: 'nowrap', maxWidth: 190 } as any
                }
              >
                {getAddressText(
                  currentLocationInfo,
                  restaurant.address,
                  typeof showAddress === 'string' ? showAddress : size
                )}
              </SelectableText>
            )}

            {size === 'sm' && (
              <HoverablePopover
                position="right"
                contents={<Box>{linkElements}</Box>}
              >
                <SmallCircleButton>
                  <ExternalLink size={10} color="#fff" />
                </SmallCircleButton>
              </HoverablePopover>
            )}

            {size !== 'sm' && linkElements}
          </HStack>
        </Text>
      )
    }
  )
)

export function getAddressText(
  currentLocation: GeocodePlace | null,
  address: string,
  format: AddressSize
): string {
  if (format === 'xs') {
    return address.split(', ')[0]
  }
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
      return address.slice(0, replaceIndex).split(',')[0]
    }
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
