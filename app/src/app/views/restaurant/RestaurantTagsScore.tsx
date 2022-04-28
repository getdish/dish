import { getActiveTagSlugs } from '../../../helpers/getActiveTagSlugs'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { queryRestaurantTagScores } from '../../../queries/queryRestaurantTagScores'
import { HomeActiveTagsRecord } from '../../../types/homeTypes'
import { ensureFlexText } from '../../home/restaurant/ensureFlexText'
import { PointsText } from '../PointsText'
import { SmallTitle } from '../SmallTitle'
import { graphql } from '@dish/graph'
import {
  Card,
  Spacer,
  Table,
  TableCell,
  TableCellProps,
  TableHead,
  TableHeadText,
  TableRow,
  Text,
  XStack,
} from '@dish/ui'
import React from 'react'

export const RestaurantTagsScore = graphql(function RestaurantTagsScore({
  restaurantSlug,
  activeTags,
  userVote,
}: {
  restaurantSlug: string
  activeTags: HomeActiveTagsRecord
  userVote: number
}) {
  const [restaurant] = queryRestaurant(restaurantSlug)

  if (!restaurant) {
    return null
  }

  const breakdown = restaurant.score_breakdown
  const tagScores = queryRestaurantTagScores({
    restaurant,
    tagSlugs: getActiveTagSlugs(activeTags),
  })
  return (
    <Card
      maxWidth={320}
      overflow="hidden"
      minWidth={200}
      paddingVertical={20}
      paddingHorizontal={20}
    >
      <SmallTitle>Points Breakdown</SmallTitle>
      <Spacer />
      <XStack flex={1}>
        <Table flex={1} maxWidth="100%">
          <TableHead>
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
          </TableHead>
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
                  <XStack paddingTop={10}>
                    <Text ellipse fontWeight="500">
                      {tscore.icon} {tscore.name}
                    </Text>
                    {ensureFlexText}
                  </XStack>
                </TableCell>
                <TableCell {...col1Props}>
                  {i === 0 && <PointsText points={breakdownScoreDown(breakdown)} />}
                </TableCell>
                <TableCell {...col1Props}>
                  {i === 0 && <PointsText points={breakdownScoreUp(breakdown)} />}
                </TableCell>
                <TableCell {...col1Props}>
                  <PointsText fontWeight="600" points={finalScore} />
                </TableCell>
              </TableRow>
            )
          })}
        </Table>
      </XStack>
    </Card>
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
  return breakdown?.reviews['_1'].score ?? 0 + breakdown?.reviews['_2'].score ?? 0
}

function breakdownScoreUp(breakdown: any) {
  return (
    breakdown?.photos.score ??
    0 + breakdown?.reviews['_4'].score ??
    0 + breakdown?.reviews['_5'].score ??
    0
  )
}
