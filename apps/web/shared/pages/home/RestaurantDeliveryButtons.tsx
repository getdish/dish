import { graphql, query } from '@dish/graph'
import { HStack, Spacer, Text, Tooltip, VStack } from '@dish/ui'
import React, { memo, useState } from 'react'

import { bgLight, bgLightHover } from '../../colors'
import { SmallButton } from '../../views/ui/SmallButton'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'
import { useRestaurantQuery } from './useRestaurantQuery'

type Props = {
  restaurantSlug: string
  showLabels?: boolean
  label?: string
}

export const RestaurantDeliveryButtons = memo(
  graphql((props: Props) => {
    const { restaurantSlug, showLabels } = props
    const restaurant = useRestaurantQuery(restaurantSlug)
    const restaurantSources = restaurant.sources()
    const sources = Object.keys(restaurantSources ?? {})
      .map((id) => ({
        ...thirdPartyCrawlSources[id],
        ...restaurantSources[id],
        id,
      }))
      .filter((x) => x?.delivery)

    if (!sources.length) {
      return null
    }

    return (
      <HStack marginBottom={-2} flexWrap="wrap" alignItems="center" flex={20}>
        {!!props.label && (
          <Text fontSize={13} color="rgba(0,0,0,0.6)" marginRight={8}>
            {props.label}
          </Text>
        )}
        {sources.map((source) => {
          return (
            <RestaurantDeliveryButton
              key={source.id}
              {...props}
              source={source}
            />
          )
        })}
      </HStack>
    )
  })
)

const RestaurantDeliveryButton = ({
  source,
  showLabels,
}: Props & { source: any }) => {
  const children = (
    <a
      key={source.name + 'button'}
      className="see-through"
      href={source.url}
      target="_blank"
      style={{
        marginBottom: 2,
      }}
    >
      <HStack paddingVertical={6} paddingHorizontal={4}>
        <img
          alt={source.name}
          src={source.image}
          style={{
            width: 20,
            height: 20,
            margin: -3,
            marginRight: 0,
            borderRadius: 40,
            borderWidth: 1,
            borderColor: '#fff',
          }}
        />
        {showLabels && (
          <>
            <Spacer size={6} />
            <Text opacity={1} ellipse fontSize={12} fontWeight="400">
              {source.name}
            </Text>
          </>
        )}
      </HStack>
    </a>
  )

  if (source.name && !showLabels) {
    return <Tooltip contents={source.name}>{children}</Tooltip>
  }

  return children
}
