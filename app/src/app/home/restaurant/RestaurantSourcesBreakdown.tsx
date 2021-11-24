import { graphql } from '@dish/graph'
import {
  Spacer,
  Table,
  TableCell,
  TableCellProps,
  TableHeadRow,
  TableHeadText,
  TableRow,
  Text,
  XStack,
  YStack,
} from '@dish/ui'
import { sortBy } from 'lodash'
import React, { memo } from 'react'

import { tagDisplayName } from '../../../constants/tagDisplayName'
import { thirdPartyCrawlSources } from '../../../constants/thirdPartyCrawlSources'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { homeStore } from '../../homeStore'
import { Image } from '../../views/Image'
import { useBreakdownsBySources } from './useBreakdownsBySources'

export const col0Props: TableCellProps = {
  flex: 0,
  minWidth: 30,
}

export const col2Props: TableCellProps = {
  justifyContent: 'flex-end',
}

export const col3Props: TableCellProps = {
  justifyContent: 'flex-end',
}

export const RestaurantSourcesBreakdown = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const [restaurant] = queryRestaurant(restaurantSlug)
    const sources = restaurant?.sources?.() ?? {}
    const tags = homeStore.lastActiveTags
    const reviewTags = sortBy(
      tags.filter((tag) => tag.name !== 'Gems'),
      (a) => (a.type === 'lense' ? 0 : a.type === 'dish' ? 2 : 1)
    )
    const breakdowns = useBreakdownsBySources(restaurantSlug, reviewTags)

    if (!breakdowns) {
      return null
    }

    return (
      <>
        <Spacer size="$6" />

        <Table>
          <TableHeadRow>
            <TableCell {...col0Props}></TableCell>

            <TableCell>
              <TableHeadText>Source</TableHeadText>
            </TableCell>

            {/* <TableCell {...col2Props}>
              <TableHeadText marginRight={5}>Weight</TableHeadText>
              <HelpCircle
                size={14}
                color={'rgba(0,0,0,0.3)'}
                style={{ margin: -2 }}
              />
            </TableCell> */}

            <TableCell {...col3Props}>
              <TableHeadText>Points</TableHeadText>
            </TableCell>
          </TableHeadRow>

          {Object.keys(sources).map((source, i) => {
            const item = breakdowns[source]
            if (!item) return null
            const info = thirdPartyCrawlSources[source]
            return (
              <React.Fragment key={source}>
                <TableRow>
                  <TableCell {...col0Props}>
                    {info?.image ? (
                      <Image
                        source={info.image}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 100,
                        }}
                      />
                    ) : null}
                  </TableCell>

                  <TableCell>
                    <Text fontSize={14} opacity={0.65}>
                      {info?.name ?? source}
                    </Text>
                  </TableCell>
                  {/*
                  <TableCell {...col2Props}>
                    <Text fontSize={14} opacity={0.65}>
                      {Math.round(i / 4)}
                    </Text>
                  </TableCell> */}

                  <TableCell {...col3Props}>
                    <Text fontSize={13}>{item['total']}</Text>
                  </TableCell>
                </TableRow>

                {reviewTags.map((tag) => (
                  <TableRow height={20} key={tag.slug}>
                    <TableCell {...col0Props} />

                    <TableCell>
                      <XStack flexWrap="nowrap" overflow="hidden" alignItems="center">
                        <YStack className="dotted-line" width={10} marginRight={5} />
                        <Text ellipse fontSize={12} opacity={0.5}>
                          {tagDisplayName(tag)}
                        </Text>
                      </XStack>
                    </TableCell>

                    <TableCell></TableCell>

                    <TableCell {...col3Props}>
                      <Text opacity={0.5} fontSize={12}>
                        {item[tag.name]}
                      </Text>
                    </TableCell>
                  </TableRow>
                ))}

                <Spacer size="$2" />
              </React.Fragment>
            )
          })}

          <TableRow borderTopColor="#eee" borderTopWidth={1}>
            <TableCell {...col0Props}></TableCell>
            <TableCell></TableCell>
            <TableCell {...col3Props}>
              <Text>{breakdowns['total_score']}</Text>
            </TableCell>
          </TableRow>
        </Table>
      </>
    )
  })
)
