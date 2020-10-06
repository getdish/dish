import { graphql } from '@dish/graph'
import { HelpCircle } from '@dish/react-feather'
import {
  HStack,
  Spacer,
  StackProps,
  Table,
  TableCell,
  TableHeadRow,
  TableHeadText,
  TableRow,
  Text,
  VStack,
} from '@dish/ui'
import { sortBy } from 'lodash'
import React, { memo } from 'react'
import { Image } from 'react-native'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { omStatic } from '../../state/omStatic'
import { tagDisplayName } from '../../state/tagDisplayName'
import { thirdPartyCrawlSources } from '../../thirdPartyCrawlSources'

export const col0Props: StackProps = {
  flex: 0,
  minWidth: 30,
}

export const col2Props: StackProps = {
  justifyContent: 'flex-end',
}

export const col3Props: StackProps = {
  justifyContent: 'flex-end',
}

export const RestaurantSourcesBreakdown = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const sources = restaurant?.sources?.() ?? {}
    const tags = omStatic.state.home.lastActiveTags
    const reviewTags = sortBy(
      tags.filter((tag) => tag.name !== 'Gems'),
      (a) => (a.type === 'lense' ? 0 : a.type === 'dish' ? 2 : 1)
    )
    return (
      <>
        <Spacer size="lg" />

        <Table className="hide-when-small">
          <TableHeadRow>
            <TableCell {...col0Props}></TableCell>

            <TableCell>
              <TableHeadText>Source</TableHeadText>
            </TableCell>

            <TableCell {...col2Props}>
              <TableHeadText marginRight={5}>Weight</TableHeadText>
              <HelpCircle
                size={14}
                color={'rgba(0,0,0,0.3)'}
                style={{ margin: -2 }}
              />
            </TableCell>

            <TableCell {...col3Props}>
              <TableHeadText>Points</TableHeadText>
            </TableCell>
          </TableHeadRow>

          {Object.keys(sources).map((source, i) => {
            const item = sources[source]
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

                  <TableCell {...col2Props}>
                    <Text fontSize={14} opacity={0.65}>
                      {Math.round(i / 4)}
                    </Text>
                  </TableCell>

                  <TableCell {...col3Props}>
                    <Text fontSize={13}>
                      {Math.round(+(item.rating ?? 0) * 10)}
                    </Text>
                  </TableCell>
                </TableRow>

                {reviewTags.map((tag) => (
                  <TableRow height={20} key={tag.name + tag.type}>
                    <TableCell {...col0Props} />

                    <TableCell>
                      <HStack
                        flexWrap="nowrap"
                        overflow="hidden"
                        alignItems="center"
                      >
                        <VStack
                          className="dotted-line"
                          width={10}
                          marginRight={5}
                        />
                        <Text ellipse fontSize={12} opacity={0.5}>
                          {tagDisplayName(tag)}
                        </Text>
                      </HStack>
                    </TableCell>

                    <TableCell></TableCell>

                    <TableCell {...col3Props}>
                      <Text opacity={0.5} fontSize={12}>
                        {Math.round(
                          (+(item.rating ?? 0) * 10) / reviewTags.length
                        )}
                      </Text>
                    </TableCell>
                  </TableRow>
                ))}

                <Spacer size="sm" />
              </React.Fragment>
            )
          })}

          <TableRow borderTopColor="#eee" borderTopWidth={1}>
            <TableCell {...col0Props}></TableCell>
            <TableCell></TableCell>
            <TableCell {...col3Props}>
              <Text>294</Text>
            </TableCell>
          </TableRow>
        </Table>
      </>
    )
  })
)
