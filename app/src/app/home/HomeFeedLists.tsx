// not in use

import { series } from '@dish/async'
import { graphql, list, order_by, query, resolved } from '@dish/graph'
import { Plus } from '@dish/react-feather'
import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Divider, HStack, Paragraph, Spacer, VStack, useDebounce } from 'snackui'

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

export const HomeFeedLists = graphql((props: Props) => {
  const recent = query.list_populated({
    args: {
      min_items: 2,
    },
    limit: 8,
    where: {
      public: {
        _neq: false,
      },
      region: {
        _eq: props.region,
      },
    },
    order_by: [{ created_at: order_by.desc }],
  })

  // const trending = query.list_populated({
  //   args: {
  //     min_items: 2,
  //   },
  //   limit: 8,
  //   where: {
  //     public: {
  //       _neq: false,
  //     },
  //     region: {
  //       _eq: props.region,
  //     },
  //   },
  //   order_by: [{ list_reviews_aggregate: { avg: { rating: order_by.desc } } }],
  // })

  return (
    <Suspense fallback={null}>
      {/* <HomeFeedListsContents lists={trending} {...props} title="Trending" /> */}
      <HomeFeedListsContents lists={recent} {...props} title="Recent" />
    </Suspense>
  )
})

export const HomeFeedListsContents = graphql(
  ({ title, lists, region, onHoverResults }: Props & { lists: list[] }) => {
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

    const key = `${lists?.map((x) => x.id)}`

    return useMemo(() => {
      if (!lists.length) {
        return null
      }
      return (
        <VStack paddingVertical={10}>
          <>
            {/* marginVertical good on native */}
            <HStack marginVertical={-2} width="100%" alignItems="center">
              <Divider flex />
              <HStack zIndex={10} alignItems="center" justifyContent="center">
                <Paragraph
                  backgroundColor="rgba(150,150,150,0.1)"
                  paddingVertical={5}
                  paddingHorizontal={12}
                  borderRadius={100}
                  fontWeight="500"
                  fontSize={13}
                >
                  {title}
                </Paragraph>
                <Spacer size="sm" />
                <Link
                  marginRight={-30}
                  promptLogin
                  name="list"
                  params={{
                    userSlug: 'me',
                    slug: 'create',
                  }}
                >
                  <SmallCircleButton>
                    <Plus size={16} color="#999" />
                  </SmallCircleButton>
                </Link>
              </HStack>
              <Divider flex />
            </HStack>
          </>
        </VStack>
      )
    }, [key])
  }
)
