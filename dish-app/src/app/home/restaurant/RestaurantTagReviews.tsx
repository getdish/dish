import { graphql } from '@dish/graph'
import { ellipseText, isPresent } from '@dish/helpers'
import { Store, useStore } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  Grid,
  HStack,
  LoadingItems,
  Paragraph,
  Spacer,
  Text,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { green, grey } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { thirdPartyCrawlSources } from '../../../constants/thirdPartyCrawlSources'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { CloseButton } from '../../views/CloseButton'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { Link } from '../../views/Link'
import { SentimentCircle } from '../../views/SentimentCircle'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SentimentText } from './SentimentText'

export class RestaurantReviewsDisplayStore extends Store<{ id: string }> {
  showComments = false

  toggleShowComments() {
    this.showComments = !this.showComments
  }
}

export const RestaurantTagReviews = memo(
  graphql(
    ({
      tagSlug,
      restaurantId,
      restaurantSlug,
      closable,
      borderless,
      showScoreTable,
    }: {
      title?: string
      tagSlug?: string | null
      restaurantId: string
      restaurantSlug: string
      closable?: boolean
      showScoreTable?: boolean
      borderless?: boolean
    }) => {
      const [restaurant] = queryRestaurant(restaurantSlug)
      const tag = tagSlug
        ? restaurant.tags({
            where: {
              tag: {
                slug: {
                  _eq: tagSlug,
                },
              },
            },
          })[0]
        : null
      const tagName = tag?.tag?.displayName ?? tag?.tag?.name ?? null
      const media = useMedia()
      const store = useStore(RestaurantReviewsDisplayStore, {
        id: restaurantId,
      })
      const tagPhotos = tag?.photos() ?? []
      const numTags = tagPhotos?.length
      const theme = useTheme()

      return (
        <VStack
          overflow="hidden"
          maxWidth="100%"
          width="100%"
          position="relative"
        >
          {closable && (
            <AbsoluteVStack zIndex={1000} top={10} right={10}>
              <CloseButton onPress={store.toggleShowComments} />
            </AbsoluteVStack>
          )}
          <HStack
            position="relative"
            marginHorizontal={10}
            marginBottom={-31}
            alignItems="center"
            justifyContent="center"
          >
            <SlantedTitle fontWeight="700">{tagName ?? 'Overall'}</SlantedTitle>
          </HStack>

          {!!tagPhotos.length && (
            <ContentScrollViewHorizontal height={180}>
              <Suspense fallback={<LoadingItems />}>
                <HStack>
                  {[...tagPhotos, 0, 0, 0, 0, 0, 0]
                    .slice(0, Math.max(numTags, 5))
                    .map((photo, index) => {
                      return (
                        <Link
                          name="gallery"
                          params={{
                            restaurantSlug,
                            tagSlug: tag?.tag?.slug ?? '',
                            offset: index,
                          }}
                        >
                          <VStack
                            width={180}
                            height={180}
                            backgroundColor={theme.backgroundColorTertiary}
                          >
                            {!!photo && (
                              <Image
                                source={{ uri: photo }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                }}
                              />
                            )}
                          </VStack>
                        </Link>
                      )
                    })}
                </HStack>
              </Suspense>
            </ContentScrollViewHorizontal>
          )}

          <Spacer size="lg" />

          <VStack
            minWidth={260}
            // maxWidth={drawerWidthMax / 2 - 40}
            flex={2}
            overflow="hidden"
            paddingHorizontal={10}
            paddingVertical={20}
            alignItems="center"
            spacing={10}
          >
            <Suspense fallback={<LoadingItems />}>
              <RestaurantSourcesOverview
                tagName={tagName}
                restaurantSlug={restaurantSlug}
              />
            </Suspense>
          </VStack>
        </VStack>
      )
    }
  )
)

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
  console.log('breakdowns, breakdowns', breakdowns)
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
            maxLength: 200,
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
    const [restaurant] = queryRestaurant(restaurantSlug)
    const spacing = 12
    const theme = useTheme()

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
          {items
            .filter(isPresent)
            .map(({ name, sentence, image, positive, negative }) => {
              const ratio = positive / (Math.abs(negative) + positive)
              return (
                <VStack
                  key={name}
                  shadowColor="#000"
                  shadowOpacity={0.05}
                  borderWidth={1}
                  borderColor={theme.borderColor}
                  backgroundColor={theme.cardBackgroundColor}
                  shadowRadius={15}
                  shadowOffset={{ height: 3, width: 0 }}
                  padding={20}
                  margin={spacing}
                  borderRadius={10}
                  position="relative"
                  flex={1}
                >
                  <VStack position="relative" alignSelf="center">
                    <AbsoluteVStack
                      right={-35}
                      top={-25}
                      justifyContent="center"
                      alignItems="center"
                      zIndex={0}
                    >
                      <SentimentCircle scale={1.2} ratio={ratio} />
                    </AbsoluteVStack>
                    <SlantedTitle marginTop={-30} size="sm">
                      {name}
                    </SlantedTitle>
                  </VStack>

                  <Spacer size="lg" />

                  <HStack>
                    <VStack spacing alignItems="center">
                      <Image
                        source={{ uri: image }}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 100,
                        }}
                      />

                      <Text
                        fontSize={18}
                        color={positive > negative ? green : grey}
                      >
                        {Math.round(ratio * 100)}%
                      </Text>

                      <VStack spacing="xs">
                        <SentimentText scale={1.2} sentiment={1}>
                          {`${positive || 0}`}
                        </SentimentText>

                        <SentimentText scale={1.2} sentiment={-1}>
                          {`${negative || 0}`}
                        </SentimentText>
                      </VStack>
                    </VStack>

                    <Spacer size="lg" />

                    <Paragraph
                      color={isWeb ? 'var(--color)' : '#222'}
                      sizeLineHeight={0.9}
                      size={1.1}
                    >
                      {tagName ? <Text fontWeight="800">{tagName}</Text> : ''}
                      {!!tagName && isWeb ? (
                        <div
                          className="block"
                          dangerouslySetInnerHTML={{
                            __html:
                              sentence
                                ?.replace(/\s+/g, ' ')
                                .replace(
                                  new RegExp(tagName, 'gi'),
                                  (match) => `<mark>${match}</mark>`
                                ) ?? '',
                          }}
                        />
                      ) : (
                        sentence
                      )}
                    </Paragraph>
                  </HStack>
                </VStack>
              )
            })}
        </Grid>
      </VStack>
    )
  }
)