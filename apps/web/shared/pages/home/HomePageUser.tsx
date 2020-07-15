import { graphql, query } from '@dish/graph'
import { Circle, Divider, HStack, Spacer, Text, VStack } from '@dish/ui'
import React from 'react'
import { Image, ScrollView } from 'react-native'

import { drawerBorderRadius } from '../../constants'
import { HomeStateItemUser } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { NotFoundPage } from '../../views/NotFoundPage'
import { Link } from '../../views/ui/Link'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { HomePagePaneProps } from './HomePage'
import { avatar } from './HomePageSearchResults'
import { StackItemProps } from './HomeStackView'
import { StackViewCloseButton } from './StackViewCloseButton'

export default graphql(function HomePageUser({
  item,
}: StackItemProps<HomeStateItemUser>) {
  const username = item?.username ?? ''
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
    <VStack
      flex={1}
      borderRadius={drawerBorderRadius}
      position="relative"
      backgroundColor="#fff"
      overflow="hidden"
    >
      <PageTitleTag>Dish - User profile</PageTitleTag>

      <StackViewCloseButton />

      <VStack padding={18} paddingBottom={0} paddingRight={16}>
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
    </VStack>
  )
})
