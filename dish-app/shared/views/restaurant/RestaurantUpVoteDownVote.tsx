import { graphql } from '@dish/graph'
import {
  Box,
  HStack,
  HoverablePopover,
  SmallTitle,
  Spacer,
  TableCell,
  TableCellProps,
  TableRow,
  Text,
  VStack,
} from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { getCurrentTagNames } from '../../helpers/getCurrentTagNames'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useRestaurantTagScores } from '../../hooks/useRestaurantTagScores'
import { useUserUpvoteDownvoteQuery } from '../../hooks/useUserUpvoteDownvoteQuery'
import { ensureFlexText } from '../../pages/restaurant/ensureFlexText'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { PointsText } from '../PointsText'
import { Table, TableHeadRow, TableHeadText } from '../ui/Table'
import { UpvoteDownvoteScore } from '../UpvoteDownvoteScore'

export const RestaurantUpVoteDownVote = memo(
  graphql(
    ({
      restaurantId,
      restaurantSlug,
      score: baseScore,
      activeTagIds,
    }: {
      restaurantId: string
      restaurantSlug: string
      score: number
      activeTagIds: HomeActiveTagsRecord
    }) => {
      const { vote, setVote } = useUserUpvoteDownvoteQuery(
        restaurantId,
        activeTagIds
      )
      const score = baseScore + vote
      return (
        <HoverablePopover
          position="right"
          contents={(isOpen) => {
            if (isOpen) {
              return (
                <Suspense fallback={null}>
                  <RestaurantTagsScore
                    restaurantSlug={restaurantSlug}
                    activeTagIds={activeTagIds}
                    userVote={vote}
                  />
                </Suspense>
              )
            }
            return null
          }}
        >
          <UpvoteDownvoteScore
            marginLeft={-22}
            marginRight={-4}
            score={score}
            vote={vote}
            setVote={setVote}
          />
        </HoverablePopover>
      )
    }
  )
)

const col0Props: TableCellProps = {
  flex: 2,
  maxWidth: '70%',
}

const col1Props: TableCellProps = {
  flex: 1,
  minWidth: '20%',
  justifyContent: 'flex-end',
}

const RestaurantTagsScore = graphql(
  ({
    restaurantSlug,
    activeTagIds,
    userVote,
  }: {
    restaurantSlug: string
    activeTagIds: HomeActiveTagsRecord
    userVote: number
  }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const breakdown = restaurant.score_breakdown()
    const tagScores = useRestaurantTagScores({
      restaurantSlug,
      tagNames: getCurrentTagNames(activeTagIds),
    })
    return (
      <Box
        maxWidth={340}
        overflow="hidden"
        minWidth={200}
        paddingVertical={15}
        paddingHorizontal={20}
      >
        <SmallTitle divider="off">Points Breakdown</SmallTitle>
        <Spacer />
        <HStack flex={1}>
          <Table flex={1} maxWidth="100%">
            <TableHeadRow>
              <TableCell {...col0Props}>
                {/* <TableHeadText>Tag</TableHeadText> */}
              </TableCell>
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
                    <HStack>
                      <Text>
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
                    <PointsText points={finalScore} />
                  </TableCell>
                </TableRow>
              )
            })}
          </Table>
        </HStack>
      </Box>
    )
  }
)

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
