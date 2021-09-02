import { ExternalLink, MapPin } from '@dish/react-feather'
import React from 'react'
import { useMedia, useTheme } from 'snackui'

import { GeocodePlace } from '../../../types/homeTypes'
import { homeStore } from '../../homeStore'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
import { AddressSize, getAddressText } from './RestaurantAddressLinksRow'

export const RestaurantAddress = ({
  address,
  curLocInfo = homeStore.currentState.curLocInfo,
  size = 'xs',
}: {
  size: AddressSize
  address: string
  curLocInfo?: GeocodePlace | null
}) => {
  const media = useMedia()
  const theme = useTheme()
  return (
    <Link href={`https://www.google.com/maps/search/?q=${encodeURIComponent(address)}`}>
      <SmallButton
        borderWidth={0}
        tooltip={
          size.endsWith('xs') || size === 'sm'
            ? getAddressText(curLocInfo || null, address, 'lg')
            : null
        }
        backgroundColor="transparent"
        icon={
          size.endsWith('xs') ? null : (
            <MapPin color={theme.color} size={size === 'xxs' ? 16 : 10} style={{ opacity: 0.5 }} />
          )
        }
        iconAfter={<ExternalLink style={{ opacity: 0.5 }} color={theme.color} size={10} />}
        textProps={{
          maxWidth: media.sm ? 100 : 140,
          opacity: 0.65,
        }}
      >
        {size !== 'xxs' && getAddressText(curLocInfo || null, address, size)}
      </SmallButton>
    </Link>
  )
}
