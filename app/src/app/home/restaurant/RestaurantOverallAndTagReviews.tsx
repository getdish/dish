import { graphql, restaurant } from '@dish/graph'
import { ellipseText, isPresent } from '@dish/helpers'
import {
  AbsoluteYStack,
  LinearGradient,
  Paragraph,
  Spacer,
  Text,
  XStack,
  YStack,
  useTheme,
} from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { StyleSheet } from 'react-native'

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
  hideDescription?: boolean
  size?: 'lg' | 'md' | 'sm'
  tagSlug?: string | null
  key: string
  restaurant: restaurant | undefined
  closable?: boolean
  showScoreTable?: boolean
  borderless?: boolean
}

export const RestaurantOverallAndTagReviews = (props: Props) => {
  const scrollHeight = props.size === 'sm' ? 80 : props.size === 'lg' ? 200 : 140
  return (
    <YStack height={scrollHeight}>
      <Suspense fallback={null}>
        <Content {...props} />
      </Suspense>
    </YStack>
  )
}

const Content = memo(
  graphql(
    ({
      tagSlug,
      restaurant,
      key,
      size = 'md',
      hideDescription,
      closable,
      borderless,
      showScoreTable,
    }: Props) => {
      const scrollHeight = size === 'sm' ? 80 : size === 'lg' ? 200 : 140
      const itemHeight = scrollHeight - 20

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
        id: key,
      })
      const spacing = size === 'sm' ? 5 : 12
      const theme = useTheme()
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
              })[0]?.source_breakdown,
              restaurant.sources
            )
          : getSourceBreakdowns(restaurant.source_breakdown?.sources, restaurant.sources)) ?? []
      ).filter(isPresent)

      const imgSizes = {
        sm: 28,
        md: 32,
        lg: 48,
      }

      const ratingFontSizes = {
        sm: 14,
        md: 18,
        lg: 22,
      }

      if (size === 'sm') {
        return (
          <XStack paddingHorizontal={10} marginVertical="auto" space="$6">
            {items.map((props) => {
              const { name, image, rating } = props
              return (
                <XStack alignItems="center" space="$2" key={name}>
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 100,
                    }}
                  />

                  <Text letterSpacing={-1} fontSize={ratingFontSizes[size]} color={theme.color}>
                    {rating}
                  </Text>
                </XStack>
              )
            })}
          </XStack>
        )
      }

      return (
        <YStack maxWidth="100%" width="100%" height={scrollHeight} position="relative">
          {closable && (
            <AbsoluteYStack zIndex={1000} top={10} right={10}>
              <CloseButton onPress={store.toggleShowComments} />
            </AbsoluteYStack>
          )}

          {/* <SlantedTitle fontSize={12} marginBottom={-30} alignSelf="center" size="sm">
            {tagName ?? 'Overall'}
          </SlantedTitle> */}

          <YStack
            minWidth={260}
            {...(hideDescription && {
              minWidth: 80,
            })}
            // maxWidth={drawerWidthMax / 2 - 40}
            flex={2}
            overflow="hidden"
            paddingHorizontal={20}
            paddingVertical={20}
            alignItems="center"
            justifyContent="center"
            space={10}
          >
            <ContentScrollViewHorizontal height={scrollHeight}>
              <XStack>
                {items.map(({ name, sentence, image, rating, url }) => {
                  return (
                    <YStack key={name}>
                      <YStack
                        margin={spacing / 2}
                        shadowColor="#000"
                        shadowOpacity={0.05}
                        backgroundColor={theme.bgCard}
                        width={290}
                        {...(hideDescription && {
                          width: 80,
                        })}
                        height={itemHeight}
                        shadowRadius={15}
                        padding={15}
                        shadowOffset={{ height: 3, width: 0 }}
                        // padding={16}
                        alignSelf="center"
                        borderRadius={10}
                        position="relative"
                        flex={1}
                      >
                        <YStack position="relative" alignSelf="center">
                          <SlantedTitle
                            marginTop={-20}
                            size="$4"
                            fontWeight="800"
                            paddingVertical={4}
                            paddingHorizontal={8}
                          >
                            {name}
                          </SlantedTitle>
                          <Spacer size="$1" />
                        </YStack>

                        <XStack paddingHorizontal={20} flex={1} maxHeight="100%">
                          <YStack spacing alignItems="center">
                            <Link href={url}>
                              <Image
                                source={{ uri: image }}
                                style={{
                                  width: imgSizes[size],
                                  height: imgSizes[size],
                                  borderRadius: 100,
                                }}
                              />
                            </Link>

                            <Text
                              letterSpacing={-1}
                              fontSize={ratingFontSizes[size]}
                              fontWeight="700"
                              color={theme.color}
                            >
                              {rating}
                            </Text>

                            {/* <XStack space="$1">
                            <SentimentText sentiment={1}>
                              {numberFormat(positive || 0, 'sm')}
                            </SentimentText>
                            <SentimentText sentiment={-1}>
                              {numberFormat(Math.abs(negative || 0), 'sm')}
                            </SentimentText>
                          </XStack> */}
                          </YStack>

                          {!hideDescription && (
                            <>
                              <Spacer size="$4" />

                              <YStack
                                overflow="hidden"
                                position="relative"
                                flex={1}
                                maxWidth="100%"
                              >
                                <Paragraph size="$2" maxHeight="100%" overflow="hidden">
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

                                <AbsoluteYStack
                                  zIndex={10}
                                  bottom={0}
                                  left={0}
                                  height={50}
                                  right={0}
                                >
                                  <LinearGradient
                                    colors={[`${theme.bgCard}00`, theme.bgCard]}
                                    style={StyleSheet.absoluteFill}
                                  />
                                </AbsoluteYStack>
                              </YStack>
                            </>
                          )}
                        </XStack>
                      </YStack>
                    </YStack>
                  )
                })}
              </XStack>
            </ContentScrollViewHorizontal>
          </YStack>
        </YStack>
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

type RestaurantSources = {
  [key: string]: {
    url: string
    rating: number
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

function getSourceBreakdowns(sourceBreakdowns?: SourceBreakdowns, sources?: RestaurantSources) {
  if (!sourceBreakdowns) {
    return null
  }
  const { all, ...rest } = sourceBreakdowns
  const sourceNames = Object.keys(rest) as string[]

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

      const rating = sources?.[sourceName]?.rating || 0
      const url = sources?.[sourceName]?.url || ''

      return { name, image, sentence, positive, negative, rating, url }
    })
    .filter((x) => !!x?.sentence)
}

function getTagSourceBreakdowns(breakdowns?: TagSourceBreakdown, sources?: RestaurantSources) {
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
        breakdown.summary[defaultSummary]?.[0] || breakdown.summary[oppositeSummary]?.[0]
      const sentence = summary
        ? ellipseText(summary, {
            maxLength: 115,
          })
        : null

      const url = sources?.[sourceName]?.url || ''
      const ratio = positive / (Math.abs(negative) + positive)
      const rating = Math.round(ratio * 5 * 10) / 10

      return { name, image, sentence, positive, negative, url, rating }
    })
    .filter((x) => !!x && x.sentence)
}
