import { graphql } from '@dish/graph'
import { debounce } from 'lodash'
import React, { useCallback, useMemo } from 'react'
import { Hoverable, Spacer, Text, VStack } from 'snackui'

import { getColorsForName } from '../../helpers/getColorsForName'
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
          <Text color={colors.darkColor} fontWeight="500">
            {restaurant.name}
          </Text>
          <Spacer size="sm" />
          <VStack marginVertical={-3}>
            <RestaurantRatingView slug={slug} />
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
