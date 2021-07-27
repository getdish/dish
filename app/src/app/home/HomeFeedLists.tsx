import { series } from '@dish/async'
import { graphql, order_by, query, resolved } from '@dish/graph'
import { Plus } from '@dish/react-feather'
import { shuffle } from 'lodash'
import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Divider, HStack, Spacer, Text, useDebounce } from 'snackui'

import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { homeStore } from '../homeStore'
import { SmallCircleButton } from '../views/CloseButton'
import { Link } from '../views/Link'
import { ListCard } from '../views/list/ListCard'
import { FIBase } from './FIBase'
import { HoverResultsProp } from './HoverResultsProp'
import { SimpleCard, SkewedCardCarousel } from './SimpleCard'

export type FIList = FIBase & {
  type: 'list'
  region: string
}

type Props = FIList & HoverResultsProp

export const HomeFeedLists = (props: Props) => {
  return (
    <Suspense fallback={null}>
      <HomeFeedListsContents {...props} />
      <Spacer size="xl" />
      <HomeFeedListsContents {...props} />
    </Suspense>
  )
}

export const HomeFeedListsContents = graphql(({ region, onHoverResults }: Props) => {
  let recentLists = query.list_populated({
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
        <>
          {/* marginVertical good on native */}
          <HStack marginVertical={-2} width="100%" alignItems="center">
            <Divider flex />
            <HStack alignItems="center" justifyContent="center">
              <Text
                backgroundColor="rgba(150,150,150,0.2)"
                paddingVertical={5}
                paddingHorizontal={12}
                borderRadius={100}
                fontWeight="500"
                fontSize={13}
              >
                Trending
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
                <SmallCircleButton padding={5}>
                  <Plus size={16} color="#fff" />
                </SmallCircleButton>
              </Link>
            </HStack>
            <Divider flex />
          </HStack>
        </>

        <SkewedCardCarousel>
          {recentLists.map((list, i) => {
            if (!list) {
              return null
            }
            return (
              <SimpleCard key={list.id || i} zIndex={1000 - i}>
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
              </SimpleCard>
            )
          })}
        </SkewedCardCarousel>
      </>
    )
  }, [key])
})
