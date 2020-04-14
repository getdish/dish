import React, { memo } from 'react'
import { Image, ScrollView, Text } from 'react-native'

import { HomeStateItemUser } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Circle } from '../ui/Circle'
import { Divider } from '../ui/Divider'
import { Link } from '../ui/Link'
import { PageTitleTag } from '../ui/PageTitleTag'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { CloseButton } from './CloseButton'

export default memo(({ state }: { state: HomeStateItemUser }) => {
  const om = useOvermind()
  const reviews = state.reviews ?? []

  return (
    <>
      <PageTitleTag>Dish - User profile</PageTitleTag>

      <ZStack right={10} top={10} pointerEvents="auto" zIndex={100}>
        <CloseButton onPress={() => om.actions.home.popTo(-1)} />
      </ZStack>

      <VStack padding={18} paddingBottom={0} paddingRight={16}>
        <HStack position="relative">
          <Circle size={64}>
            <Image source={'blank'} />
          </Circle>
          <Spacer size={20} />
          <VStack flex={1}>
            <Text
              style={{ fontSize: 28, fontWeight: 'bold', paddingRight: 30 }}
            >
              Username
            </Text>
            <Spacer size={4} />
            <div />
            <Spacer size={8} />
            <Text style={{ color: '#777', fontSize: 13 }}>
              3017 16th St., San Francisco
            </Text>
            <Spacer size={12} />
          </VStack>
        </HStack>
        <Divider />
      </VStack>

      <ScrollView style={{ padding: 18, paddingTop: 16, flex: 1 }}>
        <VStack spacing="xl">
          <VStack>
            {!reviews.length && <Text>No reviews yet...</Text>}
            {!!reviews.length &&
              reviews.map((review) => (
                <Text key={review.id}>
                  <Link
                    name="restaurant"
                    params={{ slug: review.restaurant.slug }}
                  >
                    {review.restaurant.name}
                  </Link>
                  <Text>{review.rating}⭐</Text>
                  <Text>{review.text}</Text>
                </Text>
              ))}
          </VStack>
        </VStack>
      </ScrollView>
    </>
  )
})
