import { Restaurant } from '@dish/models'
import React, { memo } from 'react'
import { Image, Linking, Text } from 'react-native'

import { Box } from '../ui/Box'
import { Divider } from '../ui/Divider'
import { HoverablePopover } from '../ui/HoverablePopover'
import { Link } from '../ui/Link'
import { HStack } from '../ui/Stacks'
import { HoverableButton } from './HoverableButton'
import { RestaurantTagsRow } from './RestaurantTagsRow'

export const RestaurantAddressLinksRow = memo(
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
    const fontSize = size == 'lg' ? 16 : 13
    const sep = ' '

    return (
      <Text style={{ color: '#999', fontSize }}>
        <HStack alignItems="center" spacing="xs">
          {showAddress && (
            <Text style={{ fontSize: 14 }}>{restaurant.address}</Text>
          )}

          <HoverablePopover
            position="right"
            contents={
              <Box>
                <Text>
                  <ul>
                    <li>123</li>
                  </ul>
                </Text>
              </Box>
            }
          >
            <HStack alignItems="center" spacing="xs">
              {showMenu && (
                <Text>
                  Text {showAddress ? <>&nbsp; {sep} &nbsp;</> : null}
                  <Link inline name="restaurant" params={{ slug: '' }}>
                    Menu
                  </Link>
                </Text>
              )}
              {!!restaurant.website && (
                <Text onPress={() => {}}> 📞{size == 'lg' ? `Call` : ''}</Text>
              )}
              {!!restaurant.website && (
                <Text onPress={() => Linking.openURL(restaurant.website)}>
                  🔗{size == 'lg' ? `Website` : ''}
                </Text>
              )}
              {!!restaurant.website && (
                <Text onPress={() => Linking.openURL(restaurant.website)}>
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
            </HStack>
          </HoverablePopover>
        </HStack>
      </Text>
    )
  }
)
