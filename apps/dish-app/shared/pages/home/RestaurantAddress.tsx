import { MapPin } from '@dish/react-feather'
import { Text } from '@dish/ui'
import React from 'react'

import {
  AddressSize,
  getAddressText,
} from '../../../shared/pages/home/RestaurantAddressLinksRow'
import { GeocodePlace } from '../../../shared/state/home-types'
import { Link } from '../../../shared/views/ui/Link'

export const RestaurantAddress = ({
  color = 'rgba(125,125,125,0.8)',
  address,
  currentLocationInfo,
  size = 'xs',
}: {
  size: AddressSize
  address: string
  currentLocationInfo: GeocodePlace
  color?: string
}) => {
  return (
    <Link
      className="hover-underline"
      color={color}
      target="_blank"
      href={`https://www.google.com/maps/search/?q=${encodeURIComponent(
        address
      )}`}
    >
      {size !== 'xs' && (
        <MapPin
          color={color}
          size={14}
          opacity={0.5}
          style={{ marginBottom: -7, marginRight: 4 }}
        />
      )}
      <Text
        color={color}
        ellipse
        lineHeight={16}
        fontSize={14}
        fontWeight="400"
        selectable
      >
        {getAddressText(currentLocationInfo, address, size)}
      </Text>
    </Link>
  )
}
