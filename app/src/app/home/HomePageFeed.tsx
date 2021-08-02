import { RestaurantOnlyIds, graphql, order_by, query } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { shuffle } from 'lodash'
import React, { Suspense, memo, useEffect, useMemo, useState } from 'react'
import {
  AbsoluteVStack,
  Grid,
  HStack,
  Hoverable,
  LoadingItems,
  Spacer,
  Text,
  VStack,
  useDebounceEffect,
  useTheme,
} from 'snackui'

import { colorNames } from '../../constants/colors'
import { cardFrameBorderRadius, cardFrameWidth, cardFrameWidthLg } from '../../constants/constants'
import { initialLocation } from '../../constants/initialHomeState'
import { tagDefaultAutocomplete, tagLenses } from '../../constants/localTags'
import { getColorsForName } from '../../helpers/getColorsForName'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { hexToRGB, rgbString } from '../../helpers/rgb'
import {
  selectRishDishViewSimple,
  selectTagDishViewSimple,
} from '../../helpers/selectDishViewSimple'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { TagButtonSlanted } from '../views/dish/TagButtonSlanted'
import { Link } from '../views/Link'
import { SlantedTitle } from '../views/SlantedTitle'
import { SmallTitle } from '../views/SmallTitle'
import { TagButton, getTagButtonProps } from '../views/TagButton'
import { TagSmallButton } from '../views/TagSmallButton'
import { FIBase } from './FIBase'
import { GradientButton } from './GradientButton'
import { FICuisine, HomeFeedCuisineItem } from './HomeFeedCuisineItem'
import { HomeFeedDishRestaurants } from './HomeFeedDishRestaurants'
import { FIList, HomeFeedLists } from './HomeFeedLists'
import { HomeFeedProps } from './HomeFeedProps'
import { FIHotNew, HomeFeedTrendingNew } from './HomeFeedTrendingNew'
import { homePageStore } from './homePageStore'
import { Card, CardOverlay } from './restaurant/Card'
import { TagsText } from './TagsText'
import { useTopCuisines } from './useTopCuisines'

type FI =
  | FICuisine
  | FIList
  | FIHotNew
  | (FIBase & {
      type: 'space' | 'dish-restaurants' | 'categories'
    })

const TagGradientButton = ({ tags }: { tags: DishTagItem[] }) => {
  const color = tags[0]?.rgb ?? [150, 150, 150]
  return (
    <Link flex={1} tags={tags} asyncClick>
      <GradientButton rgb={color}>
        <TagsText tags={tags} color={rgbString(color)} />
      </GradientButton>
    </Link>
  )
}

const FeedCard = ({
  title,
  author,
  tags,
  size = 'sm',
  square,
  photo,
  variant,
  chromeless,
  backgroundColor,
  emphasizeTag,
}: {
  title?: string | JSX.Element | null
  author?: string
  tags: DishTagItem[]
  photo?: string | null
  size?: any
  square?: boolean
  variant?: 'flat'
  chromeless?: boolean
  backgroundColor?: string
  emphasizeTag?: boolean
}) => {
  const theme = useTheme()
  const color = tags[0]?.rgb ?? [200, 150, 150]
  const colorString = rgbString(color)
  return (
    <Card
      className="hover-parent"
      dimImage
      chromeless={chromeless}
      variant={variant}
      size={size}
      square={square}
      borderless={!!backgroundColor}
      hoverEffect="background"
      photo={photo}
      backgroundColor={backgroundColor}
      outside={
        <>
          <CardOverlay flat={chromeless || variant === 'flat'}>
            {tags.map((tag) => (
              <AbsoluteVStack top={0} right={0} key={tag.slug} scale={emphasizeTag ? 1 : 0.75}>
                <TagButton {...tag} />
              </AbsoluteVStack>
            ))}

            <VStack flex={1} />

            <Text
              className="hover-100-opacity-child"
              fontWeight="800"
              fontSize={emphasizeTag ? (size === 'sm' ? 13 : 18) : size === 'sm' ? 16 : 23}
              color={colorString}
              opacity={0.8}
              // textShadowColor={theme.shadowColorLighter}
              // textShadowRadius={0}
              // textShadowOffset={{ height: 2, width: 0 }}
            >
              {title}
            </Text>

            {!!author && (
              <Text color={theme.color} fontWeight="300" marginTop={8} opacity={0.5}>
                {author}
              </Text>
            )}
          </CardOverlay>
          {/* <Suspense fallback={null}>
                <ListFavoriteButton {...props} />
              </Suspense> */}
          {/* <SlantedTitle maxWidth="87%" size="xs" backgroundColor="#000000cc" color="#fff">
                {list.name}
              </SlantedTitle>
              <Paragraph size="sm" opacity={0.8} fontWeight="500" x={20} y={20}>
                by {list.user?.name ?? list.user?.username ?? ''}
              </Paragraph> */}
        </>
      }
    />
  )
}

