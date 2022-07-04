import { getTagSlug } from '../../helpers/getTagSlug'
import { useUserTagVotes } from '../hooks/useUserTagVotes'
import { LinkButton } from './LinkButton'
import { TagButtonProps } from './TagButton'
import { tagRatings } from './tagRatings'
import { graphql } from '@dish/graph'
import { Card, Theme, TooltipSimple, TooltipSimpleProps, XStack } from '@dish/ui'
import React, { useRef } from 'react'

export const TagVotePopover = graphql(
  ({
    slug,
    restaurant,
    children,
    ...popoverProps
  }: Omit<Partial<TooltipSimpleProps>, 'placement' | 'style'> & TagButtonProps) => {
    const hovPopRef = useRef<any>()
    const tagSlug = getTagSlug(slug)
    const { vote, setVote } = useUserTagVotes({
      restaurant,
      activeTags: [tagSlug],
    })

    return (
      <TooltipSimple
        // @ts-ignore
        ref={hovPopRef as any}
        placement="top"
        {...popoverProps}
        label={
          <Card theme="dark" paddingVertical={1} paddingHorizontal={1} borderRadius={80}>
            <XStack>
              {tagRatings.map((rating) => (
                <LinkButton
                  promptLogin
                  borderRadius={1000}
                  width={38}
                  height={38}
                  paddingHorizontal={0}
                  letterSpacing={-1}
                  fontWeight="600"
                  onPress={(e) => {
                    e.stopPropagation()
                    setVote(rating)
                    // give time to see it update
                    setTimeout(() => {
                      hovPopRef.current?.close()
                    }, 200)
                  }}
                  key={rating}
                  {...(vote === rating
                    ? {
                        backgroundColor: '$blue3',
                      }
                    : {
                        backgroundColor: 'transparent',
                      })}
                >
                  {rating}
                </LinkButton>
              ))}
            </XStack>
          </Card>
        }
      >
        {children}
      </TooltipSimple>
    )
  },
  {
    suspense: false,
  }
)
