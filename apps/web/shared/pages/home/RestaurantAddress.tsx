import { Text } from '@dish/ui'

import { getAddressText } from '../../../shared/pages/home/RestaurantAddressLinksRow'
import { GeocodePlace } from '../../../shared/state/home'
import { Link } from '../../../shared/views/ui/Link'

export const RestaurantAddress = ({
  address,
  currentLocationInfo,
}: {
  address: string
  currentLocationInfo: GeocodePlace
}) => {
  return (
    <Text fontSize={14} fontWeight="300" selectable>
      <Link
        color="#999"
        target="_blank"
        href={`https://www.google.com/maps/search/?api=1&${encodeURIComponent(
          address
        )}`}
      >
        {getAddressText(currentLocationInfo, address, 'xs')}
      </Link>
    </Text>
  )
}
