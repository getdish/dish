import { TagButtonProps } from './TagButton'
import { TagVotePopover } from './TagVotePopover'
import { graphql } from '@dish/graph'
import { Text, YStack, useTheme } from '@dish/ui'
import { Circle } from '@tamagui/feather-icons'
import React from 'react'

export const TagButtonVote = graphql(
  (
    props: TagButtonProps & {
      scale: number
      disablePopover?: boolean
      vote?: number
    }
  ) => {
    const { scale, vote } = props
    // const tagSlug = getTagSlug(props.slug)
    const theme = useTheme()
    const iconProps = {
      size: 10,
      color: 'rgba(150,150,150,0.1)',
    }
    const contents = (
      <YStack
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
        {!props.disablePopover && !vote && <Circle {...iconProps} />}
        {!!vote && (
          <YStack
            width={28 * scale}
            paddingLeft={6}
            height={28 * scale}
            borderColor="rgba(150,150,150,0.1)"
            borderLeftWidth={0.5}
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
          >
            <Text
              color={theme.color}
              letterSpacing={-1}
              fontSize={20 * scale}
              fontWeight="400"
            >
              {`${vote}`}
            </Text>
          </YStack>
        )}
      </YStack>
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
