import { graphql, query } from '@dish/graph'
import { HStack, Text, VStack } from '@dish/ui'
import { memo, useState } from 'react'

import { CommentBubble } from './RestaurantAddComment'
import { SmallButton } from './SmallButton'

const listItems = [
  {
    category: 'Food',
    review: 'The ',
  },
  {
    category: 'Vibe',
    review: 'Laid back',
  },
  {
    category: 'Wait',
    review: 'Not bad',
  },
]

export const RestaurantTopReviews = memo(
  graphql(
    ({
      restaurantId,
      expandTopComments,
    }: {
      restaurantId: string
      expandTopComments?: boolean
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
              <li key={item.category}>
                <Text fontSize={14}>
                  <Text fontWeight="600">{item.category}</Text> —{' '}
                  <Text>{item.review}</Text>
                </Text>
              </li>
            ))}
          </VStack>

          {!expandTopComments && (
            <SmallButton
              onPress={() => {
                setShowMore((x) => !x)
              }}
            >
              <Text fontSize={14} opacity={0.7}>
                {showMore ? 'Show less' : 'Top comments'}
              </Text>
            </SmallButton>
          )}

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
