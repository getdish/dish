import { queryRestaurant } from '../../../queries/queryRestaurant'
import { GeocodePlace } from '../../../types/homeTypes'
import { SmallCircleButton } from '../../views/CloseButton'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
import { graphql } from '@dish/graph'
import { Card, Paragraph, TooltipSimple, XStack, YStack, useTheme } from '@dish/ui'
import { ExternalLink, Link2, PhoneCall } from '@tamagui/lucide-icons'
import React, { memo } from 'react'

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
      const theme = useTheme()
      const iconColor = theme.color

      if (!restaurant) {
        return null
      }

      const linkElements = (
        <XStack alignItems="center" space="$1">
          {!!restaurant.telephone && (
            <Link href={`tel:${restaurant.telephone}`}>
              <SmallButton borderWidth={0} tooltip="Call" icon={PhoneCall} />
            </Link>
          )}
          {!!restaurant.website && (
            <Link href={restaurant.website ?? ''}>
              <SmallButton borderWidth={0} tooltip="Website" icon={Link2} />
            </Link>
          )}
        </XStack>
      )

      return (
        <YStack>
          {!!(curLocInfo && showAddress) && size !== 'xs' && (
            <Paragraph color={theme.color} ellipse fontSize={12} maxWidth={240}>
              {getAddressText(
                curLocInfo,
                restaurant.address ?? '',
                (typeof showAddress === 'string' ? showAddress : size) ?? 'sm'
              )}
            </Paragraph>
          )}

          {size === 'sm' ||
            (size === 'xs' && (
              <TooltipSimple
                placement="right"
                label={<Card padding={10}>{linkElements}</Card>}
              >
                <SmallCircleButton icon={ExternalLink} />
              </TooltipSimple>
            ))}

          {size !== 'sm' && linkElements}
        </YStack>
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
