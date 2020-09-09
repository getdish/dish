import { graphql } from '@dish/graph'
import { HStack, Spacer, Text, Tooltip } from '@dish/ui'
import React, { memo } from 'react'

import { bgLight } from '../../colors'
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
      <HStack flexWrap="wrap" alignItems="center">
        {!!props.label && (
          <Text
            fontSize={18}
            color="rgba(0,0,0,0.7)"
            marginRight={12}
            transform={[{ translateY: -1 }]}
          >
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
        marginTop: 2,
      }}
    >
      <HStack
        padding={4}
        paddingHorizontal={4}
        marginHorizontal={-4}
        borderRadius={100}
        hoverStyle={{
          backgroundColor: bgLight,
        }}
      >
        <img
          className="greyed-out"
          alt={source.name}
          src={source.image}
          style={{
            width: showLabels ? 20 : 26,
            height: showLabels ? 20 : 26,
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
