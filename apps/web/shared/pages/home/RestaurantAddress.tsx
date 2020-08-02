import { Text } from '@dish/ui'
import React from 'react'
import { MapPin } from 'react-feather'

import {
  AddressSize,
  getAddressText,
} from '../../../shared/pages/home/RestaurantAddressLinksRow'
import { GeocodePlace } from '../../../shared/state/home-types'
import { Link } from '../../../shared/views/ui/Link'

export const RestaurantAddress = ({
  address,
  currentLocationInfo,
  size = 'xs',
}: {
  size: AddressSize
  address: string
  currentLocationInfo: GeocodePlace
}) => {
  return (
    <Link
      className="hover-underline"
      color="#999"
      target="_blank"
      href={`https://www.google.com/maps/search/?q=${encodeURIComponent(
        address
      )}`}
    >
      {size !== 'xs' && (
        <MapPin
          size={14}
          opacity={0.5}
          style={{ marginBottom: -7, marginRight: 4 }}
        />
      )}
      <Text ellipse lineHeight={16} fontSize={14} fontWeight="300" selectable>
        {getAddressText(currentLocationInfo, address, size)}
      </Text>
    </Link>
  )
}
