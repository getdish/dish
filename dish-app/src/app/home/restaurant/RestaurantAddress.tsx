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
      href={`https://www.google.com/maps/search/?q=${encodeURIComponent(address)}`}
      overflow="hidden"
    >
      <HStack alignItems="center">
        <Text
          flexShrink={0}
          flexGrow={1}
          overflow="hidden"
          maxWidth={media.sm ? 160 : 200}
          color={theme.color}
          maxHeight={20}
        >
          {getAddressText(curLocInfo, address, size)}
        </Text>
        <Spacer />
        <ExternalLink style={{ opacity: 0.5 }} color={theme.color} size={12} />
      </HStack>
    </SmallButton>
  )
}
