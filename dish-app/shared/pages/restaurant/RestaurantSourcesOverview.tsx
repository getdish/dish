import { graphql } from '@dish/graph'
import {
  AbsoluteVStack,
  Grid,
  HStack,
  Paragraph,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import React from 'react'
import { Image } from 'react-native'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { thirdPartyCrawlSources } from '../../thirdPartyCrawlSources'
import { SentimentText } from './SentimentText'

export const RestaurantSourcesOverview = graphql(
  ({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const sources = restaurant.sources() ?? {}
    const sourceNames = Object.keys(sources)

    return (
      <Grid>
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
              margin={10}
              position="relative"
            >
              <SmallTitle>{name}</SmallTitle>
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
                <Spacer />
                <SentimentText sentiment={-1}>Negative</SentimentText>
              </HStack>
              <Spacer />
              <Paragraph>
                "...lorem ipsume dolor sit ament. lorem{' '}
                <strong>ipsume dolor</strong> sit ament.lorem ipsume dolor sit
                ament lorem ipsume dolor sit ament..."
              </Paragraph>
            </VStack>
          )
        })}
      </Grid>
    )
  }
)
