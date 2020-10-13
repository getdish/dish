import { MapPin } from '@dish/react-feather'
import { HStack, Text } from '@dish/ui'
import React from 'react'

import { GeocodePlace } from '../../../shared/state/home-types'
import { useIsNarrow } from '../../hooks/useIs'
import { SmallButton } from '../../views/ui/SmallButton'
import { AddressSize, getAddressText } from './RestaurantAddressLinksRow'

export const RestaurantAddress = ({
  color = 'rgba(125,125,125,1)',
  address,
  currentLocationInfo,
  size = 'xs',
}: {
  size: AddressSize
  address: string
  currentLocationInfo: GeocodePlace | null
  color?: string
}) => {
  const isSmall = useIsNarrow()
  return (
    <SmallButton
      maxWidth={isSmall ? 160 : 200}
      ellipse
      backgroundColor="transparent"
      href={`https://www.google.com/maps/search/?q=${encodeURIComponent(
        address
      )}`}
    >
      <HStack alignItems="center" maxWidth="100%">
        <MapPin color={color} size={16} style={{ opacity: 0.5 }} />
        {!isSmall && (
          <Text
            marginLeft={4}
            color={color}
            ellipse
            fontSize={14}
            fontWeight="400"
            selectable
          >
            {getAddressText(currentLocationInfo, address, size)}
          </Text>
        )}
      </HStack>
    </SmallButton>
  )
}
