import React from 'react'
import { HStack, Paragraph, Spacer, Text, VStack } from 'snackui'

import { green, orange, purple } from '../../../../constants/colors'
import { RatingView } from '../../RatingView'
import { RestaurantRatingView } from '../../RestaurantRatingView'

export function BlogRatingDescription() {
  return (
    <>
      <Paragraph size="lg">
        We're working on this flower thing, where it shows{' '}
        <Text fontWeight="700" color={green}>
          food
        </Text>
        ,{' '}
        <Text fontWeight="700" color={orange}>
          service
        </Text>{' '}
        and{' '}
        <Text fontWeight="700" color={purple}>
          ambience
        </Text>{' '}
        all in one, it takes a sec to get used to, let it grow on you - it gives
        a good intuition based on it's "fullness", so you don't need to
        understand it right away.
      </Paragraph>

      <HStack justifyContent="center">
        <RestaurantRatingView size={72} slug="miss-saigon" />
        <Spacer />
        <VStack>
          <RatingView rating={50} size={20} stacked />
        </VStack>
      </HStack>
    </>
  )
}
