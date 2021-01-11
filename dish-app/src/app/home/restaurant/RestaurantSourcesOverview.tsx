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

import { isWeb } from '../../../constants/constants'
import { thirdPartyCrawlSources } from '../../../constants/thirdPartyCrawlSources'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { SlantedTitle } from '../../views/SlantedTitle'
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

  return sourceNames
    .map((sourceName) => {
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
      const summary =
        positive > negative
          ? breakdown.summaries.reviews.best
          : breakdown.summaries.reviews.worst
      const sentence = summary
        ? ellipseText(summary, {
            maxLength: 250,
          })
        : null
      return { name, image, sentence, positive, negative }
    })
    .filter((x) => !!x?.sentence)
}

function getTagSourceBreakdowns(breakdowns?: TagSourceBreakdown) {
  if (!breakdowns) {
    return null
  }
  const sourceNames = Object.keys(breakdowns).filter(
    (x) =>
      !!(
        breakdowns[x].summary.negative?.[0] ||
        breakdowns[x].summary.positive?.[0]
      )
  )

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

      const defaultSummary = positive > negative ? 'positive' : 'negative'
      const oppositeSummary = positive > negative ? 'negative' : 'positive'
      const summary =
        breakdown.summary[defaultSummary]?.[0] ??
        breakdown.summary[oppositeSummary]?.[0]
      const sentence = summary
        ? ellipseText(summary, {
            maxLength: 300,
          })
        : null
      return { name, image, sentence, positive, negative }
    })
    .filter((x) => !!x && x.sentence)
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
      <VStack width="100%" marginVertical={-spacing}>
        <Grid itemMinWidth={280}>
          {items.map(({ name, sentence, image, positive, negative }) => {
            return (
              <VStack
                key={name}
                shadowColor="#000"
                shadowOpacity={0.05}
                borderWidth={1}
                borderColor="#eee"
                backgroundColor="#fff"
                shadowRadius={15}
                shadowOffset={{ height: 3, width: 0 }}
                padding={15}
                margin={spacing}
                borderRadius={10}
                position="relative"
                flex={1}
              >
                <SlantedTitle marginTop={-30} size="xs" alignSelf="center">
                  {name}
                </SlantedTitle>
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
                <Paragraph sizeLineHeight={0.9}>
                  {!!tagName && isWeb ? (
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
                  ) : (
                    sentence
                  )}
                </Paragraph>
              </VStack>
            )
          })}
        </Grid>
      </VStack>
    )
  }
)
