import { graphql } from '@dish/graph'
import React from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  Grid,
  HStack,
  Paragraph,
  SmallTitle,
  Spacer,
  VStack,
} from 'snackui'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { thirdPartyCrawlSources } from '../../thirdPartyCrawlSources'
import { SentimentText } from './SentimentText'

export const RestaurantSourcesOverview = graphql(
  ({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const sources = restaurant.sources() ?? {}
    const sourceNames = Object.keys(sources)
    const spacing = 12

    return (
      <VStack marginVertical={-spacing}>
        <Grid itemMinWidth={240}>
          {sourceNames.map((sourceName) => {
            const sourceInfo = thirdPartyCrawlSources[sourceName]
            if (!sourceInfo) {
              return null
            }
            const { name, image } = sourceInfo
            return (
              <VStack
                key={sourceName}
                shadowColor="#000"
                shadowOpacity={0.1}
                shadowRadius={10}
                shadowOffset={{ height: 3, width: 0 }}
                padding={15}
                margin={spacing}
                position="relative"
              >
                <SmallTitle color="#000" divider="off" fontSize={20}>
                  {name}
                </SmallTitle>
                <Spacer size="sm" />
                <AbsoluteVStack top={-10} right={-10}>
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 100,
                    }}
                  />
                </AbsoluteVStack>
                <Spacer />
                <HStack justifyContent="center">
                  <SentimentText sentiment={1}>Positive</SentimentText>
                  <Spacer size="xs" />
                  <SentimentText sentiment={-1}>Negative</SentimentText>
                </HStack>
                <Spacer />
                <Paragraph size="lg">
                  "...lorem ipsume dolor sit ament. lorem{' '}
                  <strong>ipsume dolor</strong> sit ament.lorem ipsume dolor sit
                  ament lorem ipsume dolor sit ament..."
                </Paragraph>
              </VStack>
            )
          })}
        </Grid>
      </VStack>
    )
  }
)
