import { ExternalLink, MapPin } from '@dish/react-feather'
import React from 'react'
import { HStack, Spacer, Text, useMedia, useTheme } from 'snackui'

import { isWeb } from '../../../constants/constants'
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
  const theme = useTheme()
  return (
    <SmallButton
      borderWidth={0}
      icon={<MapPin color={theme.color} size={16} style={{ opacity: 0.5 }} />}
      iconAfter={<ExternalLink style={{ opacity: 0.5 }} color={theme.color} size={10} />}
      href={`https://www.google.com/maps/search/?q=${encodeURIComponent(address)}`}
      textProps={{
        maxWidth: media.sm ? 100 : 180,
        opacity: 0.6,
      }}
    >
      {getAddressText(curLocInfo, address, size)}
    </SmallButton>
  )
}
