import { queryRestaurant } from '../../../queries/queryRestaurant'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
import { getRestaurantDeliverySources } from './getRestaurantDeliverySources'
import { graphql } from '@dish/graph'
import { Paragraph, SizableText, Text, XStack, YStack, YStackProps, useTheme } from '@dish/ui'
import React, { memo } from 'react'

type Props = YStackProps & {
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
    if (!restaurant) {
      return null
    }
    const sources = getRestaurantDeliverySources(restaurant.sources)

    return (
      <XStack flexWrap="wrap" alignItems="center" space="$1" {...props}>
        {!!label && (
          <Paragraph selectable={false} size="$3" marginRight={8} y={-1}>
            {label}
          </Paragraph>
        )}
        {sources.map((source, i) => {
          return (
            <YStack zIndex={1000 - i} key={source.id} marginHorizontal={-5}>
              <RestaurantDeliveryButton
                name={source.name}
                image={typeof source.image === 'string' ? source.image : null}
                url={source.url}
                restaurantSlug={restaurantSlug}
                showLabels={showLabels}
              />
            </YStack>
          )
        })}
        {!sources.length && label !== false && (
          <Paragraph selectable={false} textAlign="center" size="$3">
            No delivery
          </Paragraph>
        )}
      </XStack>
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
                opacity: showLabels ? 1 : 0.5,
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
