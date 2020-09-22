import { graphql } from '@dish/graph'
import { HStack, Spacer, StackProps, Text, Tooltip } from '@dish/ui'
import React, { memo } from 'react'
import { Image } from 'react-native'

import { bgLight } from '../../colors'
import { isWeb } from '../../constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { thirdPartyCrawlSources } from '../../thirdPartyCrawlSources'

type Props = StackProps & {
  restaurantSlug: string
  showLabels?: boolean
  label?: string
}

export const RestaurantDeliveryButtons = memo(
  graphql(({ restaurantSlug, showLabels, label, ...props }: Props) => {
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
      <HStack flexWrap="wrap" alignItems="center" {...props}>
        {!!label && (
          <Text
            fontSize={13}
            color="rgba(0,0,0,0.6)"
            marginRight={12}
            transform={[{ translateY: -1 }]}
          >
            {label}
          </Text>
        )}
        {sources.map((source) => {
          return (
            <RestaurantDeliveryButton
              key={source.id}
              source={source}
              restaurantSlug={restaurantSlug}
              showLabels={showLabels}
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
  const contents = (
    <HStack
      className="greyed-out"
      padding={4}
      paddingHorizontal={4}
      marginHorizontal={-4}
      borderRadius={100}
      hoverStyle={{
        backgroundColor: bgLight,
      }}
    >
      <Image
        accessibilityLabel={source.name}
        source={{ uri: source.image }}
        style={{
          width: showLabels ? 16 : 22,
          height: showLabels ? 16 : 22,
          marginHorizontal: showLabels ? 0 : -3,
          marginVertical: -6,
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
  )

  // TODO react-native temp make a better <Link /> and no conditional here
  const children = isWeb ? (
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
      {contents}
    </a>
  ) : (
    contents
  )

  if (source.name && !showLabels) {
    return <Tooltip contents={source.name}>{children}</Tooltip>
  }

  return children
}
