import { graphql } from '@dish/graph'
import { ellipseText, isPresent } from '@dish/helpers'
import { Store, useStore } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  Paragraph,
  Spacer,
  Text,
  VStack,
  useTheme,
} from 'snackui'

import { green, grey } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { thirdPartyCrawlSources } from '../../../constants/thirdPartyCrawlSources'
import { numberFormat } from '../../../helpers/numberFormat'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { CloseButton } from '../../views/CloseButton'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SentimentText } from './SentimentText'

export class RestaurantReviewsDisplayStore extends Store<{ id: string }> {
  showComments = false

  toggleShowComments() {
    this.showComments = !this.showComments
  }
}

type Props = {
  title?: string
  tagSlug?: string | null
  restaurantId: string
  restaurantSlug: string
  closable?: boolean
  showScoreTable?: boolean
  borderless?: boolean
}

const height = 210
const scrollHeight = height - 40
const itemHeight = scrollHeight - 20

export const RestaurantOverallAndTagReviews = (props: Props) => {
  return (
    <VStack height={height + 40}>
      <Suspense fallback={null}>
        <Content {...props} />
      </Suspense>
    </VStack>
  )
}

const Content = memo(
  graphql(
    ({ tagSlug, restaurantId, restaurantSlug, closable, borderless, showScoreTable }: Props) => {
      const [restaurant] = queryRestaurant(restaurantSlug)
      if (!restaurant) {
        return null
      }
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
      const store = useStore(RestaurantReviewsDisplayStore, {
        id: restaurantId,
      })
      const spacing = 12
      const theme = useTheme()
      const sources = restaurant.sources ?? {}
      const items = (
        (tagName
          ? getTagSourceBreakdowns(
              restaurant.tags({
                where: {
                  tag: {
                    name: {
                      _ilike: tagName,
                    },
                  },
                },
              })[0]?.source_breakdown
            )
          : getSourceBreakdowns(restaurant.source_breakdown?.sources)) ?? []
      ).filter(isPresent)

      return (
        <VStack maxWidth="100%" width="100%" height="100%" position="relative">
          {closable && (
            <AbsoluteVStack zIndex={1000} top={10} right={10}>
              <CloseButton onPress={store.toggleShowComments} />
            </AbsoluteVStack>
          )}

          {/* <SlantedTitle fontSize={12} marginBottom={-30} alignSelf="center" size="sm">
            {tagName ?? 'Overall'}
          </SlantedTitle> */}

          <VStack
            minWidth={260}
            // maxWidth={drawerWidthMax / 2 - 40}
            flex={2}
            overflow="hidden"
            paddingHorizontal={10}
            paddingVertical={20}
            alignItems="center"
            justifyContent="center"
            spacing={10}
          >
            <ContentScrollViewHorizontal height={scrollHeight}>
              <HStack paddingHorizontal={20}>
                {items.map(({ name, sentence, image, positive, negative }) => {
                  const ratio = positive / (Math.abs(negative) + positive)
                  return (
                    <VStack key={name} margin="auto">
                      <VStack
                        margin={spacing}
                        shadowColor="#000"
                        shadowOpacity={0.05}
                        backgroundColor={theme.cardBackgroundColor}
                        width={400}
                        height={itemHeight}
                        shadowRadius={15}
                        shadowOffset={{ height: 3, width: 0 }}
                        padding={20}
                        alignSelf="center"
                        borderRadius={10}
                        position="relative"
                        flex={1}
                      >
                        <VStack position="relative" alignSelf="center">
                          <SlantedTitle marginTop={-30} size="xs">
                            {name}
                          </SlantedTitle>
                        </VStack>

                        <Spacer size="lg" />

                        <HStack>
                          <VStack marginTop={-18} spacing alignItems="center">
                            <Link href={sources[name.toLowerCase()]?.url}>
                              <Image
                                source={{ uri: image }}
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 100,
                                }}
                              />
                            </Link>

                            <Text
                              fontSize={30}
                              fontWeight="800"
                              color={positive > negative ? green : grey}
                              letterSpacing={-1}
                            >
                              {Math.round(ratio * 100)}%
                            </Text>

                            <HStack spacing="xs">
                              <SentimentText sentiment={1}>
                                {numberFormat(positive || 0, 'sm')}
                              </SentimentText>
                              <SentimentText sentiment={-1}>
                                {numberFormat(Math.abs(negative || 0), 'sm')}
                              </SentimentText>
                            </HStack>
                          </VStack>

                          <Spacer size="lg" />

                          <VStack overflow="hidden" position="relative" flex={1} maxWidth="100%">
                            <Paragraph
                              sizeLineHeight={0.9}
                              maxHeight={height - 100}
                              overflow="hidden"
                            >
                              {!!tagName && isWeb && sentence ? (
                                <div
                                  className="block"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      `<b>${tagName}</b> -` +
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

                            <AbsoluteVStack zIndex={10} bottom={0} left={0} height={50} right={0}>
                              <LinearGradient
                                colors={[
                                  `${theme.cardBackgroundColor}00`,
                                  theme.cardBackgroundColor,
                                ]}
                                style={StyleSheet.absoluteFill}
                              />
                            </AbsoluteVStack>
                          </VStack>
                        </HStack>
                      </VStack>
                    </VStack>
                  )
                })}
              </HStack>
            </ContentScrollViewHorizontal>
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
        positive > negative ? breakdown.summaries.reviews.best : breakdown.summaries.reviews.worst
      const sentence = summary
        ? ellipseText(summary, {
            maxLength: 115,
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
    (x) => !!(breakdowns[x].summary.negative?.[0] || breakdowns[x].summary.positive?.[0])
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
        breakdown.summary[defaultSummary]?.[0] ?? breakdown.summary[oppositeSummary]?.[0]
      const sentence = summary
        ? ellipseText(summary, {
            maxLength: 115,
          })
        : null
      return { name, image, sentence, positive, negative }
    })
    .filter((x) => !!x && x.sentence)
}
