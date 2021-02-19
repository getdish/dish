import { series } from '@dish/async'
import { graphql, order_by, query, resolved } from '@dish/graph'
import { Plus } from '@dish/react-feather'
import React, { useEffect, useState } from 'react'
import { HStack, Spacer, Text, useDebounce } from 'snackui'

import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { homeStore } from '../homeStore'
import { SmallCircleButton } from '../views/CloseButton'
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

export const HomeFeedLists = graphql(
  ({ region, onHoverResults }: FIList & HoverResultsProp) => {
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

    if (!recentLists.length) {
      return null
    }

    return (
      <>
        <FeedSlantedTitle>
          <HStack alignItems="center">
            <Text fontSize={20} fontWeight="700">
              Playlists
            </Text>
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
              <SmallCircleButton alignSelf="center">
                <Plus size={14} color="#fff" />
              </SmallCircleButton>
            </Link>
          </HStack>
        </FeedSlantedTitle>

        <Spacer size="lg" />

        <SkewedCardCarousel>
          {recentLists.map((list, i) => {
            if (!list) {
              return null
            }
            return (
              <SkewedCard zIndex={1000 - i} key={list.id}>
                <ListCard
                  isBehind={i > 0}
                  hoverable={false}
                  slug={list.slug}
                  userSlug={list.user?.username ?? ''}
                  region={list.region ?? ''}
                  onHover={(hovered) =>
                    hovered ? setHoveredList(list.id) : null
                  }
                />
              </SkewedCard>
            )
          })}
        </SkewedCardCarousel>
      </>
    )
  }
)
