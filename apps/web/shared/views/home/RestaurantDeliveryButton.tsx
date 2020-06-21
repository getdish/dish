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
      <HoverablePopover
        contents={
          <VStack>
            {sources.map((item) => {
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
                    style={{ width: 16, height: 16, borderRadius: 40 }}
                  />
                  <Spacer size={6} />
                  <Text ellipse fontSize={12} opacity={0.5}>
                    {item.name}
                  </Text>
                </HStack>
              )
            })}
          </VStack>
        }
      >
        <SmallButton>Delivers</SmallButton>
      </HoverablePopover>
    )
  }
)
