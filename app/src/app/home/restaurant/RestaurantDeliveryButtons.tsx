import { graphql } from '@dish/graph'
import React, { memo } from 'react'
import { HStack, StackProps, Text, VStack, useTheme } from 'snackui'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
import { getRestaurantDeliverySources } from './getRestaurantDeliverySources'

type Props = StackProps & {
  restaurantSlug: string
  showLabels?: boolean
  label?: string | boolean
}

export const RestaurantDeliveryButtons = memo(
  graphql(function RestaurantDeliveryButtons({
    restaurantSlug,
    showLabels,
    label,
    ...props
  }: Props) {
    const [restaurant] = queryRestaurant(restaurantSlug)
    const theme = useTheme()
    if (!restaurant) {
      return null
    }
    const sources = getRestaurantDeliverySources(restaurant.sources)

    return (
      <HStack flexWrap="wrap" alignItems="center" spacing="xxs" {...props}>
        {!!label && (
          <Text fontSize={14} color={theme.colorQuartenary} marginRight={8} y={-1}>
            {label}
          </Text>
        )}
        {sources.map((source, i) => {
          return (
            <VStack zIndex={1000 - i} key={source.id} marginHorizontal={-5}>
              <RestaurantDeliveryButton
                name={source.name}
                image={typeof source.image === 'string' ? source.image : null}
                url={source.url}
                restaurantSlug={restaurantSlug}
                showLabels={showLabels}
              />
            </VStack>
          )
        })}
        {!sources.length && label !== false && (
          <Text textAlign="center" fontSize={11} color={theme.colorQuartenary}>
            No delivery
          </Text>
        )}
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
  return (
    <Link href={url}>
      <SmallButton
        backgroundColor="transparent"
        tooltip={!showLabels ? name : null}
        icon={
          !!image ? (
            <Image
              accessibilityLabel={name}
              source={{ uri: image }}
              style={{
                width: showLabels ? 16 : 24,
                height: showLabels ? 16 : 24,
                marginHorizontal: showLabels ? -2 : -6,
                marginVertical: -6,
                borderRadius: 40,
                borderWidth: 1,
                borderColor: '#fff',
              }}
            />
          ) : null
        }
        {...(showLabels && {
          children: name,
        })}
      />
    </Link>
  )
}
