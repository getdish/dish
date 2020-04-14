import { Restaurant } from '@dish/models'
import React, { memo } from 'react'
import { Image, Linking, Text } from 'react-native'

import { Link } from '../ui/Link'
import { HStack } from '../ui/Stacks'

export const RestaurantMetaRow = memo(
  ({
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
)