export const HomePageFeed = memo(
  graphql(
    function HomePageFeed(props: HomeFeedProps) {
      const { regionName, item } = props

      const isLoading = !regionName
      const [hovered, setHovered] = useState<null | string>(null)
      const [hoveredResults, setHoveredResults] = useState<null | {
        via: FI['type']
        results: RestaurantOnlyIds[]
      }>(null)

      // useDebounceEffect(
      //   () => {
      //     const results = items.flatMap((x) => {
      //       if (hovered && hovered !== x.id) {
      //         return []
      //       }
      //       if (hoveredResults?.via === x.type) {
      //         return hoveredResults?.results
      //       }
      //       return []
      //     })
      //     // set results
      //     homePageStore.setResults(results)
      //   },
      //   150,
      //   [items, hoveredResults]
      // )

      const restaurants = query
        .restaurant({
          order_by: [{ upvotes: order_by.desc }],
          where: {
            image: {
              _is_null: false,
            },
          },
          limit: 10,
        })
        .map((r) => ({ image: r.image, name: r.name }))

      const cuisinesQuery = query.tag({
        where: {
          type: {
            _eq: 'country',
          },
        },
        limit: 10,
      })

      // const topCuisines = useTopCuisines(props.item.center || initialLocation.center)
      const cuisineLists = query.list({
        where: {
          region: {
            _eq: item.region,
          },
          tags: {
            tag: {
              type: {
                _in: ['country', 'dish'],
              },
            },
          },
        },
        order_by: [{ updated_at: order_by.asc }],
        limit: 12,
      })

      console.log(
        'what is',
        cuisineLists.map((x) => x.name)
        // topCuisines
      )

      const cuisines = cuisinesQuery.map(selectTagDishViewSimple)

      const trendingLists = query.list({
        where: {
          region: {
            _eq: item.region,
          },
        },
        order_by: [{ updated_at: order_by.asc }],
        limit: 16,
      })

      const lenseLists = query.list({
        where: {
          tags: {
            tag: {
              slug: {
                _in: tagLenses.map((x) => x.slug),
              },
            },
          },
          region: {
            _eq: item.region,
          },
        },
        order_by: [{ updated_at: order_by.asc }],
        limit: 8,
      })

      return (
        <>
          {isLoading && (
            <AbsoluteVStack pointerEvents="none" zIndex={100} fullscreen>
              <LoadingItems />
            </AbsoluteVStack>
          )}

          {!isLoading && (
            <VStack>
              <HStack position="relative">
                <ContentScrollViewHorizontal>
                  <HStack spacing="xs" paddingHorizontal={16}>
                    {tagLenses.map((lense, i) => {
                      const foundList = lenseLists[i]
                      return (
                        <VStack alignItems="center" flex={1} key={i} marginBottom={20}>
                          <Link
                            name="list"
                            params={{
                              slug: foundList?.slug ?? '',
                              region: item.region,
                              userSlug: foundList?.user?.username ?? '',
                            }}
                          >
                            <FeedCard
                              variant="flat"
                              chromeless
                              square
                              title={foundList?.name}
                              tags={[lense]}
                              photo={
                                foundList?.restaurants({
                                  where: {
                                    restaurant: {
                                      image: {
                                        _is_null: false,
                                      },
                                    },
                                  },
                                  order_by: [{ position: order_by.asc }],
                                  limit: 1,
                                })[0]?.restaurant?.image
                              }
                              backgroundColor={rgbString(lense.rgb, 0.2)}
                              emphasizeTag
                            />
                          </Link>
                        </VStack>
                      )
                    })}
                  </HStack>
                </ContentScrollViewHorizontal>
              </HStack>

              <HStack position="relative">
                <AbsoluteVStack top={-10} left={10}>
                  <SlantedTitle size="xs">Tags</SlantedTitle>
                </AbsoluteVStack>

                <ContentScrollViewHorizontal>
                  <HStack
                    spacing="xs"
                    paddingVertical={10}
                    marginBottom={20}
                    paddingHorizontal={16}
                  >
                    {shuffle([...tagDefaultAutocomplete, ...cuisines]).map((lense, i) => (
                      <VStack alignItems="center" flex={1} key={i}>
                        <FeedCard
                          variant="flat"
                          chromeless
                          square
                          title={
                            i % 2 === 0 ? (
                              <>San&nbsp;Francisco gems.</>
                            ) : (
                              <>Best places in SF for drinks.</>
                            )
                          }
                          tags={[{ rgb: [200, 100, 200], ...lense }]}
                          photo={restaurants[i]?.image}
                          emphasizeTag
                        />
                      </VStack>
                    ))}
                  </HStack>
                </ContentScrollViewHorizontal>
              </HStack>

              <VStack paddingHorizontal={16} position="relative">
                <AbsoluteVStack top={-10} left={10}>
                  <SlantedTitle size="xs">Trending</SlantedTitle>
                </AbsoluteVStack>
                <Grid itemMinWidth={cardFrameWidth}>
                  {trendingLists.map((list, i) => {
                    // getListColor(list?.color) ?? '#999'
                    const color = getColorsForName(list.name || '').altPastelColor
                    return (
                      <VStack alignItems="center" flex={1} key={i} marginBottom={26}>
                        <Link
                          name="list"
                          params={{
                            region: list.region || '',
                            slug: list.slug || '',
                            userSlug: list.user?.username || '',
                          }}
                        >
                          <FeedCard
                            chromeless
                            author={` by ${list.user?.username}`}
                            size="lg"
                            backgroundColor={`${color}25`}
                            variant="flat"
                            title={list.name}
                            tags={list
                              .tags({ limit: 2 })
                              .map((x) => (x.tag ? selectTagDishViewSimple(x.tag) : null))
                              .filter(isPresent)}
                            photo={restaurants[i]?.image}
                          />
                        </Link>
                      </VStack>
                    )
                  })}
                </Grid>
              </VStack>
            </VStack>
          )}
        </>
      )
    },
    {
      suspense: false,
    }
  )
)
