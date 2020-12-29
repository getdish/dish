import { graphql } from '@dish/graph'
import React, { memo } from 'react'
import { Image } from 'react-native'
import { HStack, Spacer, StackProps, Text, Tooltip } from 'snackui'

import { bgLight, blue } from '../../constants/colors'
import { isWeb } from '../../constants/constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { SmallButton } from '../../views/ui/SmallButton'
import { getRestaurantDeliverySources } from './getRestaurantDeliverySources'

type Props = StackProps & {
  restaurantSlug: string
  showLabels?: boolean
  label?: string
}

export const RestaurantDeliveryButtons = memo(
  graphql(function RestaurantDeliveryButtons({
    restaurantSlug,
    showLabels,
    label,
    ...props
  }: Props) {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const restaurantSources = restaurant.sources()
    const sources = getRestaurantDeliverySources(restaurantSources)

    if (!sources.length) {
      return null
    }

    return (
      <HStack flexWrap="wrap" alignItems="center" {...props}>
        {!!label && (
          <Text
            fontSize={14}
            color="rgba(0,0,0,0.5)"
            marginRight={8}
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
    <SmallButton backgroundColor="transparent" href={source.url}>
      <Image
        accessibilityLabel={source.name}
        source={{ uri: source.image }}
        style={{
          width: showLabels ? 20 : 24,
          height: showLabels ? 20 : 24,
          marginHorizontal: showLabels ? -2 : -6,
          marginVertical: -6,
          borderRadius: 40,
          borderWidth: 1,
          borderColor: '#fff',
        }}
      />
      {showLabels && (
        <>
          <Spacer size={8} />
          <Text opacity={1} ellipse fontSize={14} fontWeight="400" color={blue}>
            {source.name}
          </Text>
        </>
      )}
    </SmallButton>
  )

  if (source.name && !showLabels) {
    return <Tooltip contents={source.name}>{contents}</Tooltip>
  }

  return contents
}
