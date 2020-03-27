import React from 'react'
import { Image, Text, Linking } from 'react-native'
import { Restaurant } from '@dish/models'
import { HStack } from '../shared/Stacks'
import { Link } from '../shared/Link'
import { Popover } from '../shared/Popover'
import { Icon } from '../shared/Icon'

export const RestaurantMetaRow = ({
  restaurant,
  size,
  showAddress,
  showMenu,
}: {
  restaurant: Restaurant
  size?: 'lg' | 'md'
  showAddress?: boolean
  showMenu?: boolean
}) => {
  const fontSize = size == 'lg' ? 16 : 14
  const sep = ' '
  return (
    <HStack alignItems="center">
      <Text style={{ opacity: 0.6, fontSize }}>
        {showAddress && <>3017 16th St.</>}
        {showMenu && (
          <>
            {showAddress ? <>&nbsp; {sep} &nbsp;</> : null}
            <Link inline name="restaurant" params={{ slug: '' }}>
              Menu
            </Link>
          </>
        )}
        {!!restaurant.website && (
          <Text onPress={() => {}}>
            &nbsp; {sep} &nbsp; 📞{size == 'lg' ? `Call` : ''}
          </Text>
        )}
        {!!restaurant.website && (
          <Text onPress={() => Linking.openURL(restaurant.website)}>
            &nbsp; {sep} &nbsp; 🔗{size == 'lg' ? `Website` : ''}
          </Text>
        )}
        {!!restaurant.website && (
          <Text onPress={() => Linking.openURL(restaurant.website)}>
            &nbsp; {sep} &nbsp;
            <Image
              source={require('../../assets/instagram.png')}
              style={{
                width: fontSize * 1.25,
                height: fontSize * 1.25,
                marginVertical: -fontSize * 0.26,
                marginLeft: 4,
              }}
            />
          </Text>
        )}
      </Text>
    </HStack>
  )
}
