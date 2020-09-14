import { graphql } from '@dish/graph'
import { ChevronDown, ChevronUp } from '@dish/react-feather'
import { Spacer, StackProps, Text, Tooltip, VStack } from '@dish/ui'
import React, { memo, useState } from 'react'

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
              onPressOut={() => {
                setVote(vote === 1 ? 0 : 1)
              }}
            />
          </Tooltip>
          <Text
            fontSize={100 / `${score}`.length / 2}
            fontWeight="600"
            marginVertical={-2}
            color={score > 0 ? '#000' : 'darkred'}
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
  size,
  voted,
  ...props
}: StackProps & {
  voted?: boolean
  Icon: any
  color?: string | null
  size?: number
}) => {
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
