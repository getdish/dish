import { graphql, query } from '@dish/graph'
import { HStack, Text } from '@dish/ui'
import React, { memo } from 'react'

import { SmallButton } from '../../views/ui/SmallButton'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'

export const RestaurantDeliveryButton = memo(
  graphql(({ restaurantId }: { restaurantId: string }) => {
    const [restaurant] = query.restaurant({
      where: {
        id: {
          _eq: restaurantId,
        },
      },
    })
    const sources2 = restaurant.sources()
    if (sources2 && Object.keys(sources2).length) {
      console.log('todo', sources2)
      debugger
    }
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
                <img
                  src={item.image}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 40,
                    marginTop: -8,
                    marginBottom: -8,
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
  })
)
