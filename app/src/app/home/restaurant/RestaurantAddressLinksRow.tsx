import { graphql } from '@dish/graph'
import { ExternalLink, Link2, PhoneCall } from '@dish/react-feather'
import React, { memo } from 'react'
import { Box, HStack, HoverablePopover, Paragraph, VStack, useTheme } from 'snackui'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { GeocodePlace } from '../../../types/homeTypes'
import { SmallCircleButton } from '../../views/CloseButton'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'

export type AddressSize = 'lg' | 'md' | 'sm' | 'xs' | 'xxs'

export const RestaurantAddressLinksRow = memo(
  graphql(
    ({
      curLocInfo,
      restaurantSlug,
      size,
      showAddress,
    }: {
      curLocInfo?: GeocodePlace | null
      restaurantSlug: string
      size?: AddressSize
      showAddress?: AddressSize
    }) => {
      const [restaurant] = queryRestaurant(restaurantSlug)
      // const fontSize = size == 'lg' ? 16 : 14
      const iconSize = size === 'lg' ? 18 : 16
      const theme = useTheme()
      const iconColor = theme.color

      if (!restaurant) {
        return null
      }

      const linkElements = (
        <HStack alignItems="center" spacing="xs">
          {!!restaurant.telephone && (
            <Link href={`tel:${restaurant.telephone}`}>
              <SmallButton
                borderWidth={0}
                tooltip="Call"
                icon={<PhoneCall color={iconColor} size={iconSize} />}
              />
            </Link>
          )}
          {!!restaurant.website && (
            <Link href={restaurant.website ?? ''}>
              <SmallButton
                borderWidth={0}
                tooltip="Website"
                icon={<Link2 color={iconColor} size={iconSize} />}
              />
            </Link>
          )}
        </HStack>
      )

      return (
        <VStack>
          {!!(curLocInfo && showAddress) && size !== 'xs' && (
            <Paragraph color={theme.color} selectable ellipse fontSize={12} maxWidth={240}>
              {getAddressText(
                curLocInfo,
                restaurant.address ?? '',
                (typeof showAddress === 'string' ? showAddress : size) ?? 'sm'
              )}
            </Paragraph>
          )}

          {size === 'sm' ||
            (size === 'xs' && (
              <HoverablePopover
                position="right"
                allowHoverOnContent
                noArrow
                contents={<Box padding={10}>{linkElements}</Box>}
              >
                <SmallCircleButton>
                  <ExternalLink size={size === 'xs' ? 14 : 10} color={iconColor} />
                </SmallCircleButton>
              </HoverablePopover>
            ))}

          {size !== 'sm' && linkElements}
        </VStack>
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

const removeZip = (str: string) => str.replace(/,(\s[A-Z]{2})?[\s]+([0-9\-]+$)/g, '')
