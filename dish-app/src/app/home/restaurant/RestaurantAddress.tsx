import { MapPin } from '@dish/react-feather'
import React from 'react'
import { useMedia } from 'snackui'

import { GeocodePlace } from '../../../types/homeTypes'
import { SmallButton } from '../../views/SmallButton'
import { AddressSize, getAddressText } from './RestaurantAddressLinksRow'

export const RestaurantAddress = ({
  color = 'rgba(125,125,125,1)',
  address,
  curLocInfo,
  size = 'xs',
}: {
  size: AddressSize
  address: string
  curLocInfo: GeocodePlace | null
  color?: string
}) => {
  const media = useMedia()
  return (
    <SmallButton
      maxWidth={media.sm ? 160 : 200}
      borderWidth={0}
      icon={<MapPin color={color} size={16} style={{ opacity: 0.5 }} />}
      textProps={{
        opacity: 0.5,
      }}
      href={`https://www.google.com/maps/search/?q=${encodeURIComponent(
        address
      )}`}
    >
      {getAddressText(curLocInfo, address, size)}
    </SmallButton>
  )
}
