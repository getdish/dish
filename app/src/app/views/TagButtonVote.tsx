import { graphql } from '@dish/graph'
import { Circle } from '@dish/react-feather'
import React from 'react'
import { Text, VStack, useTheme } from 'snackui'

import { VoteNumber, useUserTagVotes } from '../hooks/useUserTagVotes'
import { TagButtonProps, TagVotePopover } from './TagButton'

export const TagButtonVote = graphql(
  (
    props: TagButtonProps & {
      scale: number
      disablePopover?: boolean
      vote: number
    }
  ) => {
    const { scale, vote } = props
    // const tagSlug = getTagSlug(props.slug)
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
        marginVertical={-14 * scale}
        marginHorizontal={-8 * scale}
      >
        {!props.disablePopover && vote === 0 && <Circle {...iconProps} />}
        {vote !== 0 && (
          <VStack
            width={28 * scale}
            paddingLeft={6}
            height={28 * scale}
            // backgroundColor={theme.backgroundColor}
            // borderRadius={100}
            borderColor="rgba(150,150,150,0.1)"
            borderLeftWidth={0.5}
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
          >
            <Text color={theme.color} letterSpacing={-1} fontSize={20 * scale} fontWeight="400">
              {vote < 0 ? vote : `${vote}`}
            </Text>
          </VStack>
        )}
      </VStack>
    )

    if (props.disablePopover) {
      return contents
    }

    return <TagVotePopover {...props}>{contents}</TagVotePopover>
  },
  {
    suspense: false,
  }
)
export const tagRatings = [1, 2, 3, 4, 5] as VoteNumber[]
