import { series } from '@dish/async'
import { graphql, order_by, query, resolved } from '@dish/graph'
import { Plus } from '@dish/react-feather'
import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { VStack } from 'snackui'
import { Paragraph } from 'snackui'
import { HStack, Spacer, Text, useDebounce } from 'snackui'

import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { homeStore } from '../homeStore'
import { SmallCircleButton } from '../views/CloseButton'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { Link } from '../views/Link'
import { ListCard } from '../views/list/ListCard'
import { FeedSlantedTitle } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { HoverResultsProp } from './HoverResultsProp'
import { SkewedCard, SkewedCardCarousel } from './SkewedCard'

export type FIList = FIBase & {
  type: 'list'
  region: string
}

type Props = FIList & HoverResultsProp

export const HomeFeedLists = (props: Props) => {
  return (
    <Suspense fallback={null}>
      <HomeFeedListsContents {...props} />
    </Suspense>
  )
}

export const HomeFeedListsContents = graphql(({ region, onHoverResults }: Props) => {
  const recentLists = query.list_populated({
    args: {
      min_items: 2,
    },
    limit: 10,
    where: {
      public: {
        _neq: false,
      },
      region: {
        _eq: region,
      },
    },
    order_by: [{ created_at: order_by.desc }],
  })
  const [hoveredList, setHoveredListFast] = useState<string | null>(null)
  const setHoveredList = useDebounce(setHoveredListFast, 300)

  useEffect(() => {
    return series([
      () =>
        resolved(() => {
          return query
            .list({
              where: {
                id: {
                  _eq: hoveredList,
                },
              },
              limit: 1,
            })
            .flatMap((x) => {
              return x
                .restaurants({
                  limit: 40,
                })
                .map((r) => getRestaurantIdentifiers(r.restaurant))
            })
        }),
      (results) => {
        onHoverResults(results)
      },
    ])
  }, [hoveredList])

  const key = `${recentLists?.map((x) => x.id)}`

  return useMemo(() => {
    if (!recentLists.length) {
      return null
    }
    return (
      <>
        <FeedSlantedTitle>
          {/* marginVertical good on native */}
          <HStack alignItems="center" marginVertical={-2}>
            <Paragraph fontWeight="700" fontSize={18}>
              Top Lists
            </Paragraph>
            <Spacer size="sm" />
            <Link
              promptLogin
              name="list"
              params={{
                userSlug: 'me',
                slug: 'create',
                region: homeStore.lastRegionSlug,
              }}
            >
              <SmallCircleButton padding={5}>
                <Plus size={20} color="#fff" />
              </SmallCircleButton>
            </Link>
          </HStack>
        </FeedSlantedTitle>

        <Spacer size="lg" />

        <ContentScrollViewHorizontal>
          <HStack paddingHorizontal={20} spacing="md" paddingVertical={12}>
            <SkewedCardCarousel>
              {recentLists.map((list, i) => {
                if (!list) {
                  return null
                }
                return (
                  <SkewedCard key={list.id || i} zIndex={1000 - i}>
                    <ListCard
                      isBehind={i > 0}
                      hoverable={false}
                      slug={list.slug}
                      userSlug={list.user?.username ?? ''}
                      region={list.region ?? ''}
                      onHover={(hovered) => {
                        hovered ? setHoveredList(list.id) : null
                      }}
                    />
                  </SkewedCard>
                )
              })}
            </SkewedCardCarousel>
          </HStack>
        </ContentScrollViewHorizontal>
      </>
    )
  }, [key])
})
