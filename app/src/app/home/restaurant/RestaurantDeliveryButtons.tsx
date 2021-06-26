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
              name={source.name}
              image={source.image}
              url={source.url}
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
  url,
  name = '',
  image,
  showLabels,
}: Props & { url?: string; name?: string; image?: string }) => {
  console.log('image is', image)
  return (
    <Link href={url}>
      <SmallButton
        tooltip={!showLabels ? name : null}
        icon={
          <Image
            accessibilityLabel={name}
            source={{ uri: image }}
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
          children: name,
        })}
        textProps={{
          opacity: 0.7,
        }}
      />
    </Link>
  )
}
