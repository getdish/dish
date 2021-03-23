import { graphql, order_by, query, useMutation, useRefetch } from '@dish/graph'
import { Plus, X } from '@dish/react-feather'
import React from 'react'
import { ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  Button,
  HStack,
  Modal,
  Spacer,
  Text,
  Title,
  Toast,
  VStack,
} from 'snackui'

import { useColorsFor } from '../../../helpers/useColorsFor'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { queryUser } from '../../../queries/queryUser'
import { userStore } from '../../userStore'
import { CloseButton } from '../../views/CloseButton'
import { LinkButton } from '../../views/LinkButton'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { SlantedTitle } from '../../views/SlantedTitle'

export const RestaurantAddToListModal = graphql(
  ({ slug, onDismiss }: { slug: string; onDismiss: () => any }) => {
    const user = queryUser(userStore.user?.username ?? '')
    const colors = useColorsFor(slug)
    const [restaurant] = queryRestaurant(slug)
    if (!restaurant) {
      return null
    }
    const lists = user.lists({
      limit: 20,
      order_by: [{ created_at: order_by.desc }],
    })
    const restaurantId = restaurant.id
    const listsWithRestaurant = query.list({
      where: {
        user_id: {
          _eq: user.id,
        },
        restaurants: {
          restaurant_id: {
            _eq: restaurantId,
          },
        },
      },
    })

    const [mutation, status] = useMutation((x) => {}, {
      refetchQueries: [listsWithRestaurant],
      awaitRefetchQueries: true,
    })
    console.log('mutation', status)

    return (
      <Modal
        visible
        width="98%"
        maxWidth={600}
        height="95%"
        maxHeight={800}
        overlayDismisses
        onDismiss={onDismiss}
      >
        <PaneControlButtons>
          <CloseButton onPress={onDismiss} />
        </PaneControlButtons>

        <AbsoluteVStack alignItems="center" top={-15}>
          <SlantedTitle>Add to list</SlantedTitle>
        </AbsoluteVStack>

        <ScrollView style={{ width: '100%', flex: 1, paddingVertical: 30 }}>
          <HStack
            alignItems="center"
            backgroundColor={colors.extraLightColor}
            borderWidth={1}
            borderRadius={10}
            margin={10}
            borderColor={colors.lightColor}
            padding={20}
          >
            <Text>
              Add <Text fontWeight="700">{restaurant.name}</Text> to...
            </Text>
          </HStack>

          {lists.map((list) => {
            const listId = list.id
            const isAdded = listsWithRestaurant.some((x) => x.id === listId)
            return (
              <HStack paddingHorizontal={20} paddingVertical={3} key={listId}>
                <VStack flex={1}>
                  <Title size="sm">{list.name}</Title>
                </VStack>

                {!isAdded && (
                  <Button
                    theme="active"
                    // TODO
                    borderRadius={1000}
                    icon={<Plus size={16} color="#fff" />}
                    onPress={async () => {
                      await mutation({
                        fn: (m) => {
                          return m.insert_list_restaurant_one({
                            object: {
                              restaurant_id: restaurantId,
                              list_id: listId,
                              user_id: user.id,
                            },
                          })?.__typename
                        },
                      })
                      Toast.success(`Added!`)
                    }}
                  />
                )}

                {isAdded && (
                  <Button
                    icon={<X size={16} />}
                    onPress={async () => {
                      await mutation({
                        fn: (m) => {
                          return m.delete_list_restaurant_by_pk({
                            list_id: listId,
                            restaurant_id: restaurantId,
                          })?.__typename
                        },
                      })
                      Toast.success(`Removed`)
                    }}
                  />
                )}

                <Spacer />

                <LinkButton
                  name="list"
                  params={{
                    slug: list.slug ?? '',
                    userSlug: userStore.user?.username ?? '',
                    region: list.region ?? '',
                  }}
                  onPressOut={onDismiss}
                >
                  &raquo;
                </LinkButton>
              </HStack>
            )
          })}
        </ScrollView>
      </Modal>
    )
  }
)
