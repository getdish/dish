import { suspense } from '../hoc/suspense'
import { RatingView } from './RatingView'
import { ratingCount } from './ratingCount'
import { graphql, restaurant } from '@dish/graph'
import { AbsoluteXStack, BlurView, Card, TooltipSimple, XStack, YStack } from '@dish/ui'
import React from 'react'

export const RestaurantRatingView = suspense(
  graphql(
    ({
      restaurant,
      size = 32,
      floating,
      hoverable,
      showBreakdown,
    }: {
      hoverable?: boolean
      restaurant?: restaurant
      size?: number
      floating?: boolean
      showBreakdown?: boolean
    }) => {
      if (!restaurant) {
        return null
      }
      const ratingViewProps = {
        rating: restaurant.rating,
        size,
        floating,
      }

      // console.log(
      //   'TODO SHOW SERVICE + VIBE',
      //   restaurant
      //     .tags({
      //       where: {
      //         tag: {
      //           id: {
      //             _in: [
      //               '30d67fcc-759b-4cd6-8241-400028de9196',
      //               '5da93fbe-5715-43b4-8b15-6521e3897bd9',
      //             ],
      //           },
      //         },
      //       },
      //     })
      //     .map((rtag) => {
      //       rtag.rating
      //       rtag.upvotes
      //       rtag.votes_ratio
      //       rtag.score
      //       return { ...rtag }
      //     })
      // )

      let content = <RatingView {...ratingViewProps} />

      if (showBreakdown) {
        content = (
          <XStack position="relative">
            {content}
            <AbsoluteXStack zIndex={-1} top="-24%" right="-24%">
              <AbsoluteXStack
                // width={400}
                borderRadius={100}
                alignItems="center"
                shadowRadius={5}
                shadowOffset={{ height: 3, width: 0 }}
                paddingHorizontal={16}
                paddingVertical={4}
                shadowColor="$shadowColor"
                overflow="hidden"
              >
                <AbsoluteXStack
                  backgroundColor="$backgroundStrong"
                  opacity={0.75}
                  fullscreen
                />
                <BlurView>
                  <RatingView {...ratingViewProps} stacked size={size * 0.66} />
                </BlurView>
              </AbsoluteXStack>
            </AbsoluteXStack>
          </XStack>
        )
      }

      if (!hoverable) {
        return content
      }

      return (
        <YStack pointerEvents="auto">
          <TooltipSimple placement="right-end" label={content}>
            <Card padding={15}>
              <RatingView
                {...ratingViewProps}
                stacked
                size={size * 0.66}
                count={ratingCount(restaurant)}
              />
            </Card>
          </TooltipSimple>
        </YStack>
      )
    }
  ),
  (props) => <YStack width={props.size} height={props.size} />
)
