import { HStack, HoverablePopover, Spacer, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { Image } from 'react-native'

import { SmallButton } from './SmallButton'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'

export const RestaurantDeliveryButton = memo(
  ({ restaurantId }: { restaurantId: string }) => {
    const sources = Object.values(thirdPartyCrawlSources).filter(
      (item) => item.delivery
    )
    return (
      <SmallButton paddingRight={0}>
        <HStack>
          <Text marginRight={5}>Delivery</Text>
          {sources.map((item, i) => {
            return (
              <HStack
                key={item.name}
                paddingVertical={4}
                hoverStyle={{
                  backgroundColor: '#f2f2f2',
                }}
              >
                <Image
                  source={item.image}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 40,
                    marginVertical: -8,
                    marginRight: -8,
                    borderWidth: 1,
                    borderColor: '#fff',
                    zIndex: 10 - i,
                  }}
                />
                {/* <Spacer size={6} />
                <Text ellipse fontSize={12} opacity={0.5}>
                  {item.name}
                </Text> */}
              </HStack>
            )
          })}
        </HStack>
      </SmallButton>
    )
  }
)
