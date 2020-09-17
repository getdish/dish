import { RESTAURANT_WEIGHTS, graphql } from '@dish/graph'
import {
  Box,
  HStack,
  HoverablePopover,
  SmallTitle,
  TableCell,
  TableRow,
  Text,
  TextProps,
  VStack,
  prevent,
} from '@dish/ui'
import React, { memo } from 'react'
import { Image, Linking } from 'react-native'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { thirdPartyCrawlSources } from '../../thirdPartyCrawlSources'
import { RatingViewProps } from '../home/RatingView'
import RestaurantRatingView from './RestaurantRatingView'

export const RestaurantRatingViewPopover = memo(
  graphql(
    ({
      size = 'md',
      restaurantSlug,
    }: Partial<RatingViewProps> & { restaurantSlug: string }) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const sources = restaurant?.sources?.() ?? {}
      const headStyle: TextProps = {
        fontWeight: '300',
        fontSize: 13,
        color: '#555',
        paddingVertical: 8,
      }
      const padding = 10
      return (
        <HoverablePopover
          allowHoverOnContent
          position="bottom"
          contents={(isOpen) => {
            if (!isOpen) {
              return null
            }
            return (
              <Box width={320} padding={padding}>
                <SmallTitle>Rating Summary</SmallTitle>

                <TableRow>
                  <Text width="50%" {...headStyle}>
                    Source
                  </Text>
                  <Text width="25%" {...headStyle}>
                    Rating
                  </Text>
                  <Text flex={1} {...headStyle}>
                    Weight
                  </Text>
                </TableRow>

                <VStack>
                  {Object.keys(sources).map((source, i) => {
                    const item = sources[source]
                    if (!item) {
                      return null
                    }
                    const info = thirdPartyCrawlSources[source]
                    return (
                      <TableRow
                        backgroundColor={i % 2 == 0 ? 'white' : '#f7f7f7'}
                        marginHorizontal={-10}
                        paddingHorizontal={10}
                        key={source}
                        // @ts-ignore
                        style={{ cursor: 'pointer' }}
                        onPress={() => Linking.openURL(item.url)}
                      >
                        <HStack width="50%" spacing={6} alignItems="center">
                          {info?.image ? (
                            <Image
                              source={info.image}
                              style={{
                                width: 26,
                                height: 26,
                                marginBottom: -4,
                              }}
                            />
                          ) : null}
                          <Text>{info?.name ?? source}</Text>
                        </HStack>
                        <TableCell width="25%">{item.rating}</TableCell>
                        <TableCell flex={1}>
                          {RESTAURANT_WEIGHTS[source]}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </VStack>
              </Box>
            )
          }}
        >
          <VStack cursor="default" pointerEvents="auto" onPress={prevent}>
            <RestaurantRatingView
              size={size}
              rating={restaurant?.rating}
              restaurantSlug={restaurantSlug}
            />
          </VStack>
        </HoverablePopover>
      )
    }
  )
)
