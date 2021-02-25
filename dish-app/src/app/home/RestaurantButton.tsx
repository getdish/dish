import { graphql } from '@dish/graph'
import { debounce } from 'lodash'
import React, { useCallback } from 'react'
import { Image } from 'react-native'
import { Button, HStack, Hoverable, Text, VStack, useTheme } from 'snackui'

import { getColorsForName } from '../../helpers/getColorsForName'
import { getImageUrl } from '../../helpers/getImageUrl'
import { queryRestaurant } from '../../queries/queryRestaurant'
import { appMapStore } from '../AppMapStore'
import { Link } from '../views/Link'
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
    // const colors = getColorsForName(slug)
    const theme = useTheme()
    const onHover = useCallback(() => {
      setHovered({
        id,
        slug,
        via: 'list',
      })
    }, [hoverToMap])

    const content = (
      <Link name="restaurant" params={{ slug: slug }} asyncClick>
        <Button noTextWrap>
          <HStack maxWidth={300}>
            {!!restaurant.image && (
              <Image
                source={{ uri: getImageUrl(restaurant.image, 80, 80) }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 100,
                  margin: -6,
                  marginRight: 10,
                }}
              />
            )}
            <Text ellipse color={theme.colorSecondary} fontWeight="400">
              {restaurant.name}
            </Text>
            <VStack margin={-6} marginLeft={10}>
              <RestaurantRatingView size={32} slug={slug} />
            </VStack>
          </HStack>
        </Button>
      </Link>
    )

    if (hoverToMap) {
      return <Hoverable onHoverIn={onHover}>{content}</Hoverable>
    }

    return content
  }
)
