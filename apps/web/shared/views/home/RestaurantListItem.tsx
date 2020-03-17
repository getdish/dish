import React from 'react'
import { Image, Text } from 'react-native'
import { Link } from 'react-router-dom'
import { Restaurant } from '@dish/models'
import { HStack, VStack } from '../shared/Stacks'
import { Spacer } from '../shared/Spacer'
import { TagButton } from './TagButton'

export function RestaurantListItem({
  restaurant,
  rank,
}: {
  restaurant: Restaurant
  rank: number
}) {
  return (
    <HStack alignItems="center" overflow="scroll">
      <VStack padding={18} width="70%" maxWidth={525}>
        <Link to={'/e/' + restaurant.id}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: 'bold',
              textDecorationColor: 'transparent',
            }}
          >
            {rank}. {restaurant.name}
          </Text>
        </Link>

        <Spacer />

        <Text style={{ opacity: 0.5 }}>
          {restaurant.rating} ★ · 1,200 reviews
        </Text>

        <Spacer />

        <HStack>
          <VStack paddingRight={10}>
            <Text style={{ fontWeight: 'bold', color: 'green' }}>Open</Text>
            <Text>9:00pm</Text>
          </VStack>

          <VStack paddingHorizontal={10}>
            <Text style={{ fontWeight: 'bold', color: 'orange' }}>Cheap</Text>
            <Text>~$10-15</Text>
          </VStack>
        </HStack>

        <Spacer />

        <HStack>
          <TagButton rank={1} name="🍜 Pho" />
          <Spacer />
          <TagButton rank={22} name="🌃 Date Spot" />
        </HStack>

        <Spacer />
      </VStack>

      <HStack>
        {[...new Array(6)].map((_, i) => {
          return (
            <React.Fragment key={i}>
              <Image
                source={{ uri: restaurant.image }}
                style={{ width: 130, height: 130, borderRadius: 20 }}
                resizeMode="cover"
              />
              <Spacer size="lg" />
            </React.Fragment>
          )
        })}
      </HStack>
    </HStack>
  )
}
