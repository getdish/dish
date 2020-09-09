import { graphql, query } from '@dish/graph'
import { Circle, Divider, HStack, Spacer, Text, VStack } from '@dish/ui'
import React from 'react'
import { Image, ScrollView } from 'react-native'

import { HomeStateItemUser } from '../../state/home-types'
import { NotFoundPage } from '../../views/NotFoundPage'
import { Link } from '../../views/ui/Link'
import { avatar } from './HomePageSearchResults'
import { HomeScrollView } from './HomeScrollView'
import { HomeStackDrawer } from './HomeStackDrawer'
import { StackItemProps } from './HomeStackView'
import { RestaurantReview } from './RestaurantReview'

const useUserQuery = (username: string) => {
  return query.user({
    where: {
      username: {
        _eq: username,
      },
    },
    limit: 1,
  })[0]
}

export default function HomePageUserContainer(
  props: StackItemProps<HomeStateItemUser>
) {
  return (
    <HomeStackDrawer
      closable
      title={`${props.item.username} | Dish food reviews`}
    >
      <HomePageUser {...props} />
    </HomeStackDrawer>
  )
}

const HomePageUser = graphql(function HomePageUser({
  item,
}: StackItemProps<HomeStateItemUser>) {
  const user = useUserQuery(item?.username ?? '')

  if (!user) {
    return <NotFoundPage />
  }

  return (
    <HomeScrollView paddingTop={0}>
      <VStack width="100%" padding={18} paddingRight={16}>
        <HStack position="relative">
          <Circle size={64}>
            <Image source={avatar} />
          </Circle>
          <Spacer size={20} />
          <VStack flex={1}>
            <Text fontSize={28} fontWeight="bold" paddingRight={30}>
              {user.username ?? ''}
            </Text>
            <Spacer size={4} />
            <div />
            <Spacer size={8} />
            <Text color="#777" fontSize={13}>
              {user.username}
            </Text>
            <Spacer size={12} />
          </VStack>
        </HStack>
        <Divider />
      </VStack>

      <VStack spacing="xl" paddingHorizontal="2.5%">
        <VStack>
          <UserReviewsList username={item?.username ?? ''} />
        </VStack>
      </VStack>
    </HomeScrollView>
  )
})

const UserReviewsList = graphql(({ username }: { username: string }) => {
  const user = useUserQuery(username)
  const reviews =
    user.reviews({
      limit: 20,
    }) ?? []
  return (
    <>
      {!reviews.length && <Text>No reviews yet...</Text>}
      {!!reviews.length &&
        reviews.map((review) => <RestaurantReview reviewId={review.id} />)}
    </>
  )
})
