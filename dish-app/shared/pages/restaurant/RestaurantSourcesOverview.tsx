import { graphql } from '@dish/graph'
import { ellipseText } from '@dish/helpers'
import React from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  Grid,
  HStack,
  Paragraph,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from 'snackui'

import { isWeb } from '../../constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { thirdPartyCrawlSources } from '../../thirdPartyCrawlSources'
import { SentimentText } from './SentimentText'

type RatingCount = {
  count: number
  score: number
}

type SourceBreakdownItem = {
  ratings: null | {
    score: number
    _1: RatingCount
    _2: RatingCount
    _3: RatingCount
    _4: RatingCount
    _5: RatingCount
  }
  summaries: {
    reviews: {
      best: string
      worst: string
    }
    sentences: {
      best: string[]
      worst: string[]
    }
    unique_tags: null
  }
}

type SourceBreakdowns = {
  all: SourceBreakdownItem
  dish: SourceBreakdownItem
  [key: string]: SourceBreakdownItem
}

type SourceBreakdown = {
  votes: {
    score: number
    upvotes: number
    downvotes: number
  }
  photos: {
    score: number
    criteria: number
    score_factor: number
    meeting_criteria_count: number
  }
  sources: SourceBreakdowns
}

type TagSourceBreakdownItem = {
  score: number
  upvotes: number
  downvotes: number
  summary: {
    positive: null | string[]
    negative: null | string[]
  }
}

type TagSourceBreakdown = {
  [key: string]: TagSourceBreakdownItem
}

const rankingKeys = ['_1', '_2', '_3', '_4', '_5'] as const

function getSourceBreakdowns(breakdowns?: SourceBreakdowns) {
  if (!breakdowns) {
    return null
  }
  const { all, ...sourceBreakdowns } = breakdowns
  const sourceNames = Object.keys(sourceBreakdowns) as string[]

  return sourceNames.map((sourceName) => {
    const sourceInfo = thirdPartyCrawlSources[sourceName]
    if (!sourceInfo) {
      return null
    }
    const { name, image } = sourceInfo
    const breakdown = sourceBreakdowns[sourceName]
    if (!breakdown) {
      return null
    }
    let negative = 0
    let positive = 0
    if (breakdown.ratings) {
      for (const key of rankingKeys) {
        const br = breakdown.ratings[key]
        if (br.score < 0) {
          negative += br.score
        } else {
          positive += br.score
        }
      }
    }
    const sentence = ellipseText(
      (positive > negative
        ? breakdown.summaries.reviews.best
        : breakdown.summaries.reviews.worst) ?? `no summary found yet 😭`,
      {
        maxLength: 300,
      }
    )
    return { name, image, sentence, positive, negative }
  })
}

function getTagSourceBreakdowns(breakdowns?: TagSourceBreakdown) {
  if (!breakdowns) {
    return null
  }
  const sourceNames = Object.keys(breakdowns)

  return sourceNames
    .map((sourceName) => {
      const sourceInfo = thirdPartyCrawlSources[sourceName]
      if (!sourceInfo) {
        return null
      }
      const { name, image } = sourceInfo
      const breakdown = breakdowns[sourceName]
      if (!breakdown) {
        return null
      }
      const negative = -breakdown.downvotes
      const positive = breakdown.upvotes

      if (negative == 0 && positive === 0) {
        return null
      }

      const sentence = ellipseText(
        (positive > negative
          ? breakdown.summary.positive?.[0]
          : breakdown.summary.negative?.[0]) ?? `no summary found yet 😭`,
        {
          maxLength: 300,
        }
      )
      return { name, image, sentence, positive, negative }
    })
    .filter(Boolean)
}

export const RestaurantSourcesOverview = graphql(
  ({
    tagName,
    restaurantSlug,
  }: {
    tagName?: string | null
    restaurantSlug: string
  }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const spacing = 12

    const items = tagName
      ? getTagSourceBreakdowns(
          restaurant
            .tags({
              where: {
                tag: {
                  name: {
                    _ilike: tagName,
                  },
                },
              },
            })[0]
            ?.source_breakdown()
        )
      : getSourceBreakdowns(restaurant.source_breakdown()?.sources)

    if (!items) {
      return (
        <VStack minHeight={200} alignItems="center" justifyContent="center">
          <Text opacity={0.5}>No reviews</Text>
        </VStack>
      )
    }

    return (
      <VStack marginVertical={-spacing}>
        <Grid itemMinWidth={240}>
          {items.map(({ name, sentence, image, positive, negative }) => {
            return (
              <VStack
                key={name}
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
                  <SentimentText sentiment={positive}>Positive</SentimentText>
                  <Spacer size="xs" />
                  <SentimentText sentiment={negative}>Negative</SentimentText>
                </HStack>
                <Spacer />
                {!!tagName && isWeb && (
                  <Paragraph>
                    <div
                      className="block"
                      dangerouslySetInnerHTML={{
                        __html: sentence
                          .replace(/\s+/g, ' ')
                          .replace(
                            new RegExp(tagName, 'gi'),
                            (match) => `<mark>${match}</mark>`
                          ),
                      }}
                    />
                  </Paragraph>
                )}
                {(!tagName || !isWeb) && <Paragraph>{sentence}</Paragraph>}
              </VStack>
            )
          })}
        </Grid>
      </VStack>
    )
  }
)
