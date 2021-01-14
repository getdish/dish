import { graphql } from '@dish/graph'
import React from 'react'
import {
  Box,
  HStack,
  SmallTitle,
  Spacer,
  Table,
  TableCell,
  TableCellProps,
  TableHeadRow,
  TableHeadText,
  TableRow,
  Text,
} from 'snackui'

import { getActiveTagSlugs } from '../../../helpers/getActiveTagSlugs'
import { HomeActiveTagsRecord } from '../../../types/homeTypes'
import { ensureFlexText } from '../../home/restaurant/ensureFlexText'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { queryRestaurantTagScores } from '../../../queries/queryRestaurantTagScores'
import { PointsText } from '../PointsText'

export const RestaurantTagsScore = graphql(function RestaurantTagsScore({
  restaurantSlug,
  activeTags,
  userVote,
}: {
  restaurantSlug: string
  activeTags: HomeActiveTagsRecord
  userVote: number
}) {
  const restaurant = queryRestaurant(restaurantSlug)
  const breakdown = restaurant.score_breakdown()
  const tagScores = queryRestaurantTagScores({
    restaurantSlug,
    tagSlugs: getActiveTagSlugs(activeTags),
  })
  return (
    <Box
      maxWidth={320}
      overflow="hidden"
      minWidth={200}
      paddingVertical={20}
      paddingHorizontal={20}
    >
      <SmallTitle>Points Breakdown</SmallTitle>
      <Spacer />
      <HStack flex={1}>
        <Table flex={1} maxWidth="100%">
          <TableHeadRow>
            <TableCell {...col0Props}></TableCell>
            <TableCell {...col1Props}>
              <TableHeadText>Down</TableHeadText>
            </TableCell>
            <TableCell {...col1Props}>
              <TableHeadText>Up</TableHeadText>
            </TableCell>
            <TableCell {...col1Props}>
              <TableHeadText>Total</TableHeadText>
            </TableCell>
          </TableHeadRow>
          {[
            {
              name: restaurant.name,
              score: restaurant.score,
              icon: '',
            },
            ...tagScores,
          ].map((tscore, i) => {
            const finalScore = +(tscore.score ?? 0) + userVote
            return (
              <TableRow key={i}>
                <TableCell {...col0Props}>
                  <HStack paddingTop={10}>
                    <Text ellipse fontWeight="500">
                      {tscore.icon} {tscore.name}
                    </Text>
                    {ensureFlexText}
                  </HStack>
                </TableCell>
                <TableCell {...col1Props}>
                  {i === 0 && (
                    <PointsText points={breakdownScoreDown(breakdown)} />
                  )}
                </TableCell>
                <TableCell {...col1Props}>
                  {i === 0 && (
                    <PointsText points={breakdownScoreUp(breakdown)} />
                  )}
                </TableCell>
                <TableCell {...col1Props}>
                  <PointsText fontWeight="600" points={finalScore} />
                </TableCell>
              </TableRow>
            )
          })}
        </Table>
      </HStack>
    </Box>
  )
})

const col0Props: TableCellProps = {
  flex: 4,
  maxWidth: '70%',
}

const col1Props: TableCellProps = {
  flex: 1,
  minWidth: '20%',
  justifyContent: 'flex-end',
}

function breakdownScoreDown(breakdown: any) {
  return (
    breakdown?.reviews['_1'].score ?? 0 + breakdown?.reviews['_2'].score ?? 0
  )
}

function breakdownScoreUp(breakdown: any) {
  return (
    breakdown?.photos.score ??
    0 + breakdown?.reviews['_4'].score ??
    0 + breakdown?.reviews['_5'].score ??
    0
  )
}
