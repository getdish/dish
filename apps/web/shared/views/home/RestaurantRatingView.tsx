import { query } from '@dish/graph'
import { Restaurant } from '@dish/models'
import { graphql } from '@gqless/react'
import React, { forwardRef, memo } from 'react'
import { Text } from 'react-native'

import { Box } from '../ui/Box'
import { Circle } from '../ui/Circle'
import { HoverablePopover } from '../ui/HoverablePopover'
import { ProgressCircle } from '../ui/ProgressCircle'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { RatingView, RatingViewProps } from './RatingView'

export type RestaurantRatingViewProps = Omit<
  Pick<RatingViewProps, 'size'>,
  'percent' | 'color'
> & {
  restaurantSlug: string
}

export const getRestaurantRating = (rating: number) => Math.round(rating * 20)

export const getRankingColor = (percent: number) =>
  percent > 84 ? 'green' : percent > 60 ? 'orange' : 'red'

export default graphql(function RestaurantRatingView({
  restaurantSlug,
  ...rest
}: RestaurantRatingViewProps) {
  console.log('restaurantSlug', restaurantSlug)
  return null
  const [restaurant] = query.restaurant({
    where: {
      slug: {
        _eq: restaurantSlug,
      },
    },
  })
  // console.log('restaurant.rating_factors', restaurant.rating_factors)
  const percent = getRestaurantRating(restaurant.rating)
  const color = getRankingColor(percent)
  return (
    <VStack>
      <RatingView percent={percent} color={color} {...rest} />
      {rest.size === 'lg' && (
        <HoverablePopover
          contents={
            <Box>
              <VStack marginTop={-8} marginHorizontal={-18} alignItems="center">
                <HStack
                  alignItems="center"
                  paddingHorizontal={10 + 18}
                  spacing={20}
                  paddingVertical={12}
                >
                  <VStack
                    zIndex={10}
                    flex={1}
                    minWidth={90}
                    maxWidth={120}
                    marginHorizontal={-12}
                  >
                    <RatingBreakdownCircle
                      percent={restaurant.rating_factors?.food}
                      emoji="🧑‍🍳"
                      name="Food"
                    />
                  </VStack>

                  <VStack
                    zIndex={9}
                    flex={1}
                    minWidth={90}
                    maxWidth={120}
                    marginHorizontal={-12}
                  >
                    <RatingBreakdownCircle
                      percent={restaurant.rating_factors?.service}
                      emoji="💁‍♂️"
                      name="Service"
                    />
                  </VStack>

                  <VStack
                    zIndex={8}
                    flex={1}
                    minWidth={90}
                    maxWidth={120}
                    marginHorizontal={-12}
                  >
                    <RatingBreakdownCircle
                      percent={restaurant.rating_factors?.ambience}
                      emoji="✨"
                      name="Ambiance"
                    />
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          }
        >
          <HStack height="100%" alignItems="center" paddingRight={20}>
            <Circle
              marginHorizontal={-5}
              size={30}
              backgroundColor="rgba(0,205,100,1)"
            >
              <RatingBreakdownCircle
                percent={restaurant.rating_factors?.service}
                emoji="👩‍🍳"
                size={30}
              />
            </Circle>
            <Circle
              marginHorizontal={-5}
              size={30}
              backgroundColor="rgba(0,205,100,1)"
            />
            <Circle
              marginHorizontal={-5}
              size={30}
              backgroundColor="rgba(0,205,100,1)"
            />
          </HStack>
        </HoverablePopover>
      )}
    </VStack>
  )
})

const RatingBreakdownCircle = memo(
  ({
    emoji,
    name,
    percent,
    size = 43,
  }: {
    emoji: string
    name?: string
    size?: number
    percent: number
  }) => {
    return (
      <VStack
        borderRadius={100}
        alignItems="center"
        width="100%"
        height="auto"
        paddingTop="100%"
        backgroundColor="#fff"
        shadowColor="rgba(0,0,0,0.06)"
        shadowRadius={8}
        shadowOffset={{ height: 4, width: 0 }}
      >
        <ZStack
          top={0}
          left={0}
          right={0}
          bottom={0}
          position="absolute"
          borderRadius={100}
          backgroundColor="white"
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
        >
          <ProgressCircle
            percent={50}
            radius={size}
            borderWidth={1}
            color="#ccc"
          />
        </ZStack>
        <ZStack fullscreen alignItems="center" justifyContent="center">
          <Text style={{ fontSize: 20, marginBottom: 0 }}>{emoji}</Text>
          {!!name && (
            <Text style={{ fontSize: 12, color: '#555', fontWeight: '700' }}>
              {name}
            </Text>
          )}
        </ZStack>
      </VStack>
    )
  }
)
