import { graphql } from '@dish/graph'
import {
  Divider,
  HStack,
  Paragraph,
  Spacer,
  Text,
  TextProps,
  VStack,
} from '@dish/ui'
import React, { memo, useState } from 'react'
import { View } from 'react-native'

import { lightGreen, lightYellow } from '../../colors'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { omStatic } from '../../state/omStatic'
import { SmallButton } from '../../views/ui/SmallButton'
import { TextStrong } from '../../views/ui/TextStrong'
import { RestaurantSourcesBreakdown } from './RestaurantSourcesBreakdown'
import { useTotalReviews } from './useTotalReviews'

const TextHighlight = (props: TextProps) => (
  <Text padding={2} margin={-2} borderRadius={6} {...props} />
)

export const RestaurantPointsBreakdown = memo(
  graphql((props: { restaurantSlug: string; showTable?: boolean }) => {
    const restaurant = useRestaurantQuery(props.restaurantSlug)
    const [showTable, setShowTable] = useState(props.showTable)
    const tags = omStatic.state.home.lastActiveTags
    const totalReviews = useTotalReviews(restaurant)
    return (
      <HStack overflow="hidden" paddingVertical={12}>
        <VStack alignItems="stretch" flex={1}>
          <Paragraph size={1} color="rgba(0,0,0,0.7)">
            <TextStrong>{restaurant.name}</TextStrong> has 294 points in{' '}
            <Text borderBottomWidth={1} borderColor="#eee">
              {tags.map((x) => x.name).join(' + ')}
            </Text>{' '}
            from {totalReviews} reviews.
          </Paragraph>

          <Spacer size="lg" />
          <Divider />
          <Spacer size="lg" />

          <Paragraph textAlign="center" size={0.9} color="rgba(0,0,0,0.6)">
            <TextHighlight backgroundColor={lightGreen}>
              <TextStrong color="#000">+121</TextStrong>
            </TextHighlight>{' '}
            from 23 dish reviewers
            <View />
            <TextHighlight backgroundColor={lightYellow}>
              <TextStrong color="#000">+89</TextStrong>
            </TextHighlight>{' '}
            from Yelp, DoorDash, and TripAdvisor .
          </Paragraph>

          {showTable && (
            <RestaurantSourcesBreakdown restaurantSlug={props.restaurantSlug} />
          )}

          {!props.showTable && (
            <>
              <Spacer size="lg" />

              <SmallButton
                alignSelf="center"
                onPress={() => setShowTable((x) => !x)}
              >
                {showTable ? 'Hide breakdown' : 'Points breakdown'}
              </SmallButton>
            </>
          )}
        </VStack>
      </HStack>
    )
  })
)
