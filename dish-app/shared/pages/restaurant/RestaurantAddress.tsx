import { MapPin } from '@dish/react-feather'
import { HStack, Text } from '@dish/ui'
import React from 'react'

import { GeocodePlace } from '../../../shared/state/home-types'
import { Link } from '../../../shared/views/ui/Link'
import { useIsNarrow } from '../../hooks/useIs'
import { LinkSharedProps } from '../../views/ui/LinkProps'
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
  currentLocationInfo: GeocodePlace
  color?: string
}) => {
  const isSmall = useIsNarrow()
  const linkProps: LinkSharedProps = {
    target: '_blank',
    href: `https://www.google.com/maps/search/?q=${encodeURIComponent(
      address
    )}`,
    children: (
      <HStack alignItems="center" maxWidth="100%">
        <MapPin
          color={color}
          size={16}
          style={{ marginRight: 4, opacity: 0.5 }}
        />
        <Text color={color} ellipse fontSize={14} fontWeight="400" selectable>
          {getAddressText(currentLocationInfo, address, size)}
        </Text>
      </HStack>
    ),
  }

  if (isSmall) {
    return (
      <SmallButton
        maxWidth={160}
        ellipse
        backgroundColor="transparent"
        {...linkProps}
      />
    )
  } else {
    return <Link {...linkProps} />
  }
}
