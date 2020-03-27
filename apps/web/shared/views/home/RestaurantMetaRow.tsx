import React from 'react'
import { Image, Text, Linking } from 'react-native'
import { Restaurant } from '@dish/models'
import { HStack } from '../shared/Stacks'
import { Link } from '../shared/Link'
import { Popover } from '../shared/Popover'

export const RestaurantMetaRow = ({
  restaurant,
  size,
}: {
  restaurant: Restaurant
  size?: 'lg' | 'md'
}) => {
  const fontSize = size == 'lg' ? 16 : 14
  return (
    <HStack alignItems="center">
      <Text style={{ opacity: 0.6, fontSize }}>
        3017 16th St. &nbsp; · &nbsp;{' '}
        <Link inline name="restaurant" params={{ slug: '' }}>
          Menu
        </Link>{' '}
        {!!restaurant.website && (
          <Text onPress={() => {}}>&nbsp; · &nbsp; 📞 Call</Text>
        )}
        {!!restaurant.website && (
          <Text onPress={() => Linking.openURL(restaurant.website)}>
            &nbsp; · &nbsp; 🔗 Website
          </Text>
        )}
        {!!restaurant.website && (
          <Text onPress={() => Linking.openURL(restaurant.website)}>
            &nbsp; · &nbsp;
            <Image
              source={require('../../assets/instagram.png')}
              style={{
                width: fontSize * 1.5,
                height: fontSize * 1.5,
                marginVertical: -fontSize * 0.45,
              }}
            />
          </Text>
        )}
      </Text>
    </HStack>
  )
}
