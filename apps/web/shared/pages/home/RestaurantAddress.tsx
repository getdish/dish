import { Text } from '@dish/ui'
import { MapPin } from 'react-feather'

import {
  AddressSize,
  getAddressText,
} from '../../../shared/pages/home/RestaurantAddressLinksRow'
import { GeocodePlace } from '../../../shared/state/home'
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
    <Text fontSize={14} fontWeight="300" selectable>
      <Link
        className="hover-underline"
        color="#999"
        target="_blank"
        href={`https://www.google.com/maps/search/?api=1&${encodeURIComponent(
          address
        )}`}
      >
        <MapPin
          size={14}
          opacity={0.5}
          style={{ marginTop: 2, marginBottom: -2, marginRight: 5 }}
        />
        {getAddressText(currentLocationInfo, address, size)}
      </Link>
    </Text>
  )
}
