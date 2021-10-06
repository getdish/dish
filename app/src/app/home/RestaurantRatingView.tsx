import { graphql, restaurant } from '@dish/graph'
import React from 'react'
import { AbsoluteHStack, BlurView, Box, HStack, HoverablePopover, VStack, useTheme } from 'snackui'

import { suspense } from '../hoc/suspense'
import { ratingCount } from './ratingCount'
import { RatingView } from './RatingView'

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

      const getRatingInnerEl = (props) => <RatingView {...props} {...ratingViewProps} />
      let getRatingEl = getRatingInnerEl

      const theme = useTheme()

      if (showBreakdown) {
        getRatingEl = (props) => (
          <HStack position="relative" {...props}>
            {getRatingInnerEl({})}
            <AbsoluteHStack zIndex={-1} top="-24%" right="-24%">
              <AbsoluteHStack
                // width={400}
                borderRadius={100}
                alignItems="center"
                shadowRadius={5}
                shadowOffset={{ height: 3, width: 0 }}
                paddingHorizontal={16}
                paddingVertical={4}
                shadowColor={theme.shadowColor}
                overflow="hidden"
              >
                <AbsoluteHStack
                  backgroundColor={theme.backgroundColorDarker}
                  opacity={0.75}
                  fullscreen
                />
                <BlurView>
                  <RatingView {...ratingViewProps} stacked size={size * 0.66} />
                </BlurView>
              </AbsoluteHStack>
            </AbsoluteHStack>
          </HStack>
        )
      }

      if (!hoverable) {
        return getRatingEl({})
      }

      return (
        <VStack pointerEvents="auto">
          <HoverablePopover allowHoverOnContent placement="bottom right" trigger={getRatingEl}>
            {({ open }) => {
              if (open) {
                return (
                  <Box padding={15}>
                    <RatingView
                      {...ratingViewProps}
                      stacked
                      size={size * 0.66}
                      count={ratingCount(restaurant)}
                    />
                  </Box>
                )
              }
              return null
            }}
          </HoverablePopover>
        </VStack>
      )
    }
  ),
  (props) => <VStack width={props.size} height={props.size} />
)
