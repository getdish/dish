import { graphql, query } from '@dish/graph'
import { Circle, Divider, HStack, Spacer, Text, VStack } from '@dish/ui'
import React from 'react'
import { Image } from 'react-native'

import { StackItemProps } from '../../AppStackView'
import { HomeStateItemUser } from '../../state/home-types'
import { NotFoundPage } from '../../views/NotFoundPage'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { avatar } from '../search/avatar'
import { ContentScrollView } from './ContentScrollView'
import { StackDrawer } from './StackDrawer'

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
    <StackDrawer closable title={`${props.item.username} | Dish food reviews`}>
      <HomePageUser {...props} />
    </StackDrawer>
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
    <ContentScrollView paddingTop={0}>
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
    </ContentScrollView>
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
