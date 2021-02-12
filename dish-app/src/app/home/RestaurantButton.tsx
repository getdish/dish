import { graphql } from '@dish/graph'
import React from 'react'
import { Spacer, Text, VStack } from 'snackui'

import { getColorsForName } from '../../helpers/getColorsForName'
import { hexToRGB } from '../../helpers/hexToRGB'
import { queryRestaurant } from '../../queries/queryRestaurant'
import { Link } from '../views/Link'
import { GradientButton } from './GradientButton'
import { RestaurantRatingView } from './RestaurantRatingView'

export const RestaurantButton = graphql(({ slug }: { slug: string }) => {
  const [restaurant] = queryRestaurant(slug)
  const colors = getColorsForName(slug)
  const rgb = hexToRGB(colors.color).rgb
  return (
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
})
