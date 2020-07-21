import { graphql, query } from '@dish/graph'
import { HStack, Spacer, Text } from '@dish/ui'
import React, { memo, useState } from 'react'

import { bgLight, bgLightHover } from '../../colors'
import { SmallButton } from '../../views/ui/SmallButton'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'
import { useRestaurantQuery } from './useRestaurantQuery'

export const RestaurantDeliveryButton = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const [isHovered, setIsHovered] = useState(false)
    const restaurant = useRestaurantQuery(restaurantSlug)
    const restaurantSources = restaurant.sources()
    const sources = Object.keys(restaurantSources ?? {})
      .map((id) => ({
        ...thirdPartyCrawlSources[id],
        id,
      }))
      .filter((x) => x?.delivery)

    const buttonWidth = 103
    const spacing = -2
    const width = sources.length * buttonWidth + sources.length * spacing
    const framePad = 2

    return (
      <SmallButton
        position="relative"
        zIndex={1000}
        paddingRight={sources.length ? 30 : 0}
        onHoverIn={() => {
          setIsHovered(true)
        }}
        onHoverOut={() => {
          setIsHovered(false)
        }}
      >
        <HStack>
          <Text marginRight={5}>Delivery</Text>

          <HStack
            position="absolute"
            className="ease-in-out"
            top={-4}
            right={-width - framePad * 2 + (isHovered ? 26 : 40)}
            width={width + framePad * 2}
            backgroundColor={!isHovered ? 'transparent' : '#fff'}
            height={25 + framePad * 2}
            borderRadius={100}
            shadowColor={!isHovered ? 'transparent' : 'rgba(0,0,0,0.1)'}
            shadowOpacity={1}
            shadowRadius={4}
            shadowOffset={{ height: 1, width: 0 }}
          >
            {sources.map((item, i) => {
              return (
                <a
                  key={item.name}
                  className="see-through"
                  href={restaurantSources[item.id]?.url}
                  target="_blank"
                >
                  <HStack
                    flex={1}
                    className="ease-in-out-fast"
                    overflow="hidden"
                    key={item.name}
                    paddingVertical={5}
                    paddingHorizontal={8}
                    position="absolute"
                    width={buttonWidth - -spacing}
                    left={
                      (isHovered ? (buttonWidth + spacing) * i : 4 * i) +
                      framePad
                    }
                    top={framePad}
                    pointerEvents={isHovered ? 'auto' : 'none'}
                    backgroundColor={bgLight}
                    borderRadius={20}
                    hoverStyle={{
                      backgroundColor: bgLightHover,
                    }}
                    {...(!isHovered && {
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                    })}
                  >
                    <HStack>
                      <img
                        src={item.image}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 40,
                          borderWidth: 1,
                          borderColor: '#fff',
                          zIndex: 10 - i,
                        }}
                      />
                      <Spacer size={6} />
                      <Text opacity={isHovered ? 1 : 0} ellipse>
                        {item.name}
                      </Text>
                    </HStack>
                  </HStack>
                </a>
              )
            })}
          </HStack>
        </HStack>
      </SmallButton>
    )
  })
)
