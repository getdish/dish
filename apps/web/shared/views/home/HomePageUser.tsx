import { query } from '@dish/graph'
import { graphql } from '@gqless/react'
import React from 'react'
import { Image, ScrollView, Text } from 'react-native'

import { HomeStateItemUser } from '../../state/home'
import { useOvermind } from '../../state/om'
import { NotFoundPage } from '../NotFoundPage'
import { Circle } from '../ui/Circle'
import { Divider } from '../ui/Divider'
import { Link } from '../ui/Link'
import { PageTitleTag } from '../ui/PageTitleTag'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { CloseButton } from './CloseButton'
import { avatar } from './HomePageSearchResults'

export default graphql(function HomePageUser({
  stateIndex,
}: {
  stateIndex: number
}) {
  const om = useOvermind()
  const state = om.state.home.states[stateIndex] as HomeStateItemUser
  const username = state?.username ?? ''
  console.log('HomePageUser', username)
  const [user] = query.user({
    where: {
      username: {
        _eq: username,
      },
    },
  })
  if (!user) {
    return <NotFoundPage />
  }
  const reviews =
    user.reviews({
      limit: 100,
    }) ?? []

  return (
    <>
      <PageTitleTag>Dish - User profile</PageTitleTag>

      <ZStack right={10} top={10} pointerEvents="auto" zIndex={100}>
        <CloseButton onPress={() => om.actions.home.up()} />
      </ZStack>

      <VStack padding={18} paddingBottom={0} paddingRight={16}>
        <HStack position="relative">
          <Circle size={64}>
            <Image source={avatar} />
          </Circle>
          <Spacer size={20} />
          <VStack flex={1}>
            <Text
              style={{ fontSize: 28, fontWeight: 'bold', paddingRight: 30 }}
            >
              {user.username ?? ''}
            </Text>
            <Spacer size={4} />
            <div />
            <Spacer size={8} />
            <Text style={{ color: '#777', fontSize: 13 }}>{user.username}</Text>
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
