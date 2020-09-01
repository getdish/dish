import { graphql } from '@dish/graph'
import { Spacer, StackProps, Text, Tooltip, VStack } from '@dish/ui'
import React, { memo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'

import { bgLight } from '../../colors'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { useMediaQueryIsSmall } from './useMediaQueryIs'
import { useUserUpvoteDownvoteQuery } from './useUserReview'

export const RestaurantUpVoteDownVote = memo(
  graphql(
    ({
      restaurantId,
      activeTagIds,
    }: {
      restaurantId: string
      activeTagIds: HomeActiveTagsRecord
    }) => {
      const [vote, setVote] = useUserUpvoteDownvoteQuery(
        restaurantId,
        activeTagIds
      )
      const isOpenProp =
        vote === 0
          ? null
          : {
              isOpen: false,
            }

      const score = 294 + vote

      return (
        <VStack
          // className="hover-to-reveal-child"
          pointerEvents="auto"
          alignItems="center"
          justifyContent="center"
        >
          <Tooltip position="right" contents="Upvote" {...isOpenProp}>
            <VoteButton
              Icon={ChevronUp}
              voted={vote == 1}
              color={vote === 1 ? 'green' : null}
              onPressOut={() => {
                setVote(vote === 1 ? 0 : 1)
              }}
            />
          </Tooltip>
          <Text
            fontSize={score <= 9 ? 26 : score <= 99 ? 22 : 18}
            fontWeight="600"
            marginVertical={-2}
          >
            {score}
          </Text>
          <Tooltip position="right" contents="Downvote" {...isOpenProp}>
            <VoteButton
              Icon={ChevronDown}
              voted={vote == -1}
              color={vote === -1 ? 'red' : null}
              onPressOut={() => {
                setVote(vote == -1 ? 0 : -1)
              }}
            />
          </Tooltip>
        </VStack>
      )
    }
  )
)

const VoteButton = ({
  color,
  Icon,
  ...props
}: StackProps & { voted?: boolean; Icon: any; color?: string }) => {
  const isSmall = useMediaQueryIsSmall()
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
      {...(props.voted && {
        backgroundColor: '#999',
      })}
      {...props}
    >
      <Icon size={18} color={color ?? (hovered ? '#000' : '#ccc')} />
    </VStack>
  )
}
