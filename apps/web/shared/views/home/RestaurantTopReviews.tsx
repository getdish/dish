import { graphql, query } from '@dish/graph'
import { HStack, Spacer, Text, VStack } from '@dish/ui'
import { memo, useState } from 'react'

import { CommentBubble } from './RestaurantAddComment'
import { SmallButton } from './SmallButton'

const listItems = [
  {
    category: 'Food',
    review: `Authentic. Don't miss: lychee tempura ice cream`,
  },
  {
    category: 'Vibe',
    review: 'Laid back, good service',
  },
  {
    category: 'Rest',
    review: 'Quick, cheap, local favorite',
  },
]

export const RestaurantTopReviews = memo(
  graphql(
    ({
      restaurantId,
      expandTopComments,
      afterTopCommentButton,
    }: {
      restaurantId: string
      expandTopComments?: boolean
      afterTopCommentButton?: any
    }) => {
      const [showMore, setShowMore] = useState(false)
      const [topReview] = query.review({
        limit: 1,
        where: {
          restaurant_id: {
            _eq: restaurantId,
          },
        },
      })
      return (
        <VStack alignSelf="stretch" paddingRight={20}>
          <VStack marginTop={4} marginBottom={12} spacing={10}>
            {listItems.map((item) => (
              <React.Fragment key={item.category}>
                <Text fontSize={14}>
                  <HStack
                    display="inline-flex"
                    width={45}
                    marginRight={5}
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Text
                      backgroundColor="#f2f2f2"
                      paddingVertical={2}
                      paddingHorizontal={5}
                      borderRadius={6}
                      fontWeight="500"
                    >
                      {item.category}
                    </Text>
                  </HStack>
                  <Text>{item.review}</Text>
                </Text>
              </React.Fragment>
            ))}
          </VStack>

          <HStack>
            {!expandTopComments && (
              <SmallButton
                onPress={() => {
                  setShowMore((x) => !x)
                }}
              >
                <Text fontSize={13} opacity={0.7}>
                  {showMore ? 'Show less' : 'Top comments'}
                </Text>
              </SmallButton>
            )}
            {afterTopCommentButton ? (
              <>
                <Spacer />
                {afterTopCommentButton}
              </>
            ) : null}
          </HStack>

          {(showMore || expandTopComments) && (
            <VStack paddingTop={20} spacing={10}>
              {[1, 2, 3].map((i) => (
                <CommentBubble
                  key={i}
                  user={{ username: topReview?.user?.username ?? 'PeachBot' }}
                >
                  <Text selectable opacity={0.8} lineHeight={20} fontSize={14}>
                    {topReview?.text ||
                      `Lorem ipsu dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit ipsum sit amet. Lorem ipsum dolor sit amet sit amet. Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.`}
                  </Text>
                </CommentBubble>
              ))}
            </VStack>
          )}
        </VStack>
      )
    }
  )
)
