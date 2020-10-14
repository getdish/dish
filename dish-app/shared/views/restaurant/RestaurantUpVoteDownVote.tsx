import { graphql } from '@dish/graph'
import {
  Box,
  HStack,
  HoverablePopover,
  SmallTitle,
  Spacer,
  Table,
  TableCell,
  TableCellProps,
  TableHeadRow,
  TableHeadText,
  TableRow,
  Text,
} from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { getCurrentTagNames } from '../../helpers/getCurrentTagNames'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useRestaurantTagScores } from '../../hooks/useRestaurantTagScores'
import { useUserUpvoteDownvoteQuery } from '../../hooks/useUserUpvoteDownvoteQuery'
import { ensureFlexText } from '../../pages/restaurant/ensureFlexText'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { PointsText } from '../PointsText'
import { UpvoteDownvoteScore } from '../UpvoteDownvoteScore'

type UpvoteDownvoteProps = {
  restaurantId: string
  restaurantSlug: string
  score: number
  activeTagIds: HomeActiveTagsRecord
}

export const RestaurantUpVoteDownVote = (props: UpvoteDownvoteProps) => {
  return (
    <Suspense
      fallback={
        <UpvoteDownvoteScore
          marginLeft={-22}
          marginRight={-4}
          score={0}
          vote={0}
        />
      }
    >
      <RestaurantUpVoteDownVoteContents {...props} />
    </Suspense>
  )
}

const RestaurantUpVoteDownVoteContents = memo(
  graphql(function RestaurantUpVoteDownVote({
    restaurantId,
    restaurantSlug,
    score: baseScore,
    activeTagIds,
  }: UpvoteDownvoteProps) {
    const { vote, setVote } = useUserUpvoteDownvoteQuery(
      restaurantId,
      activeTagIds
    )
    const score = baseScore + vote
    return (
      <HoverablePopover
        position="right"
        delay={500}
        // allowHoverOnContent
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
  })
)

const col0Props: TableCellProps = {
  flex: 4,
  maxWidth: '70%',
}

const col1Props: TableCellProps = {
  flex: 1,
  minWidth: '20%',
  justifyContent: 'flex-end',
}

const RestaurantTagsScore = graphql(function RestaurantTagsScore({
  restaurantSlug,
  activeTagIds,
  userVote,
}: {
  restaurantSlug: string
  activeTagIds: HomeActiveTagsRecord
  userVote: number
}) {
  const restaurant = useRestaurantQuery(restaurantSlug)
  const breakdown = restaurant.score_breakdown()
  const tagScores = useRestaurantTagScores({
    restaurantSlug,
    tagNames: getCurrentTagNames(activeTagIds),
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
