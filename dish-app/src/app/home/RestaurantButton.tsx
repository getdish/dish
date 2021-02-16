import { graphql } from '@dish/graph'
import { debounce } from 'lodash'
import React, { useCallback, useMemo } from 'react'
import { Image } from 'react-native'
import { Hoverable, Spacer, Text, VStack } from 'snackui'

import { getColorsForName } from '../../helpers/getColorsForName'
import { getImageUrl } from '../../helpers/getImageUrl'
import { hexToRGB } from '../../helpers/hexToRGB'
import { queryRestaurant } from '../../queries/queryRestaurant'
import { appMapStore } from '../AppMapStore'
import { Link } from '../views/Link'
import { GradientButton } from './GradientButton'
import { RestaurantRatingView } from './RestaurantRatingView'

const setHovered = debounce(appMapStore.setHovered, 300)

export const RestaurantButton = graphql(
  ({
    slug,
    id,
    hoverToMap,
  }: {
    slug: string
    id: string
    hoverToMap?: boolean
  }) => {
    const [restaurant] = queryRestaurant(slug)
    const colors = getColorsForName(slug)
    const rgb = hexToRGB(colors.color).rgb
    const onHover = useCallback(() => {
      setHovered({
        id,
        slug,
        via: 'list',
      })
    }, [hoverToMap])

    const content = (
      <Link name="restaurant" params={{ slug: slug }} asyncClick>
        <GradientButton rgb={rgb}>
          {!!restaurant.image && (
            <Image
              source={{ uri: getImageUrl(restaurant.image, 80, 80) }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 100,
                margin: -10,
                marginRight: 10,
              }}
            />
          )}
          <Text color={colors.darkColor} fontWeight="600">
            {restaurant.name}
          </Text>
          <VStack margin={-10} marginLeft={10}>
            <RestaurantRatingView size={32} slug={slug} />
          </VStack>
        </GradientButton>
      </Link>
    )

    if (hoverToMap) {
      return <Hoverable onHoverIn={onHover}>{content}</Hoverable>
    }

    return content
  }
)
