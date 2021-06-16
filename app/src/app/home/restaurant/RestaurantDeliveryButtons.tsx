import { graphql } from '@dish/graph'
import React, { memo } from 'react'
import { Paragraph } from 'snackui'
import { HStack, StackProps, Text } from 'snackui'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
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
    const [restaurant] = queryRestaurant(restaurantSlug)
    if (!restaurant) {
      return null
    }
    const sources = getRestaurantDeliverySources(restaurant.sources)

    if (!sources.length) {
      return null
    }

    return (
      <HStack flexWrap="wrap" alignItems="center" spacing="xs" {...props}>
        {!!label && (
          <Paragraph fontSize={14} color="rgba(0,0,0,0.5)" marginRight={8} y={-1}>
            {label}
          </Paragraph>
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

const RestaurantDeliveryButton = ({ source, showLabels }: Props & { source: any }) => {
  return (
    <Link href={source.url}>
      <SmallButton
        tooltip={!showLabels ? source.name : null}
        icon={
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
        }
        {...(showLabels && {
          children: source.name,
        })}
        textProps={{
          opacity: 0.7,
        }}
      />
    </Link>
  )
}