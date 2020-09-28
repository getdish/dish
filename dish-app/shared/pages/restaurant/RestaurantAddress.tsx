import { MapPin } from '@dish/react-feather'
import { HStack, Text } from '@dish/ui'
import React from 'react'

import { GeocodePlace } from '../../../shared/state/home-types'
import { Link } from '../../../shared/views/ui/Link'
import { isWeb } from '../../constants'
import { useIsNarrow } from '../../hooks/useIs'
import { LinkProps, LinkSharedProps } from '../../views/ui/LinkProps'
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
      <HStack alignItems="center">
        {size !== 'xs' && (
          <MapPin
            color={color}
            size={14}
            style={{ marginBottom: -7, marginRight: 4, opacity: 0.5 }}
          />
        )}
        <Text
          color={color}
          ellipse
          lineHeight={32}
          fontSize={14}
          fontWeight="400"
          selectable
        >
          {getAddressText(currentLocationInfo, address, size)}
        </Text>
      </HStack>
    ),
  }

  if (isSmall) {
    return <SmallButton {...linkProps} />
  } else {
    return <Link {...linkProps} />
  }
}
