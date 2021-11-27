import { queryRestaurant } from '../../../queries/queryRestaurant'
import { queryUser } from '../../../queries/queryUser'
import { userStore } from '../../userStore'
import { CloseButton } from '../../views/CloseButton'
import { Link } from '../../views/Link'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { SlantedTitle } from '../../views/SlantedTitle'
import { graphql, order_by, query, useMutation } from '@dish/graph'
import {
  AbsoluteYStack,
  Box,
  Button,
  Modal,
  Spacer,
  Text,
  Theme,
  Title,
  Toast,
  XStack,
  YStack,
} from '@dish/ui'
import { Plus, X } from '@tamagui/feather-icons'
import React from 'react'
import { ScrollView } from 'react-native'

export const RestaurantAddToListModal = graphql(
  ({ slug, onDismiss }: { slug: string; onDismiss: () => any }) => {
    const user = queryUser(userStore.user?.username ?? '')
    const [restaurant] = queryRestaurant(slug)
    if (!restaurant) {
      return null
    }
    if (!user) {
      console.log('no user')
      return null
    }
    const lists =
      user?.lists({
        limit: 20,
        order_by: [{ created_at: order_by.desc }],
      }) ?? []
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

        <AbsoluteYStack alignItems="center" top={-15}>
          <SlantedTitle size="$4">Add to list</SlantedTitle>
        </AbsoluteYStack>

        <ScrollView style={{ width: '100%', flex: 1, paddingVertical: 30 }}>
          <Spacer />

          <Theme name="yellow">
            <Box marginHorizontal={12} paddingVertical={12} paddingHorizontal={12}>
              <Text>
                Add <Text fontWeight="700">{restaurant.name}</Text> to...
              </Text>
            </Box>
          </Theme>

          <Spacer />

          {lists.map((list) => {
            const listId = list.id
            const isAdded = listsWithRestaurant.some((x) => x.id === listId)
            return (
              <Link
                key={listId}
                name="list"
                params={{
                  slug: list.slug ?? '',
                  userSlug: userStore.user?.username ?? '',
                }}
                onPress={onDismiss}
              >
                <XStack paddingHorizontal={20} paddingVertical={3}>
                  <YStack flex={1}>
                    <Title size="sm">{list?.name}</Title>
                  </YStack>

                  {!isAdded && (
                    <Button
                      theme="active"
                      // TODO
                      borderRadius={1000}
                      icon={<Plus size={12} color="#fff" />}
                      onPress={async (e) => {
                        e.stopPropagation()
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
                    >
                      Add
                    </Button>
                  )}

                  {isAdded && (
                    <Button
                      icon={<X size={16} />}
                      onPress={async (e) => {
                        e.stopPropagation()
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
                </XStack>
              </Link>
            )
          })}
        </ScrollView>
      </Modal>
    )
  }
)
