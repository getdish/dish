import { graphql } from '@dish/graph'
import { Circle } from '@dish/react-feather'
import React from 'react'
import { Text, VStack, useTheme } from 'snackui'

import { getTagSlug } from '../../helpers/getTagSlug'
import { VoteNumber, useUserTagVotes } from '../hooks/useUserTagVotes'
import { TagButtonProps, TagVotePopover } from './TagButton'

export const TagButtonVote = graphql(
  (props: TagButtonProps & { scale: number; disablePopover?: boolean }) => {
    const { scale } = props
    const tagSlug = getTagSlug(props.slug)
    const { vote } = useUserTagVotes(
      props.restaurantSlug || '',
      {
        [tagSlug]: true,
      },
      props.refetchKey
    )
    const theme = useTheme()
    const iconProps = {
      size: 14,
      color: 'rgba(150,150,150,0.25)',
    }
    const contents = (
      <VStack
        alignItems="center"
        pointerEvents="auto"
        zIndex={100}
        position="relative"
        justifyContent="center"
        borderRadius={100}
        width={48 * scale}
        height={48 * scale}
        marginVertical={-8 * scale}
        marginHorizontal={-8 * scale}
        opacity={0.8}
      >
        {!props.disablePopover && vote === 0 && <Circle {...iconProps} />}
        {vote !== 0 && (
          <VStack
            // width={28 * scale}
            // height={28 * scale}
            // backgroundColor={theme.backgroundColor}
            // borderRadius={100}
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
          >
            <Text color={theme.color} letterSpacing={-1} fontSize={20 * scale} fontWeight="200">
              {vote < 0 ? vote : `${vote}`}
            </Text>
          </VStack>
        )}
      </VStack>
    )

    if (props.disablePopover) {
      return contents
    }

    // @ts-ignore
    return <TagVotePopover {...props}>{contents}</TagVotePopover>
  },
  {
    suspense: false,
  }
)
export const tagRatings = [1, 2, 3, 4, 5] as VoteNumber[]
