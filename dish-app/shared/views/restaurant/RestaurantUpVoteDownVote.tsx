import { graphql } from '@dish/graph'
import {
  Box,
  HStack,
  HoverablePopover,
  SmallTitle,
  TableCell,
  TableCellProps,
  TableRow,
  Text,
} from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { getCurrentTagNames } from '../../helpers/getCurrentTagNames'
import { useRestaurantTagScores } from '../../hooks/useRestaurantTagScores'
import { useUserUpvoteDownvoteQuery } from '../../hooks/useUserUpvoteDownvoteQuery'
import { ensureFlexText } from '../../pages/restaurant/ensureFlexText'
import { HomeActiveTagsRecord } from '../../state/home-types'
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
    const tagScores = useRestaurantTagScores({
      restaurantSlug,
      tagNames: getCurrentTagNames(activeTagIds),
    })
    return (
      <Box
        maxWidth={240}
        overflow="hidden"
        minWidth={200}
        paddingVertical={15}
        paddingHorizontal={20}
      >
        <SmallTitle divider="off">Points Breakdown</SmallTitle>
        {/* {JSON.stringify(restaurant.score_breakdown())} */}
        <HStack flex={1}>
          <Table flex={1}>
            <TableHeadRow>
              <TableCell {...col0Props}>
                <TableHeadText>Tag</TableHeadText>
              </TableCell>
              <TableCell {...col1Props}>
                <TableHeadText>Points</TableHeadText>
              </TableCell>
            </TableHeadRow>
            {tagScores.map((tscore, i) => {
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
                    <Text
                      fontWeight="bold"
                      color={
                        finalScore > 0
                          ? 'green'
                          : finalScore < 0
                          ? 'red'
                          : '#888'
                      }
                    >
                      {finalScore > 0 ? '+' : ''}
                      {finalScore}
                    </Text>
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
