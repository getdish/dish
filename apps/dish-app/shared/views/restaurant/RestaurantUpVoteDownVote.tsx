import { graphql } from '@dish/graph'
import { ChevronDown, ChevronUp } from '@dish/react-feather'
import {
  Box,
  HStack,
  HoverablePopover,
  SmallTitle,
  StackProps,
  TableCell,
  TableCellProps,
  TableRow,
  Text,
  Tooltip,
  VStack,
} from '@dish/ui'
import React, { Suspense, memo, useState } from 'react'

import { bgLight } from '../../colors'
import { useIsNarrow } from '../../hooks/useIs'
import { useRestaurantTagScores } from '../../hooks/useRestaurantTagScores'
import { useUserUpvoteDownvoteQuery } from '../../hooks/useUserReview'
import { ensureFlexText } from '../../pages/restaurant/ensureFlexText'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { Table, TableHeadRow, TableHeadText } from '../ui/Table'

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
      const isOpenProp =
        vote === 0
          ? null
          : {
              isOpen: false,
            }

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
          <VStack
            pointerEvents="auto"
            alignItems="center"
            justifyContent="center"
            width={56}
            height={56}
            marginLeft={-22}
            backgroundColor="#fff"
            marginRight={-4}
            shadowColor="rgba(0,0,0,0.1)"
            shadowRadius={10}
            shadowOffset={{ height: 3, width: -3 }}
            borderRadius={1000}
          >
            <Tooltip position="right" contents="Upvote" {...isOpenProp}>
              <VoteButton
                Icon={ChevronUp}
                voted={vote == 1}
                color={vote === 1 ? 'green' : null}
                onPress={(e) => {
                  e.stopPropagation()
                  setVote(vote === 1 ? 0 : 1)
                }}
              />
            </Tooltip>
            <Text
              fontSize={Math.min(16, 120 / `${score}`.length / 2)}
              fontWeight="700"
              marginVertical={-2}
              letterSpacing={-0.5}
              color={score > 0 ? '#000' : 'darkred'}
            >
              {score}
            </Text>
            <Tooltip position="right" contents="Downvote" {...isOpenProp}>
              <VoteButton
                Icon={ChevronDown}
                voted={vote == -1}
                color={vote === -1 ? 'red' : null}
                onPress={(e) => {
                  e.stopPropagation()
                  setVote(vote == -1 ? 0 : -1)
                }}
              />
            </Tooltip>
          </VStack>
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
    const tagScores = useRestaurantTagScores(restaurantSlug, activeTagIds)
    console.log('tagScores', tagScores)
    return (
      <Box
        maxWidth={300}
        overflow="hidden"
        minWidth={280}
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

const VoteButton = ({
  color,
  Icon,
  size,
  voted,
  ...props
}: StackProps & {
  voted?: boolean
  Icon: any
  color?: string | null
  size?: number
}) => {
  const isSmall = useIsNarrow()
  const scale = isSmall ? 1.1 : 1
  const [hovered, setHovered] = useState(false)
  return (
    <VStack
      width={22 * scale}
      height={22 * scale}
      borderRadius={100}
      alignItems="center"
      justifyContent="center"
      // borderWidth={1}
      // backgroundColor="#fff"
      // borderColor="#eee"
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      pressStyle={{
        backgroundColor: bgLight,
        borderColor: '#aaa',
      }}
      {...(voted && {
        backgroundColor: '#999',
      })}
      {...props}
    >
      <Icon
        size={(size ?? 18) * (voted ? 1.2 : 1)}
        color={color ?? (hovered ? '#000' : '#ccc')}
      />
    </VStack>
  )
}
